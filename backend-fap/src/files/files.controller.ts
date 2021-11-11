import {
  Controller,
  Delete,
  Get,
  NotImplementedException,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { CachedFileDto } from './dto/cached-file.dto';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('/cache/:id')
  findOneCache(@Param('id') id: string): CachedFileDto {
    console.log(id);
    // TODO: return metainformation about cached file
    // return this.filesService.findOne(id);
    throw new NotImplementedException();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    console.log(id);
    // TODO: retrieves and stream file from persistent storage
    // return this.filesService.findOne(id);
    throw new NotImplementedException();
  }

  @Post('/cache')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File): CachedFileDto {
    // TODO: Saves multiple files and returns their metadata (CachedFile)
    console.log(file);
    throw new NotImplementedException();
  }

  @Post('/cache/many')
  @UseInterceptors(AnyFilesInterceptor())
  uploadFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Array<CachedFileDto> {
    // TODO: Same as uploadFile but for multiple files
    console.log(files);
    throw new NotImplementedException();
  }

  @Delete('/cache/:id')
  removeFileCache(@Param('id') id: string) {
    // TODO: remove from cache (remove redis key/values)
    console.log(id);
    throw new NotImplementedException();
  }

  @Delete(':id')
  removeFile(@Param('id') id: string) {
    // TODO: remove from persistent storage
    console.log(id);
    throw new NotImplementedException();
  }
}
