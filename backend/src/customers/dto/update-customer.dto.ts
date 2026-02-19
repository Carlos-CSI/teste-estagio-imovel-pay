import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiProperty({ example: 'christian berny volz', description: 'Customer name' })
  @IsString()
  name: string;
}
