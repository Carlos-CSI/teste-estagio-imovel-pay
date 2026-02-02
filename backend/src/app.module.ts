import { Module } from '@nestjs/common';
import { CustomersModule } from './customers/customers.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [CustomersModule],
  providers: [PrismaService],
})
export class AppModule {}
