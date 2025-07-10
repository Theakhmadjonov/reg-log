import { Request } from 'express';
import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    googleAuthRedirect(): void;
    oauthGoogleCallback(req: Request): Promise<{
        token: string;
    }>;
    githubAuthRedirect(): void;
    oauthGithubCallback(req: Request): Promise<{
        token: string;
    }>;
    login(data: {
        email: string;
        password: string;
    }): Promise<{
        token: string;
    }>;
    register(data: {
        email: string;
        password: string;
        fullName: string;
    }): Promise<{
        token: string;
    }>;
}
