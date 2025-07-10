import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/core/database/prisma.service';
import bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private db: PrismaService,
    private jwt: JwtService,
  ) {}
  async oauthGoogleCallback(user: any) {
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
    const findAccount = findUSer.OAuthAccounts.find(
      (account) => account.provider === 'google',
    );
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

  async oauthGithubCallback(user: any) {
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
    const findAccount = findUSer.OAuthAccounts.find(
      (account) => account.provider === 'github',
    );
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

  async register(data: { email: string; password: string; fullName: string }) {
    const findUSer = await this.db.user.findFirst({
      where: { email: data.email },
    });
    if (findUSer) throw new ConflictException('User already exists');
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.db.user.create({
      data: { ...data, password: hashedPassword },
    });
    const token = await this.jwt.signAsync({ userId: user.id });
    return { token };
  }

  async login(data: { email: string; password: string }) {
    const findUSer = await this.db.user.findFirst({
      where: { email: data.email },
    });
    if (!findUSer) throw new BadRequestException('User not found');
    if (!findUSer?.password) throw new BadRequestException('Password no set');
    const comparePassword = await bcrypt.compare(
      data.password,
      findUSer.password,
    );
    if (!comparePassword)
      throw new BadRequestException('Email or password incorrect');
    const token = await this.jwt.signAsync({ userId: findUSer.id });
    return { token };
  }
}
