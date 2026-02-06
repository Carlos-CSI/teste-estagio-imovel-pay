import { IsInt, IsPositive, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty,  } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @ApiProperty({ description: 'ID of the charge to pay', example: 1 })
  @IsInt()
  @IsPositive()
  chargeId: number;

  @ApiProperty({ description: 'Payment amount', example: 100.5 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  amount: number;

  @ApiProperty({ description: 'Payment method', example: PaymentMethod.PIX, enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;
}
