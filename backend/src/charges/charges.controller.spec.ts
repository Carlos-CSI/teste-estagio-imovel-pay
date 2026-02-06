import { Test, TestingModule } from '@nestjs/testing';
import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';
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

describe('ChargesController', () => {
  let controller: ChargesController;
  let service: DeepMockProxy<ChargesService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChargesController],
      providers: [
        {
          provide: ChargesService,
          useValue: mockDeep<ChargesService>(),
        },
      ],
    }).compile();

    controller = module.get<ChargesController>(ChargesController);
    service = module.get(ChargesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      service.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll({ page: 1, limit: 10 });

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith({ page: 1, limit: 10 });
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
      service.findAll.mockResolvedValue(expectedResult);

      // Act
      const result = await controller.findAll({ page: 1, limit: 10, status: ChargeStatus.PAGO });

      // Assert
      expect(result).toEqual(expectedResult);
      expect(service.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        status: ChargeStatus.PAGO,
      });
    });
  });

  describe('findOne', () => {
    it('should return a single charge with customer', async () => {
      // Arrange
      service.findOne.mockResolvedValue(charge1WithCustomerAndPayment);

      // Act
      const result = await controller.findOne(charge1.id);

      // Assert
      expect(result).toEqual(charge1WithCustomerAndPayment);
      expect(service.findOne).toHaveBeenCalledWith(charge1.id);
    });

    it('should throw an error if charge not found', async () => {
      // Arrange
      service.findOne.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(controller.findOne(999)).rejects.toThrow('Record not found');
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new charge', async () => {
      // Arrange
      service.create.mockResolvedValue(charge1WithCustomer);

      // Act
      const result = await controller.create(createCharge1Dto);

      // Assert
      expect(result).toEqual(charge1WithCustomer);
      expect(service.create).toHaveBeenCalledWith(createCharge1Dto);
    });

    it('should throw an error when customer does not exist', async () => {
      const prismaError: any = new Error('Foreign key constraint failed');
      prismaError.code = 'P2003';

      // Arrange
      service.create.mockRejectedValue(prismaError);

      // Act / Assert
      await expect(controller.create(createCharge1Dto)).rejects.toThrow(
        'Foreign key constraint failed',
      );
      expect(service.create).toHaveBeenCalledWith(createCharge1Dto);
    });
  });

  describe('update', () => {
    it('should update and return the charge', async () => {
      // Arrange
      service.update.mockResolvedValue(updatedCharge);

      // Act
      const result = await controller.update(charge1.id, updateCharge1Dto);

      // Assert
      expect(result).toEqual(updatedCharge);
      expect(service.update).toHaveBeenCalledWith(charge1.id, updateCharge1Dto);
    });

    it('should throw an error if charge not found', async () => {
      // Arrange
      service.update.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(controller.update(999, updateCharge1Dto)).rejects.toThrow('Record not found');
      expect(service.update).toHaveBeenCalledWith(999, updateCharge1Dto);
    });
  });

  describe('remove', () => {
    it('should remove the charge', async () => {
      // Arrange
      service.remove.mockResolvedValue(undefined);

      // Act
      await controller.remove(charge1.id);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(charge1.id);
    });

    it('should throw an error if charge not found', async () => {
      // Arrange
      service.remove.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(controller.remove(999)).rejects.toThrow('Record not found');
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
