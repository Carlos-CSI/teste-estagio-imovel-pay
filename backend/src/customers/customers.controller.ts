import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  Patch,
  ParseIntPipe,
  HttpCode,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerChargesDto } from './dto/query-customer-charges.dto';
import type { Customer } from '@prisma/client';
import { CustomerWithCharges } from './interfaces/customer-response.interface';

@ApiTags('customers')
@Controller('customers')
export class CustomersController {
  constructor(private service: CustomersService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers' })
  @ApiResponse({ status: 200, description: 'List returned successfully.' })
  findAll(): Promise<Customer[]> {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get customer by ID with optional charge filters' })
  @ApiResponse({ status: 200, description: 'Customer returned successfully.' })
  findOne(
    @Param('id', ParseIntPipe) id: number,
    @Query() query: QueryCustomerChargesDto,
  ): Promise<CustomerWithCharges> {
    return this.service.findOne(id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create new customer' })
  @ApiResponse({ status: 201, description: 'Customer created successfully.' })
  create(@Body() dto: CreateCustomerDto): Promise<Customer> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update customer name' })
  @ApiResponse({ status: 200, description: 'Customer updated successfully.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateCustomerDto): Promise<Customer> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiResponse({ status: 204, description: 'Customer deleted successfully.' })
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    await this.service.remove(id);
  }
}
