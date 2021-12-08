import { FileDto } from './../dto/file.dto';
import { CachedFileDto } from '../dto/cached-file.dto';
import { RecvFileDto } from '../dto/received-file.dto';
import { IFsService } from '../interfaces/fs-service.interface';
import { Cache } from 'cache-manager';
import * as namor from 'namor';
import * as path from 'path';
import * as fs from 'fs';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { File } from '../entities/file.entity';
import { promisify } from 'util';
import { GetRemoveFileDto } from '../dto/get-remove-file.dto';

const mkdir = promisify(fs.mkdir);
const copyFile = promisify(fs.copyFile);

/**
 * An implementation of a IFsService using the local fs as a storage
 */
@Injectable()
export class LocalFsService implements IFsService {
  private readonly logger = new Logger(LocalFsService.name);

  constructor(
    private readonly filesOptions: any, // Typescript fails to derive correct type
    private readonly cacheManager: Cache,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Contact cache and return cached file infos
   *
   * @param {string} cid The ID of cached file
   * @returns {CachedFileDto} Information on the cached file
   */
  getCachedInfo(cid: string): Promise<CachedFileDto> {
    return this.cacheManager.get<CachedFileDto>(cid);
  }

  /**
   * Returns a path of the given Path id object
   *
   * @param {string} pid The string path to the file on remote storage
   * @param {GetRemoveFileDto} getRemoveFileDto The additional information for getting a file
   * @returns {Promise<CachedFileDto>} The information about the cached file
   */
  async getFile(
    pid: string,
    getRemoveFileDto: GetRemoveFileDto,
  ): Promise<CachedFileDto> {
    const file = (
      await this.entityManager.query(
        `SELECT * FROM ${getRemoveFileDto.fileType} WHERE "id" = $1`,
        [pid],
      )
    )[0] as File;
    if (file === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Could not find file to get',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const tryCachedFile = this.getCachedInfo(pid.toString());
    console.log(tryCachedFile);
    const cachedFile = {
      filename: file.filename,
      originalname: file.filename,
      mimetype: file.mimetype,
      path: path.join(this.filesOptions.endpoint.dest, namor.generate()),
      destination: this.filesOptions.endpoint.dest,
    } as CachedFileDto;
    await this.cacheManager.set<CachedFileDto>(pid.toString(), cachedFile, {
      ttl: this.filesOptions.downloadTTL,
    });

    return cachedFile;
  }

  /**
   * Caches a cached file information with generated id (cid) into the cache (redis)
   * @param {RecvFileDto} file The information on the cached file ([From Multer]{@link https://docs.nestjs.com/techniques/file-upload})
   * @returns {CachedFileDto} The cached files information with id
   */
  async cacheFile(file: RecvFileDto): Promise<CachedFileDto> {
    const id = namor.generate();
    const cachedFile = {
      id,
      ...file,
    };
    await this.cacheManager.set<CachedFileDto>(id, cachedFile);
    return cachedFile;
  }

  /**
   * Commits the file given its cache id from cache to local storage
   *
   * @param {string} cid The cache id of the cached file
   * @param {string[]} subFolder The sub folders of the path to save the file to
   * @returns {Promise<FileDto>} The full path of the file on the local fs
   */
  async commitFile(cid: string, subFolder: string[]): Promise<FileDto> {
    const cachedFile = await this.getCachedInfo(cid);
    const remotePath = path.join(
      this.filesOptions.baseUploadPath,
      ...subFolder,
    );

    const fullPath = path.join(remotePath, cachedFile.originalname);

    if (fs.existsSync(fullPath)) {
      const errMsg = `File '${cachedFile.originalname}' already exists in remote location!`;
      this.logger.log(`${errMsg} (in path: ${remotePath})`);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: errMsg,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    /**
     * Create remote subdirectory if it does not exist already
     */
    if (!fs.existsSync(remotePath)) {
      try {
        await mkdir(remotePath, { recursive: true });
        this.logger.log('Directories successfully created');
      } catch (err) {
        const errMsg = `Could not create directories ${subFolder}`;
        this.logger.error(errMsg);
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: errMsg,
          },
          HttpStatus.NOT_FOUND,
        );
      }
    }

    try {
      await copyFile(cachedFile.path, fullPath);
      this.logger.log('Cached file successfully copied');
    } catch (err) {
      throw new Error(`Error copying cached file (path: ${cachedFile.path})`);
    }

    this.removeCachedFile(cid);

    return {
      path: remotePath,
      filename: cachedFile.originalname,
      mimetype: cachedFile.mimetype,
    };
  }

  /**
   * Removes the cached file using its cache id from cache and returns the cache information that has been deleted
   *
   * @param {string} cid The cache id of the cached file
   * @returns {Promise<CachedFileDto>} The deleted cached files' informations
   */
  async removeCachedFile(cid: string): Promise<CachedFileDto> {
    const cachedFile = await this.getCachedInfo(cid);
    this.cacheManager.del(cid);
    return cachedFile;
  }

  /**
   * Removes the file permanently from remote storage and its parent directory if it is empty after file removal
   *
   * @param {string} id The files id in the DB
   * @param {GetRemoveFileDto} getRemoveFileDto The information needed to remove the file
   */
  async removeFile(id: string, getRemoveFileDto: GetRemoveFileDto) {
    const file = (await this.entityManager.query(
      'SELECT * FROM ? WHERE id = ?',
      [getRemoveFileDto.fileType, id],
    )) as File;
    console.log(file);
    if (file === undefined) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Could not find file to remove',
        },
        HttpStatus.NOT_FOUND,
      );
    }
    const filePath = path.join(file.path, file.filename);
    const parent = path.dirname(filePath);

    this.logger.log('Delete file:', filePath);
    fs.unlink(filePath, (err) => {
      if (err) {
        return this.logger.error('Could not delete cached file!', err);
      }
      this.logger.log('File deleted!');
    });

    fs.readdir(parent, (err, files) => {
      if (err) {
        return this.logger.error(`Could not read directory ${parent}`, err);
      }
      if (!files.length) {
        fs.rmdir(parent, (err) => {
          if (err) {
            return this.logger.error(
              `Could not remove directory ${parent}`,
              err,
            );
          }
          this.logger.log('Directory successfully removed');
        });
      }
    });
    this.entityManager.query('DELETE FROM ? WHERE id = ?', [
      getRemoveFileDto.fileType,
      id,
    ]);
  }
}
