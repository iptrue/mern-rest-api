import { Request, Response, NextFunction } from 'express';
import ApiError from "../exceptions/ApiError";
import TokenService from "../service/TokenService/TokenService";

// Расширяем интерфейс типа Request
declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export default function authHandler(req: Request, res: Response, next: NextFunction) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        }

        const accessToken = authorizationHeader.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }

        const userData = TokenService.validateAccessToken(accessToken);
        console.log(userData, ' userData')
        if (!userData) {
            return next(ApiError.UnauthorizedError());
        }

        req.user = userData;
        next();
    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}