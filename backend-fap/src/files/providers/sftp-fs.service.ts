import { Cache } from 'cache-manager';
import { CachedFileDto } from 'src/files/dto/cached-file.dto';
import { RecvFileDto } from 'src/files/dto/received-file.dto';
import { IFsService } from '../interfaces/fs-service.interface';
import * as namor from 'namor';
import * as Client from 'ssh2-sftp-client';
import * as path from 'path';
import { EntityManager } from 'typeorm';
import { FileDto } from '../dto/file.dto';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { GetRemoveFileDto } from '../dto/get-remove-file.dto';
import { File } from '../entities/file.entity';
import * as fs from 'fs';
import { promisify } from 'util';

const mkdir = promisify(fs.mkdir);
const rename = promisify(fs.rename);

/**
 * An implementation of a IFsService using sftp
 *
 * Make sure to configure the config.toml
 */
@Injectable()
export class FtpFsService implements IFsService {
  private readonly logger = new Logger(FtpFsService.name);

  constructor(
    private readonly filesOptions: any, // Typescript fails to derive correct type
    private readonly cacheManager: Cache,
    private readonly entityManager: EntityManager,
  ) {}

  /**
   * Instantiates a connection to the sftp server
   *
   * @private
   * @returns {*} a sftp client connection [ssh2-sftp-client]{@link https://www.npmjs.com/package/ssh2-sftp-client}
   */
  private getClient(): any {
    const _sftp = new Client();
    return _sftp;
  }

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
    /**
     * First look for the file to get in the file cache.
     * Renew the TTL of the cache entry for this file if found.
     */
    const tryCachedFile = await this.getCachedInfo(pid.toString());
    if (tryCachedFile !== null && tryCachedFile !== undefined) {
      this.cacheManager.set<CachedFileDto>(pid.toString(), tryCachedFile, {
        ttl: this.filesOptions.downloadTTL,
      });
      this.logger.log('Getting File from cache location.');
      return tryCachedFile;
    }

    this.logger.log(
      'File not found in cache. Retrieving file information from db.',
    );
    /**
     * File is not yet cached -> get stored file information via query from db.
     */
    const file = (
      await this.entityManager.query(
        `SELECT * FROM ${getRemoveFileDto.fileType} WHERE "id" = $1`,
        [pid],
      )
    )[0] as File;
    if (file === undefined || file === null) {
      const errMsg = `Could not find file with id: ${pid}`;
      this.logger.error(errMsg);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: errMsg,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    /**
     * Create and set values for new file cache entry from stored file information.
     */
    const newUuidFilename = namor.generate();
    const cachedFile = {
      filename: newUuidFilename,
      originalname: file.filename,
      mimetype: file.mimetype,
      path: path.join(
        this.filesOptions.endpoint.baseCachePath,
        newUuidFilename,
      ),
      destination: this.filesOptions.endpoint.baseCachePath,
    } as CachedFileDto;

    this.logger.log('Caching stored file.');
    /**
     * Connect sftp client and copy stored file to cache location.
     */
    const client = await this.getClient();
    await client.connect(this.filesOptions.connectOptions);
    await client.fastGet(path.join(file.path, file.filename), cachedFile.path);
    await client.end();

    /**
     * Save cache file entry in redis cache store.
     */
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
    const realCachePath = path.join(
      this.filesOptions.baseCachePath,
      file.filename,
    );
    const cachedFile = {
      id,
      ...file,
      path: realCachePath,
      destination: this.filesOptions.baseCachePath,
    };
    // TODO: FIX RACE CONDITION WITH READY FLAG IN CACHEFILEDTO !
    await this.cacheManager.set<CachedFileDto>(id, cachedFile);

    if (!fs.existsSync(this.filesOptions.baseCachePath)) {
      await mkdir(this.filesOptions.baseCachePath);
    }

    try {
      await rename(file.path, realCachePath);
    } catch (err) {
      console.error(err);
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Could not move received file to correct cache location!',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return cachedFile;
  }

  /**
   * Commits the file given its cache id from cache to remote storage using sftp
   *
   * @param {string} cid The cache id of the cached file
   * @param {string[]} subFolder The sub folders of the path to save the file to
   * @returns {Promise<string>} The full path of the file on the remote storage
   */
  async commitFile(cid: string, subFolder: string[]): Promise<FileDto> {
    const cachedFile = await this.getCachedInfo(cid);
    const remotePath = path.join(
      this.filesOptions.baseUploadPath,
      ...subFolder,
    );
    const client = await this.getClient();
    await client.connect(this.filesOptions.connectOptions);
    const dirExists = await client.exists(remotePath);
    if (!dirExists) {
      await client.mkdir(remotePath, true);
    }
    const fullPath = path.join(remotePath, cachedFile.originalname);
    await client.put(cachedFile.path, fullPath).then(() => client.end());

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
    const file = (
      await this.entityManager.query(
        `SELECT * FROM ${getRemoveFileDto.fileType} WHERE "id" = $1`,
        [id],
      )
    )[0] as File;
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
    const client = await this.getClient();
    await client.connect(this.filesOptions.connectOptions);
    const parent = path.dirname(filePath);
    await client.delete(filePath);
    const ls = await client.list(parent);
    if (!ls.length) {
      await client.rmdir(parent);
    }
    await client.end();
    await this.entityManager.query(
      `DELETE FROM ${getRemoveFileDto.fileType} WHERE "id" = $1`,
      [id],
    );
  }
}
