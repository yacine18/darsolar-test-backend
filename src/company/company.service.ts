import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import { Model } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class CompanyService {
  constructor(
    @InjectModel(Company.name) private companyModel: Model<CompanyDocument>,
  ) {}

  // create new company
  async createCompany(
    file: Express.Multer.File,
    createCompanyDto: CreateCompanyDto,
  ) {
    try {
      // check if the name field is not empty
      if (createCompanyDto.name === '') {
        throw new BadRequestException('Name should not be empty.');
      }

      // check if the logo fields is not empty
      if (!file) {
        throw new BadRequestException('Logo should not be empty.');
      }

      const newCompany = new this.companyModel(createCompanyDto);

      newCompany.logo = file.filename;

      // save company in the DB
      await newCompany.save();

      return newCompany;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // retrieve companies list from DB
  async getCompanies() {
    try {
      const companies = await this.companyModel.find();

      return companies;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // retrieve company by ID from DB
  async getCompany(id: string) {
    try {
      const company = await this.companyModel.findOne({ _id: id });
      return company;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // update a company in DB
  async updateCompany(
    _id: string,
    file: Express.Multer.File,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const editCompany = new this.companyModel(updateCompanyDto);

      editCompany.logo = file.filename;
      const updatedCompany = await this.companyModel.findByIdAndUpdate(
        _id,
        editCompany,
      );
      return updatedCompany;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // remove company from DB
  async remove(_id: string) {
    try {
      await this.companyModel.deleteOne({ _id });

      return 'Company deleted successfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
