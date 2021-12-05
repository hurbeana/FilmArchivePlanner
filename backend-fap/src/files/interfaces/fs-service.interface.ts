import { RecvFileDto } from '../dto/received-file.dto';
import { CachedFileDto } from '../dto/cached-file.dto';
import { FileDto } from '../dto/file.dto';
import { GetRemoveFileDto } from '../dto/get-remove-file.dto';
export interface IFsService {
  /**
   * Contact cache and return cached file infos
   *
   * @param {string} cid The ID of cached file
   * @returns {CachedFileDto} Information on the cached file
   */
  getCachedInfo(id: string): CachedFileDto | Promise<CachedFileDto>;

  /**
   * Returns a path of the given Path id object
   *
   * @param {string} pid The string path to the file on remote storage
   * @param {GetRemoveFileDto} getRemoveFileDto The additional information for getting a file
   * @returns {Promise<CachedFileDto>} The information about the cached file
   */
  getFile(
    pid: string,
    getRemoveFileDto: GetRemoveFileDto,
  ): Promise<CachedFileDto> | CachedFileDto;

  /**
   * Caches a cached file information with generated id (cid) into the cache (redis)
   * @param {RecvFileDto} file The information on the cached file ([From Multer]{@link https://docs.nestjs.com/techniques/file-upload})
   * @returns {CachedFileDto} The cached files information with id
   */
  cacheFile(file: RecvFileDto): Promise<CachedFileDto> | CachedFileDto;

  /**
   * Commits the file given its cache id from cache to remote storage using a remote transfer protocol
   *
   * @param {string} cid The cache id of the cached file
   * @param {Array<string>} subfolder An array of folder structure that exists or will be created. The file will be placed inside the last folder of the given structure.
   * @param {FileType} fileType The filetype that will be created
   * @returns {Promise<FileDto>} The full path of the file on the remote storage
   */
  commitFile(
    cid: string,
    subfolder: string[],
    //fileType: FileType,
  ): Promise<FileDto> | FileDto;

  /**
   * Removes the cached file using its cache id from cache and returns the cache information that has been deleted
   *
   * @param {string} cid The cache id of the cached file
   * @returns {Promise<CachedFileDto>} The deleted cached files' informations
   */
  removeCachedFile(cid: string): Promise<CachedFileDto> | CachedFileDto;

  /**
   * Removes the file permanently from remote storage and its parent directory if it is empty after file removal
   *
   * @param {string} id The files id in the DB
   * @param {GetRemoveFileDto} getRemoveFileDto The information needed to remove the file
   */
  removeFile(id: string, getRemoveFileDto: GetRemoveFileDto);
}
