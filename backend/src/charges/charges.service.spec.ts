import { Test, TestingModule } from '@nestjs/testing';
import { ChargesService } from './charges.service';
import { PrismaService } from '../prisma/prisma.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  makeCharge,
  makeChargeWithCustomer,
  makeChargeWithCustomerAndPayment,
  makeCreateChargeDto,
  makeUpdateChargeDto,
  resetChargeIdCounter,
} from '../../test/factories';
import { ChargeStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

// Use factories to create test data
resetChargeIdCounter();
const charge1 = makeCharge();
const charge1WithCustomer = makeChargeWithCustomer();
const charge1WithCustomerAndPayment = makeChargeWithCustomerAndPayment();
const charge2WithCustomer = makeChargeWithCustomer({
  amount: new Decimal(200.0),
  status: ChargeStatus.PAGO,
});
const charges = [charge1WithCustomer, charge2WithCustomer];
const createCharge1Dto = makeCreateChargeDto();
const updateCharge1Dto = makeUpdateChargeDto({ status: ChargeStatus.PAGO });
const updatedCharge = makeChargeWithCustomer({ ...charge1, status: ChargeStatus.PAGO });

describe('ChargesService', () => {
  let service: ChargesService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChargesService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<ChargesService>(ChargesService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return paginated charges', async () => {
      const expectedResult = {
        data: charges,
        meta: {
          total: 2,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      // Arrange
      prisma.charge.findMany.mockResolvedValue(charges);
      prisma.charge.count.mockResolvedValue(2);

      // Act
      const result = await service.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result).toEqual(expectedResult);
      expect(prisma.charge.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { dueDate: 'asc' },
        include: { customer: true },
        skip: 0,
        take: 10,
      });
      expect(prisma.charge.count).toHaveBeenCalledWith({ where: {} });
    });

    it('should filter charges by status', async () => {
      const expectedResult = {
        data: [charge2WithCustomer],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      // Arrange
      prisma.charge.findMany.mockResolvedValue([charge2WithCustomer]);
      prisma.charge.count.mockResolvedValue(1);

      // Act
      const result = await service.findAll({ page: 1, limit: 10, status: ChargeStatus.PAGO });

      // Assert
      expect(result).toEqual(expectedResult);
      expect(prisma.charge.findMany).toHaveBeenCalledWith({
        where: { status: ChargeStatus.PAGO },
        orderBy: { dueDate: 'asc' },
        include: { customer: true },
        skip: 0,
        take: 10,
      });
      expect(prisma.charge.count).toHaveBeenCalledWith({ where: { status: ChargeStatus.PAGO } });
    });
  });

  describe('findOne', () => {
    it('should return a single charge with customer and payment', async () => {
      // Arrange
      prisma.charge.findUniqueOrThrow.mockResolvedValue(charge1WithCustomerAndPayment);

      // Act
      const result = await service.findOne(charge1.id);

      // Assert
      expect(result).toEqual(charge1WithCustomerAndPayment);
      expect(prisma.charge.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: charge1.id },
        include: {
          customer: true,
          payment: true,
        },
      });
    });

    it('should throw an error if charge not found', async () => {
      // Arrange
      prisma.charge.findUniqueOrThrow.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(service.findOne(999)).rejects.toThrow('Record not found');
    });
  });

  describe('create', () => {
    it('should create and return a new charge', async () => {
      // Arrange
      prisma.charge.create.mockResolvedValue(charge1WithCustomer);

      // Act
      const result = await service.create(createCharge1Dto);

      // Assert
      expect(result).toEqual(charge1WithCustomer);
      expect(prisma.charge.create).toHaveBeenCalledWith({
        data: {
          customerId: createCharge1Dto.customerId,
          amount: expect.any(Decimal),
          dueDate: expect.any(Date),
        },
        include: { customer: true },
      });
    });

    it('should throw an error when customer does not exist', async () => {
      const prismaError: any = new Error('Foreign key constraint failed');
      prismaError.code = 'P2003';

      // Arrange
      prisma.charge.create.mockRejectedValue(prismaError);

      // Act / Assert
      await expect(service.create(createCharge1Dto)).rejects.toThrow(
        'Foreign key constraint failed',
      );
    });
  });

  describe('update', () => {
    it('should update and return the charge', async () => {
      // Arrange
      prisma.charge.update.mockResolvedValue(updatedCharge);

      // Act
      const result = await service.update(charge1.id, updateCharge1Dto);

      // Assert
      expect(result).toEqual(updatedCharge);
      expect(prisma.charge.update).toHaveBeenCalledWith({
        where: { id: charge1.id },
        data: expect.objectContaining({
          status: updateCharge1Dto.status,
        }),
        include: { customer: true },
      });
    });

    it('should throw an error if charge not found', async () => {
      // Arrange
      prisma.charge.update.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(service.update(999, updateCharge1Dto)).rejects.toThrow('Record not found');
    });
  });

  describe('remove', () => {
    it('should remove the charge', async () => {
      // Arrange
      prisma.charge.delete.mockResolvedValue(charge1);

      // Act
      await service.remove(charge1.id);

      // Assert
      expect(prisma.charge.delete).toHaveBeenCalledWith({
        where: { id: charge1.id },
      });
    });

    it('should throw an error if charge not found', async () => {
      // Arrange
      prisma.charge.delete.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });
  });
});
