import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import type { Customer } from '@prisma/client';
import { CustomerWithCharges } from './interfaces/customer-response.interface';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number): Promise<CustomerWithCharges> {
    return this.prisma.customer.findUniqueOrThrow({
      where: { id },
      include: { charges: true },
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
