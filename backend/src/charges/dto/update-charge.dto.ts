import { IsDateString, IsEnum, IsPositive, Min, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class UpdateChargeDto {
  @ApiProperty({ example: 150.75, description: 'Charge amount in BRL', required: false })
  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Min(0.01)
  amount?: number;

  @ApiProperty({ example: '2026-04-01T00:00:00.000Z', description: 'Due date', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({
    example: 'PAGO',
    description: 'Charge status',
    enum: ChargeStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChargeStatus, { message: 'Status must be PENDENTE, PAGO, or CANCELADO' })
  status?: ChargeStatus;
}
