import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsService } from './payments.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Decimal } from '@prisma/client/runtime/library';
import {
  makePayment,
  makePaymentWithCharge,
  makePaymentWithChargeAndCustomer,
  makeCreatePaymentDto,
  resetPaymentIdCounter,
  makeCharge,
} from '../../test/factories';

// Use factories to create test data
resetPaymentIdCounter();
const payment1 = makePayment();
const payment1WithCharge = makePaymentWithCharge();
const payment1WithChargeAndCustomer = makePaymentWithChargeAndCustomer();
const payments = [payment1WithChargeAndCustomer, makePaymentWithChargeAndCustomer({ payment: { id: 2, chargeId: 2 } })];
const createPayment1Dto = makeCreatePaymentDto();
const charge1 = makeCharge({ id: 1, status: 'PENDENTE', amount: new Decimal('100.00') });

describe('PaymentsService', () => {
  let service: PaymentsService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentsService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<PaymentsService>(PaymentsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a payment and update charge status to PAGO', async () => {
      // Arrange
      prisma.charge.findUnique.mockResolvedValue(charge1);
      prisma.payment.findUnique.mockResolvedValue(null);
      prisma.$transaction.mockResolvedValue(payment1WithCharge);

      // Act
      const result = await service.create(createPayment1Dto);

      // Assert
      expect(result).toEqual(payment1WithCharge);
      expect(prisma.charge.findUnique).toHaveBeenCalledWith({
        where: { id: createPayment1Dto.chargeId },
      });
      expect(prisma.payment.findUnique).toHaveBeenCalledWith({
        where: { chargeId: createPayment1Dto.chargeId },
      });
      expect(prisma.$transaction).toHaveBeenCalledTimes(1);
    });

    // Skipped: amount positivity validated by DTO at controller layer

    it('should throw NotFoundException when charge does not exist', async () => {
      // Arrange
      prisma.charge.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(service.create(createPayment1Dto)).rejects.toThrow(
        NotFoundException
      );
      await expect(service.create(createPayment1Dto)).rejects.toThrow(
        'Charge with ID 1 not found'
      );
    });

    it('should throw BadRequestException when charge already has a payment', async () => {
      // Arrange
      prisma.charge.findUnique.mockResolvedValue(charge1);
      prisma.payment.findUnique.mockResolvedValue(payment1);

      // Act & Assert
      await expect(service.create(createPayment1Dto)).rejects.toThrow(
        BadRequestException
      );
      await expect(service.create(createPayment1Dto)).rejects.toThrow(
        'Charge 1 already has a payment registered'
      );
    });

    it('should reject partial payments', async () => {
      // Arrange
      const partialPaymentDto = makeCreatePaymentDto({ amount: 50.0 });
      const chargeWithHigherAmount = makeCharge({
        id: 1,
        status: 'PENDENTE',
        amount: new Decimal('100.00'),
      });

      prisma.charge.findUnique.mockResolvedValue(chargeWithHigherAmount);
      prisma.payment.findUnique.mockResolvedValue(null);

      // Act / Assert
      await expect(service.create(partialPaymentDto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(service.create(partialPaymentDto)).rejects.toThrow(
        'Partial payments are not allowed',
      );
    });

    it('should map Prisma P2002 to BadRequestException', async () => {
      // Arrange
      prisma.charge.findUnique.mockResolvedValue(charge1);
      prisma.payment.findUnique.mockResolvedValue(null);

      // Create a Prisma P2002-like error instance and set its prototype
      const p2002 = Object.create(PrismaClientKnownRequestError.prototype) as any;
      p2002.message = 'Unique constraint failed';
      p2002.code = 'P2002';
      p2002.meta = { target: ['chargeId'] };

      prisma.$transaction.mockImplementationOnce(() => Promise.reject(p2002));

      // Act & Assert (call once — the mock rejects only once)
      await expect(service.create(createPayment1Dto)).rejects.toMatchObject({
        constructor: BadRequestException,
        message: `Charge ${createPayment1Dto.chargeId} already has a payment registered`,
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of payments with charge and customer', async () => {
      // Arrange
      prisma.payment.findMany.mockResolvedValue(payments);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(payments);
      expect(prisma.payment.findMany).toHaveBeenCalledWith({
        include: {
          charge: {
            include: {
              customer: true,
            },
          },
        },
        orderBy: { paidAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single payment with charge and customer', async () => {
      // Arrange
      prisma.payment.findUniqueOrThrow.mockResolvedValue(
        payment1WithChargeAndCustomer
      );

      // Act
      const result = await service.findOne(payment1.id);

      // Assert
      expect(result).toEqual(payment1WithChargeAndCustomer);
      expect(prisma.payment.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: payment1.id },
        include: {
          charge: {
            include: {
              customer: true,
            },
          },
        },
      });
    });

    it('should throw an error if payment not found', async () => {
      // Arrange
      prisma.payment.findUniqueOrThrow.mockRejectedValue(
        new Error('Record not found')
      );

      // Act & Assert
      await expect(service.findOne(999)).rejects.toThrow('Record not found');
    });
  });

  describe('remove', () => {
    it('should delete and return the payment', async () => {
      // Arrange
      prisma.payment.delete.mockResolvedValue(payment1);

      // Act
      const result = await service.remove(payment1.id);

      // Assert
      expect(result).toEqual(payment1);
      expect(prisma.payment.delete).toHaveBeenCalledWith({
        where: { id: payment1.id },
      });
    });

    it('should throw an error if payment to delete not found', async () => {
      // Arrange
      prisma.payment.delete.mockRejectedValue(new Error('Record not found'));

      // Act & Assert
      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });
  });
});
