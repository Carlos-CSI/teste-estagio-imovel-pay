import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany();
  }

  findOne(id: number) {
    return this.prisma.customer.findUniqueOrThrow({
      where: { id },
      include: { charges: true },
    });
  }

  create(data: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: {
        name: data.name,
        cpf: data.cpf,
      },
    });
  }

  update(id: number, data: UpdateCustomerDto) {
    return this.prisma.customer.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
  }

  remove(id: number) {
    // With referential action `onDelete: Cascade` configured in Prisma schema,
    // deleting the customer will automatically remove related charges.
    return this.prisma.customer.delete({ where: { id } });
  }
}
