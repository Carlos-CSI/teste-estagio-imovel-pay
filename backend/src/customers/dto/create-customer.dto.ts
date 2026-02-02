import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerDto {
  @ApiProperty({ example: 'John Doe', description: 'Customer name' })
  @IsString()
  name: string;

  @ApiProperty({ example: '12345678900', description: 'Customer CPF' })
  @IsString()
  cpf: string;
}
