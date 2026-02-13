import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChargeDto } from './dto/create-charge.dto';
import { UpdateChargeDto } from './dto/update-charge.dto';
import { QueryChargesDto } from './dto/query-charges.dto';
import { Prisma } from '@prisma/client';
import { calculateInterest, InterestCalculation } from '../commons/utils/interest-calculator';
import {
  PaginatedChargesResponse,
  ChargeWithCustomer,
  ChargeWithRelations,
} from './interfaces/charge-response.interface';

@Injectable()
export class ChargesService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: QueryChargesDto): Promise<PaginatedChargesResponse> {
    const { page = 1, limit = 10, status } = query;

    const [data, total] = await Promise.all([
      this.prisma.charge.findMany({
        where: status ? { status } : {},
        orderBy: { dueDate: 'asc' },
        include: { customer: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.charge.count({ where: status ? { status } : {} }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  findOne(id: number): Promise<ChargeWithRelations> {
    return this.prisma.charge.findUniqueOrThrow({
      where: { id },
      include: {
        customer: true,
        payment: true,
      },
    });
  }

  create(data: CreateChargeDto): Promise<ChargeWithCustomer> {
    return this.prisma.charge.create({
      data: {
        customerId: data.customerId,
        amount: new Prisma.Decimal(data.amount),
        dueDate: new Date(data.dueDate),
      },
      include: { customer: true },
    });
  }

  update(id: number, data: UpdateChargeDto): Promise<ChargeWithCustomer> {
    const updateData: Prisma.ChargeUpdateInput = {};

    if (data.amount !== undefined) {
      updateData.amount = new Prisma.Decimal(data.amount);
    }
    if (data.dueDate !== undefined) {
      updateData.dueDate = new Date(data.dueDate);
    }
    if (data.status !== undefined) {
      updateData.status = data.status;
    }

    return this.prisma.charge.update({
      where: { id },
      data: updateData,
      include: { customer: true },
    });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.charge.delete({ where: { id } });
  }

  async calculatePaymentAmount(id: number): Promise<InterestCalculation> {
    const charge = await this.prisma.charge.findUniqueOrThrow({
      where: { id },
      include: { payment: true },
    });

    if (charge.payment) {
      throw new Error('Charge already paid');
    }

    return calculateInterest(charge.amount, charge.dueDate);
  }
}
