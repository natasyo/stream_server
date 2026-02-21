import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { CreatePrismaDto } from './dto/create-prisma.dto';
import { UpdatePrismaDto } from './dto/update-prisma.dto';
import { PrismaClient } from '@prisma/client/extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
 async onModuleDestroy() {
   await this.$disconnect();
 }
 public async onModuleInit() {
  await this.$connect();
 }
}
 