import { IFsService } from './interfaces/fs-service.interface';
import { FILES_PERSISTENCY_PROVIDER } from './files.constants';
import {
  Controller,
  Delete,
  Get,
  Inject,
  Logger,
  Param,
  Post,
  Query,
  Response,
  StreamableFile,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { CachedFileDto } from './dto/cached-file.dto';
import { GetRemoveFileDto } from './dto/get-remove-file.dto';

@Controller('files')
export class FilesController {
  private readonly logger = new Logger(FilesController.name);

  constructor(
    @Inject(FILES_PERSISTENCY_PROVIDER)
    private readonly filesService: IFsService,
  ) {}

  /**
   * Contact cache and return cached file infos
   *
   * @param {string} cid ID of cached file
   * @returns {CachedFileDto} Information on the cached file
   */
  @Get('/cache/:cid')
  async getInfoCache(@Param('cid') cid: string): Promise<CachedFileDto> {
    return this.filesService.getCachedInfo(cid);
  }

  /**
   * Retrieves and sends file from remote storage
   *
   * @param {string} pid The string path to the file on remote storage
   * @param {*} res The expressjs response object
   * @returns {StreamableFile} A streamable file via http
   */
  @Get(':pid')
  async getFile(
    @Param('pid') pid: string,
    @Query() getRemoveFileDto: GetRemoveFileDto,
    @Response({ passthrough: true })
    res,
  ): Promise<StreamableFile> {
    this.logger.log(`Starting file serving`);
    const cachePath = await this.filesService.getFile(pid, getRemoveFileDto);
    this.logger.log(`Serving file ${cachePath.filename}`);
    const file = createReadStream(cachePath.path);
    res.set({
      'Content-Type': cachePath.mimetype,
      'Content-Disposition': `attachment; filename="${cachePath.originalname}`,
    });
    return new StreamableFile(file);
  }

  /**
   * Saves a file to cache and returns cached files' information
   *
   * @param {Express.Multer.File} file The file to be cached from Multer
   * @returns {Promise<CachedFileDto>} The cached files' information
   */
  @Post('/cache')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<CachedFileDto> {
    return await this.filesService.cacheFile(file);
  }

  /**
   * Saves multiple files to persistent storage and returns all cached files' information
   *
   * @param {Array<Express.Multer.File>} files The files to be cached
   * @returns {*} An Array of the cached files' information
   */
  @Post('/cache/many')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    files.map((file) => this.filesService.cacheFile(file));
    return files;
  }

  /**
   * Removes the cached file from cache given its cache id
   *
   * @param {string} id The cached files' id from cache
   * @returns {Promise<CachedFileDto>} The removed files informations from cache
   */
  @Delete('/cache/:id')
  async removeFileCache(@Param('id') id: string): Promise<CachedFileDto> {
    return this.filesService.removeCachedFile(id);
  }

  /**
   * Removes file from remote permanently storage
   *
   * @param {string} id The Path entity id
   */
  @Delete(':id')
  async removeFile(
    @Param('id') id: string,
    @Query() getRemoveFileDto: GetRemoveFileDto,
  ): Promise<void> {
    await this.filesService.removeFile(id, getRemoveFileDto);
  }
}
