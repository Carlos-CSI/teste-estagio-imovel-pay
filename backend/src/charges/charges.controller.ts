import { Body, Controller, Get, Param, Post, Delete, Patch, ParseIntPipe, HttpCode, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { ChargesService } from './charges.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { QueryChargesDto } from './dto/query-charges.dto';
import { PaginatedChargesResponse, ChargeWithCustomer, ChargeWithRelations } from './interfaces/charge-response.interface';

@ApiTags('charges')
@Controller('charges')
export class ChargesController {
  constructor(private service: ChargesService) {}

  @Get()
  @ApiOperation({ summary: 'List all charges with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List returned successfully.' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDENTE', 'PAGO', 'CANCELADO'] })
  findAll(@Query() query: QueryChargesDto): Promise<PaginatedChargesResponse> {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get charge by ID' })
  @ApiResponse({ status: 200, description: 'Charge returned successfully.' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<ChargeWithRelations> {
    return this.service.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create new charge' })
  @ApiResponse({ status: 201, description: 'Charge created successfully.' })
  create(@Body() dto: CreateChargeDto): Promise<ChargeWithCustomer> {
    return this.service.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update charge' })
  @ApiResponse({ status: 200, description: 'Charge updated successfully.' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateChargeDto): Promise<ChargeWithCustomer> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete charge by ID' })
  @ApiResponse({ status: 204, description: 'Charge deleted successfully.' })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(id);
  }
}
