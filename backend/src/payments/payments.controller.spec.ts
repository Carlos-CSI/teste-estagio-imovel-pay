import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import {
  makePayment,
  makePaymentWithCharge,
  makePaymentWithChargeAndCustomer,
  makeCreatePaymentDto,
  resetPaymentIdCounter,
} from '../../test/factories';

// Use factories to create test data
resetPaymentIdCounter();
const payment1 = makePayment();
const payment1WithCharge = makePaymentWithCharge();
const payment1WithChargeAndCustomer = makePaymentWithChargeAndCustomer();
const payments = [
  payment1WithChargeAndCustomer,
  makePaymentWithChargeAndCustomer({ payment: { id: 2, chargeId: 2 } }),
];
const createPayment1Dto = makeCreatePaymentDto();

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: DeepMockProxy<PaymentsService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [
        {
          provide: PaymentsService,
          useValue: mockDeep<PaymentsService>(),
        },
      ],
    }).compile();

    controller = module.get<PaymentsController>(PaymentsController);
    service = module.get(PaymentsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of payments', async () => {
      // Arrange
      service.findAll.mockResolvedValue(payments);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(payments);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single payment', async () => {
      // Arrange
      service.findOne.mockResolvedValue(payment1WithChargeAndCustomer);

      // Act
      const result = await controller.findOne(payment1.id);

      // Assert
      expect(result).toEqual(payment1WithChargeAndCustomer);
      expect(service.findOne).toHaveBeenCalledWith(payment1.id);
    });
  });

  describe('create', () => {
    it('should create and return a new payment', async () => {
      // Arrange
      service.create.mockResolvedValue(payment1WithCharge);

      // Act
      const result = await controller.create(createPayment1Dto);

      // Assert
      expect(result).toEqual(payment1WithCharge);
      expect(service.create).toHaveBeenCalledWith(createPayment1Dto);
    });
  });

  describe('remove', () => {
    it('should delete a payment', async () => {
      // Arrange
      service.remove.mockResolvedValue(payment1);

      // Act
      await controller.remove(payment1.id);

      // Assert
      expect(service.remove).toHaveBeenCalledWith(payment1.id);
    });
  });
});
