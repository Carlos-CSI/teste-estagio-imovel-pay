import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import {
  PaymentWithCharge,
  PaymentWithChargeAndCustomer,
} from './interfaces/payment-response.interface';
import { Decimal } from '@prisma/client/runtime/library';
import type { Payment } from '@prisma/client';
import { calculateInterest } from '../commons/utils/interest-calculator';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreatePaymentDto): Promise<PaymentWithCharge> {
    const amount = new Decimal(data.amount);

    const charge = await this.prisma.charge.findUnique({
      where: { id: data.chargeId },
    });

    if (!charge) {
      throw new NotFoundException(`Charge with ID ${data.chargeId} not found`);
    }

    const existingPayment = await this.prisma.payment.findUnique({
      where: { chargeId: data.chargeId },
    });

    if (existingPayment) {
      throw new BadRequestException(`Charge ${data.chargeId} already has a payment registered`);
    }

    // Calculate expected amount with interest if overdue
    const calculation = calculateInterest(charge.amount, charge.dueDate);
    const expectedAmount = calculation.totalAmount;
    const tolerance = 0.01; // 1 cent tolerance for rounding

    // Validate payment amount matches expected amount (with interest if overdue)
    if (Math.abs(Number(amount) - expectedAmount) > tolerance) {
      throw new BadRequestException(
        `Invalid payment amount. Expected: ${expectedAmount.toFixed(2)} (original: ${calculation.originalAmount.toFixed(2)}${calculation.interest > 0 ? ` + interest: ${calculation.interest.toFixed(2)}` : ''})`,
      );
    }

    const newStatus = 'PAGO';

    // Execute transaction: update charge status then create payment, so returned charge is up to date
    try {
      const payment = await this.prisma.$transaction(async (tx) => {
        await tx.charge.update({
          where: { id: data.chargeId },
          data: { status: newStatus },
        });

        return tx.payment.create({
          data: {
            chargeId: data.chargeId,
            amount: amount,
            method: data.method,
          },
          include: { charge: true },
        });
      });

      return payment;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException(`Charge ${data.chargeId} already has a payment registered`);
      }
      throw e;
    }
  }

  async findAll(): Promise<PaymentWithChargeAndCustomer[]> {
    return this.prisma.payment.findMany({
      include: {
        charge: {
          include: {
            customer: true,
          },
        },
      },
      orderBy: { paidAt: 'desc' },
    });
  }

  async findOne(id: number): Promise<PaymentWithChargeAndCustomer> {
    return this.prisma.payment.findUniqueOrThrow({
      where: { id },
      include: {
        charge: {
          include: {
            customer: true,
          },
        },
      },
    });
  }

  async remove(id: number): Promise<Payment> {
    return this.prisma.payment.delete({ where: { id } });
  }
}
