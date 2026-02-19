import { IsOptional, IsEnum } from 'class-validator';
import { ChargeStatus } from '@prisma/client';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class QueryCustomerChargesDto {
  @ApiPropertyOptional({
    enum: ChargeStatus,
    description: 'Filter charges by status',
  })
  @IsOptional()
  @IsEnum(ChargeStatus)
  status?: ChargeStatus;

  @ApiPropertyOptional({
    enum: ['dueDate', 'amount', 'status'],
    default: 'dueDate',
    description: 'Field to order charges by',
  })
  @IsOptional()
  @IsEnum(['dueDate', 'amount', 'status'])
  orderBy?: 'dueDate' | 'amount' | 'status';

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    default: 'asc',
    description: 'Order direction',
  })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  order?: 'asc' | 'desc';
}
