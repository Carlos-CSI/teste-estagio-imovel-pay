import { Body, Controller, Get, Param, Post, Delete, ParseIntPipe, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  PaymentWithCharge,
  PaymentWithChargeAndCustomer,
} from './interfaces/payment-response.interface';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private service: PaymentsService) {}

  @Get()
  @ApiOperation({ summary: 'List all payments' })
  @ApiResponse({ status: 200, description: 'List returned successfully.' })
  findAll(): Promise<PaymentWithChargeAndCustomer[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment returned successfully.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<PaymentWithChargeAndCustomer> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new payment and update related charge' })
  @ApiResponse({ status: 201, description: 'Payment created successfully.' })
  create(@Body() dto: CreatePaymentDto): Promise<PaymentWithCharge> {
    return this.service.create(dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete payment by ID' })
  @ApiResponse({ status: 204, description: 'Payment deleted successfully.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
