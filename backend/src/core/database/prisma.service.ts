import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy{
    private logger: Logger = new Logger(PrismaService.name);
    
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Prisma connected');
        } catch (error) {
            process.exit(1);
        }
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
