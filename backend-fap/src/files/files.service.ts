import { CachedFileDto } from './dto/cached-file.dto';
import { RecvFileDto } from './dto/received-file.dto';
import { Injectable, NotImplementedException } from '@nestjs/common';

@Injectable()
export class FilesService {
  getCachedInfo(id: string): CachedFileDto {
    console.log('FileService - getChachedInfo:', id);
    throw new NotImplementedException();
  }

  getFile(id: number) {
    //: ??? maybe Stream<File> or something
    // TODO: Contact generic FSStorage?? and return file stream
    console.log('FileService - getFile:', id);
    throw new NotImplementedException();
  }

  stageFile(file: RecvFileDto): CachedFileDto {
    /* TODO:
      - generate human friendly guid
      - redis entry -> path to local file / whole file dto (set ttl)
      - return file dto (with ID)
     */
    console.log('FileService - stageFile:', file);
    throw new NotImplementedException();
  }

  commitFile(id: string) {
    // : PathDto
    // TODO: Commit file with generic FSStorage to persisent Storage (how?) and create entry in DB (Path)
    console.log('FileService - commitFile:', id);
    throw new NotImplementedException();
  }

  removeStagedFile(id: string): CachedFileDto {
    // TODO: Remove key from redis and return infos
    console.log('FileService - removeStagedFile:', id);
    throw new NotImplementedException();
  }

  removeFile(id: number) {
    //: PathDto
    // TODO: Remove Path entry from DB and persistent Storage
    console.log('FileService - removeFile:', id);
    throw new NotImplementedException();
  }
}
