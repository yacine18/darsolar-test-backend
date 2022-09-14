import { IsNotEmpty } from "class-validator"

export class CreateCompanyDto {

    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    logo: string

    phone: string

    city: string
}
