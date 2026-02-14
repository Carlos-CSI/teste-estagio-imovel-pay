import { IsInt, IsDateString, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsFutureDate } from '../../commons/validators/is-future-date.validator';
import { IsWithinOneYear } from '../../commons/validators/is-within-one-year.validator';

export class CreateChargeDto {
  @ApiProperty({ example: 1, description: 'Customer ID' })
  @IsInt()
  @IsPositive()
  customerId: number;

  @ApiProperty({ example: 100.5, description: 'Charge amount in BRL' })
  @Type(() => Number)
  @IsPositive()
  @Min(0.01)
  amount: number;

  @ApiProperty({ example: '2026-03-01T00:00:00.000Z', description: 'Due date (must be today or future date)' })
  @IsDateString()
  @IsFutureDate({ message: 'the date must be today or a future date' })
  @IsWithinOneYear({ message: 'the date must be at most 1 year from creation' })
  dueDate: string;
}
