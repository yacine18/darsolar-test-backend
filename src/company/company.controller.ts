import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@UseInterceptors(
  FileInterceptor('logo', {
    storage: diskStorage({
      destination: './uploads/logos',
      filename: (req, file, cb) => {
        const randomName = Array(12)
          .fill(null)
          .map(() => Math.round(Math.random() * 16).toString())
          .join('');

        return cb(null, `${randomName}${extname(file.originalname)}`);
      },
    }),
  }),
)
@Controller('api/companies')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createCompanyDto: CreateCompanyDto,
  ) {
    return this.companyService.createCompany(file, createCompanyDto);
  }

  @Get()
  getCompanies() {
    return this.companyService.getCompanies();
  }

  @Get(":id")
  getCompany(@Param("id") id: string) {
    return this.companyService.getCompany(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateCompany(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.companyService.remove(_id);
  }
}