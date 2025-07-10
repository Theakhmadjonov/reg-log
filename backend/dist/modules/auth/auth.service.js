"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../../core/database/prisma.service");
const bcrypt_1 = __importDefault(require("bcrypt"));
let AuthService = class AuthService {
    db;
    jwt;
    constructor(db, jwt) {
        this.db = db;
        this.jwt = jwt;
    }
    async oauthGoogleCallback(user) {
        const findUSer = await this.db.user.findFirst({
            where: { email: user.email },
            include: { OAuthAccounts: true },
        });
        if (!findUSer) {
            const newUser = await this.db.user.create({
                data: {
                    email: user.email,
                    fullName: user.fullName,
                    oauth_account_user: true,
                },
            });
            await this.db.oAuthAccounts.create({
                data: {
                    provider: 'google',
                    providerId: user.googleId,
                    userId: newUser.id,
                },
            });
            const token = await this.jwt.signAsync({ userId: newUser.id });
            return { token };
        }
        const findAccount = findUSer.OAuthAccounts.find((account) => account.provider === 'google');
        if (!findAccount) {
            await this.db.oAuthAccounts.create({
                data: {
                    provider: 'google',
                    providerId: user.googleId,
                    userId: findUSer.id,
                },
            });
        }
        const token = await this.jwt.signAsync({ userId: findUSer.id });
        return { token };
    }
    async oauthGithubCallback(user) {
        const findUSer = await this.db.user.findFirst({
            where: { email: user.email },
            include: { OAuthAccounts: true },
        });
        if (!findUSer) {
            const newUser = await this.db.user.create({
                data: {
                    email: user.email,
                    fullName: user.name,
                    oauth_account_user: true,
                },
            });
            await this.db.oAuthAccounts.create({
                data: {
                    provider: 'github',
                    providerId: user.id,
                    userId: newUser.id,
                },
            });
            const token = await this.jwt.signAsync({ userId: newUser.id });
            return { token };
        }
        const findAccount = findUSer.OAuthAccounts.find((account) => account.provider === 'github');
        if (!findAccount) {
            await this.db.oAuthAccounts.create({
                data: {
                    provider: 'github',
                    providerId: user.id,
                    userId: findUSer.id,
                },
            });
        }
        const token = await this.jwt.signAsync({ userId: findUSer.id });
        return { token };
    }
    async register(data) {
        const findUSer = await this.db.user.findFirst({
            where: { email: data.email },
        });
        if (findUSer)
            throw new common_1.ConflictException('User already exists');
        const hashedPassword = await bcrypt_1.default.hash(data.password, 12);
        const user = await this.db.user.create({
            data: { ...data, password: hashedPassword },
        });
        const token = await this.jwt.signAsync({ userId: user.id });
        return { token };
    }
    async login(data) {
        const findUSer = await this.db.user.findFirst({
            where: { email: data.email },
        });
        if (!findUSer)
            throw new common_1.BadRequestException('User not found');
        if (!findUSer?.password)
            throw new common_1.BadRequestException('Password no set');
        const comparePassword = await bcrypt_1.default.compare(data.password, findUSer.password);
        if (!comparePassword)
            throw new common_1.BadRequestException('Email or password incorrect');
        const token = await this.jwt.signAsync({ userId: findUSer.id });
        return { token };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map