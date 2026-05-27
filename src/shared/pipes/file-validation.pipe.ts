import {ArgumentMetadata, BadRequestException, PipeTransform} from "@nestjs/common";
import {ReadStream} from "node:fs";
import {validateFileFormat, validateFileSize} from "@/src/shared/utils/file.utils";

export class FileValidationPipe implements PipeTransform {
  async  transform(value: any, metadata: ArgumentMetadata) {
        if(!value.filename){
            throw new BadRequestException('File is not load');
        }
        const{filename, createReadStream}=value

        const fileStream=createReadStream() as ReadStream

        const allowedFormat=['jpg','jpeg','png', 'webp', 'gif']
        const isFileFormatValid=validateFileFormat(filename, allowedFormat)
        if(!isFileFormatValid){
            throw new BadRequestException('File format is not valid');        }

        const isFileSizeValid=await validateFileSize(fileStream, 10*1024*1024)
      if(!isFileSizeValid){
          throw new BadRequestException('File size is too large 10mb');
      }
        return value;
    }
}