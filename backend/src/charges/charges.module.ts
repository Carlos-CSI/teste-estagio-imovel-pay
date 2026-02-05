import { Module } from '@nestjs/common';
import { ChargesController } from './charges.controller';
import { ChargesService } from './charges.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ChargesController],
  providers: [ChargesService, PrismaService],
})
export class ChargesModule {}
