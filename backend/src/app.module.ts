import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customers/customers.module';
import { ChargesModule } from './charges/charges.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    CustomersModule,
    ChargesModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
