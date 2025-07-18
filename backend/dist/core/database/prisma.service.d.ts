import { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
export declare class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private logger;
    onModuleInit(): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
