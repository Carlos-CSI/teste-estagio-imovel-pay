import { Test, TestingModule } from '@nestjs/testing';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { makeCustomer, makeCustomerWithCharges, makeCreateCustomerDto, makeUpdateCustomerDto, resetCustomerIdCounter } from '../../test/factories';

// Use factories to create test data
resetCustomerIdCounter();
const customer1 = makeCustomer();
const customer2 = makeCustomer({ name: 'customer 2', cpf: '09876543210' });
const customer1WithCharges = makeCustomerWithCharges();
const customers = [customer1, customer2];
const createCustomer1Dto = makeCreateCustomerDto();
const updateCustomer1Dto = makeUpdateCustomerDto();
const updatedCustomer = { ...customer1, name: updateCustomer1Dto.name };

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: DeepMockProxy<CustomersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        {
          provide: CustomersService,
          useValue: mockDeep<CustomersService>(),
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      // Arrange
      service.findAll.mockResolvedValue(customers);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(result).toEqual(customers);
      expect(service.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findOne', () => {
    it('should return a single customer with charges', async () => {
      // Arrange
      service.findOne.mockResolvedValue(customer1WithCharges);

      // Act
      const result = await controller.findOne(customer1.id);

      // Assert
      expect(result).toEqual(customer1WithCharges);
      expect(service.findOne).toHaveBeenCalledWith(customer1.id);
    });

    it('should throw an error if customer not found', async () => {
      // Arrange
      service.findOne.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(controller.findOne(999)).rejects.toThrow('Record not found');
      expect(service.findOne).toHaveBeenCalledWith(999);
    });
  });

  describe('create', () => {
    it('should create and return a new customer', async () => {
      // Arrange
      service.create.mockResolvedValue(customer1);

      // Act
      const result = await controller.create(createCustomer1Dto);

      // Assert
      expect(result).toEqual(customer1);
      expect(service.create).toHaveBeenCalledWith(createCustomer1Dto);
    });

    it('should throw an error when CPF already exists', async () => {
      const prismaError: any = new Error(
        'Unique constraint failed on the fields: (`cpf`)'
      );
      prismaError.code = 'P2002';

      // Arrange
      service.create.mockRejectedValue(prismaError);

      // Act / Assert
      await expect(controller.create(createCustomer1Dto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`cpf`)'
      );
      expect(service.create).toHaveBeenCalledWith(createCustomer1Dto);
    });
  });

  describe('update', () => {
    it('should update and return the customer', async () => {
      // Arrange
      service.update.mockResolvedValue(updatedCustomer);

      // Act
      const result = await controller.update(customer1.id, updateCustomer1Dto);

      // Assert
      expect(result).toEqual(updatedCustomer);
      expect(service.update).toHaveBeenCalledWith(
        customer1.id,
        updateCustomer1Dto
      );
    });

    it('should throw an error if customer to update not found', async () => {
      // Arrange
      service.update.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(
        controller.update(999, updateCustomer1Dto)
      ).rejects.toThrow('Record not found');
      expect(service.update).toHaveBeenCalledWith(999, updateCustomer1Dto);
    });
  });

  describe('remove', () => {
    it('should delete the customer and return nothing (204)', async () => {
      // Arrange
      service.remove.mockResolvedValue(customer1);

      // Act
      const result = await controller.remove(customer1.id);

      // Assert
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(customer1.id);
    });

    it('should throw an error if customer to delete not found', async () => {
      // Arrange
      service.remove.mockRejectedValue(new Error('Record not found'));

      // Act / Assert
      await expect(controller.remove(999)).rejects.toThrow('Record not found');
      expect(service.remove).toHaveBeenCalledWith(999);
    });
  });
});
