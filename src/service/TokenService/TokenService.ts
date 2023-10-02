import jwt from "jsonwebtoken"
import env from "../../environment/EnvironmentEntity";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default class TokenService {
    static generateTokens(payload:any) {
        const accessToken = jwt.sign(payload, env.jwtAccessSecret, {expiresIn: '15m'})
        const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {expiresIn: '30d'})
        return {
            accessToken,
            refreshToken
        }
    }

    static validateAccessToken(token:any) {
        try {
            const userData = jwt.verify(token, env.jwtAccessSecret);
            return userData;
        } catch (e) {
            return null;
        }
    }

    static validateRefreshToken(token:any) {
        try {
            const userData = jwt.verify(token, env.jwtRefreshSecret);
            return userData;
        } catch (e) {
            return null;
        }
    }

    static async saveToken(userId:string, refreshToken:any) {
        const tokenData = await prisma.token.findFirst({ where: { userId } });
        const expireAt = new Date();
        expireAt.setDate(expireAt.getDate()+30); // Устанавливаем время истечения на 30 дней вперед
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            tokenData.expireAt = expireAt;
            return prisma.token.update({ where: { id: tokenData.id }, data: { refreshToken, expireAt } });
        }
        const token = await prisma.token.create({ data: { userId, refreshToken, expireAt } });
        return token;
    }

    static async removeToken(refreshToken:any) {
        const tokenData = await prisma.token.deleteMany({ where: { refreshToken } });
        return tokenData;
    }

    static async findToken(refreshToken:any) {
        const tokenData = await prisma.token.findFirst({ where: { refreshToken } });
        return tokenData;
    }
}