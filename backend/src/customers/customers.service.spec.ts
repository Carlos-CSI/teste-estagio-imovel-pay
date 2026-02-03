import { Test, TestingModule } from '@nestjs/testing';
import { CustomersService } from './customers.service';
import { PrismaService } from '../prisma/prisma.service';
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


describe('CustomersService', () => {
  let service: CustomersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of customers', async () => {
      // Arrange
      prisma.customer.findMany.mockResolvedValue(customers);

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual(customers);
      expect(prisma.customer.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a single customer with charges', async () => {
      // Arrange
      prisma.customer.findUniqueOrThrow.mockResolvedValue(customer1WithCharges);

      // Act
      const result = await service.findOne(customer1.id);

      // Assert
      expect(result).toEqual(customer1WithCharges);
      expect(prisma.customer.findUniqueOrThrow).toHaveBeenCalledWith({
        where: { id: customer1.id },
        include: { charges: true },
      });
    });

    it('should throw an error if customer not found', async () => {
      // Arrange
      prisma.customer.findUniqueOrThrow.mockRejectedValue(
        new Error('Record not found')
      );

      // Act / Assert
      await expect(service.findOne(999)).rejects.toThrow('Record not found');
    });
  });

  describe('create', () => {
    it('should create and return a new customer', async () => {
      // Arrange
      prisma.customer.create.mockResolvedValue(customer1);

      // Act
      const result = await service.create(createCustomer1Dto);

      // Assert
      expect(result).toEqual(customer1);
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          name: createCustomer1Dto.name,
          cpf: createCustomer1Dto.cpf,
        },
      });
    });

    it('should throw an error when CPF already exists', async () => {
      const prismaError: any = new Error(
        'Unique constraint failed on the fields: (`cpf`)'
      );
      prismaError.code = 'P2002';
      prismaError.meta = { target: ['cpf'] };

      // Arrange
      prisma.customer.create.mockRejectedValue(prismaError);

      // Act / Assert
      await expect(service.create(createCustomer1Dto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`cpf`)'
      );
      expect(prisma.customer.create).toHaveBeenCalledWith({
        data: {
          name: createCustomer1Dto.name,
          cpf: createCustomer1Dto.cpf,
        },
      });
    });
  });

  describe('update', () => {
    it('should update and return the customer', async () => {
      // Arrange
      prisma.customer.update.mockResolvedValue(updatedCustomer);

      // Act
      const result = await service.update(customer1.id, updateCustomer1Dto);

      // Assert
      expect(result).toEqual(updatedCustomer);
      expect(prisma.customer.update).toHaveBeenCalledWith({
        where: { id: customer1.id },
        data: {
          name: updateCustomer1Dto.name,
        },
      });
    });

    it('should throw an error if customer to update not found', async () => {
      // Arrange
      prisma.customer.update.mockRejectedValue(
        new Error('Record not found')
      );

      // Act / Assert
      await expect(service.update(999, updateCustomer1Dto)).rejects.toThrow(
        'Record not found'
      );
    });
  });

  describe('remove', () => {
    it('should delete and return the customer', async () => {
      // Arrange
      prisma.customer.delete.mockResolvedValue(customer1);

      // Act
      const result = await service.remove(customer1.id);

      // Assert
      expect(result).toEqual(customer1);
      expect(prisma.customer.delete).toHaveBeenCalledWith({
        where: { id: customer1.id },
      });
    });

    it('should throw an error if customer to delete not found', async () => {
      // Arrange
      prisma.customer.delete.mockRejectedValue(
        new Error('Record not found')
      );

      // Act / Assert
      await expect(service.remove(999)).rejects.toThrow('Record not found');
    });
  });
});
