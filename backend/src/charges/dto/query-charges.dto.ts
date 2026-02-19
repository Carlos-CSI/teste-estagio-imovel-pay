import { IsOptional, IsEnum, IsInt, Min, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ChargeStatus } from '@prisma/client';
import { Type } from 'class-transformer';

export class QueryChargesDto {
  @ApiProperty({
    example: 1,
    description: 'Page number (starts at 1)',
    required: false,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({
    example: 10,
    description: 'Items per page',
    required: false,
    default: 10,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({
    example: 'PENDENTE',
    description: 'Filter by status',
    enum: ChargeStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ChargeStatus, { message: 'Status must be PENDENTE, PAGO, or CANCELADO' })
  status?: ChargeStatus;

  @ApiProperty({
    example: 'dueDate',
    description: 'Order by field',
    enum: ['dueDate', 'amount', 'status'],
    required: false,
    default: 'dueDate',
  })
  @IsOptional()
  @IsIn(['dueDate', 'amount', 'status'])
  orderBy?: 'dueDate' | 'amount' | 'status' = 'dueDate';

  @ApiProperty({
    example: 'asc',
    description: 'Order direction',
    enum: ['asc', 'desc'],
    required: false,
    default: 'asc',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc' = 'asc';
}
