import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { QueryCustomerChargesDto } from './dto/query-customer-charges.dto';
import type { Customer } from '@prisma/client';
import { CustomerWithCharges } from './interfaces/customer-response.interface';
import { Prisma } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: number, query: QueryCustomerChargesDto): Promise<CustomerWithCharges> {
    const { status, orderBy = 'dueDate', order = 'asc' } = query;

    // Build where clause for charges
    const chargeWhere: Prisma.ChargeWhereInput = status ? { status } : {};

    // Build orderBy clause for charges
    const chargeOrderBy: Prisma.ChargeOrderByWithRelationInput = {
      [orderBy]: order,
    };

    return this.prisma.customer.findUniqueOrThrow({
      where: { id },
      include: {
        charges: {
          where: chargeWhere,
          orderBy: chargeOrderBy,
          include: { payment: true },
        },
      },
    });
  }

  create(data: CreateCustomerDto): Promise<Customer> {
    return this.prisma.customer.create({
      data: {
        name: data.name,
        cpf: data.cpf,
      },
    });
  }

  update(id: number, data: UpdateCustomerDto): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  remove(id: number): Promise<Customer> {
    // With referential action `onDelete: Cascade` configured in Prisma schema,
    // deleting the customer will automatically remove related charges.
    return this.prisma.customer.delete({ where: { id } });
  }
}
