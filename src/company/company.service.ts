import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import mongoose, { Model } from 'mongoose';
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

      // check if the logo field is not empty
      if (!file) {
        throw new BadRequestException('Logo should not be empty.');
      }

      const newCompany = new this.companyModel(createCompanyDto);

      newCompany.logo = file.filename;

      // save company in the DB
      await newCompany.save();

      return {
        success: true,
        company: newCompany,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // retrieve companies list from DB
  async getCompanies() {
    try {
      const companies = await this.companyModel.find();

      return {
        success: true,
        companies,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // retrieve company by ID from DB
  async getCompany(id: string) {
    try {
      const company = await this.companyModel.findOne({ id });
      return {
        success: true,
        company,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // update a company in DB
  async updateCompany(
    id: string,
    file: Express.Multer.File,
    updateCompanyDto: UpdateCompanyDto,
  ) {
    try {
      const company = await this.companyModel.findOne({ id });

      // check if the company we wan to update is exists in DB
      if (company) {
        // check if name field not empty
        if (updateCompanyDto.name === '') {
          throw new BadRequestException('Name should not be empty.');
        }

        // check if logo field not empty
        if (!file) {
          throw new BadRequestException('Logo should not be empty.');
        }

        // update the company in DB
        await this.companyModel.updateOne(
          { _id: company._id },
          {
            $set: {
              name: updateCompanyDto.name,
              logo: file.filename,
              phone: updateCompanyDto.phone,
              city: updateCompanyDto.city,
            },
          },
        );

        return {
          success: true,
          message: 'Company updated successfully',
        };
      } else {
        throw new BadRequestException('Company Not Found!.');
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // remove company from DB
  async remove(_id: string) {
    try {
      await this.companyModel.deleteOne({ _id });

      return {
        success: true,
        message: 'Company deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
