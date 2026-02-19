import { IsString, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsCpf } from '../../commons/validators/is-cpf.validator';
import { Transform } from 'class-transformer';

export class CreateCustomerDto {
  @ApiProperty({ example: 'christian volz', description: 'Customer name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12345678900 or 000.000.000-00', description: 'Customer CPF' })
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/\D/g, '') : value))
  @IsString()
  @Matches(/^\d{11}$/, { message: 'Invalid CPF Format' })
  @IsCpf({ message: 'Invalid CPF' })
  cpf: string;
}
