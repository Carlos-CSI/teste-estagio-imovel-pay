import { IsInt, IsDateString, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateChargeDto {
  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsInt()
  @IsPositive()
  customerId: number;

  @ApiProperty({ example: 100.50, description: 'Charge amount in BRL' })
  @Type(() => Number)
  @IsPositive()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2026-03-01T00:00:00.000Z', description: 'Due date' })
  @IsDateString()
  dueDate: string;
}
