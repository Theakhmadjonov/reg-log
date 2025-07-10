import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
export declare class AuthService {
    private db;
    private jwt;
    constructor(db: PrismaService, jwt: JwtService);
    oauthGoogleCallback(user: any): Promise<{
        token: string;
    }>;
    oauthGithubCallback(user: any): Promise<{
        token: string;
    }>;
    register(data: {
        email: string;
        password: string;
        fullName: string;
    }): Promise<{
        token: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
}
