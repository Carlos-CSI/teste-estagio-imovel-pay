import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.customer.findMany({
      include: { charges: true },
    });
  }

  findOne(id: number) {
    return this.prisma.customer.findUnique({
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
}
