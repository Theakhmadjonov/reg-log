"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
(0, common_1.Injectable)();
class PrismaService extends client_1.PrismaClient {
    logger = new common_1.Logger(PrismaService.name);
    async onModuleInit() {
        try {
            await this.$connect();
            this.logger.log('Prisma connected');
        }
        catch (error) {
            process.exit(1);
        }
    }
    async onModuleDestroy() {
        await this.$disconnect();
    }
}
exports.PrismaService = PrismaService;
//# sourceMappingURL=prisma.service.js.map