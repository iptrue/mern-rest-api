import { NextFunction , Request , Response } from "express";
import { validationResult } from "express-validator";
import UserService from "../service/UserService";
import ApiError from "../exceptions/ApiError";
import env from "../environment/EnvironmentEntity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class UserController {
    async registration( req: Request , res: Response , next: NextFunction ) {
        try {
            const errors = validationResult( req );
            if ( !errors.isEmpty() ) {
                return next( ApiError.BadRequest( "Ошибка при валидации" , errors.array() ) );
            }
            const { email , password } = req.body;
            const userData = await UserService.registration( email , password );
            res.cookie( "refreshToken" , userData.refreshToken , { maxAge : 30 * 24 * 60 * 60 * 1000 , httpOnly : true } );
            return res.json( userData );
        }
        catch ( e ) {
            next( e );
        }
    }

    async login( req: Request , res: Response , next: NextFunction ) {
        try {
            const { email , password } = req.body;
            const userData = await UserService.login( email , password );
            res.cookie( "refreshToken" , userData.refreshToken , { maxAge : 30 * 24 * 60 * 60 * 1000 , httpOnly : true } );
            return res.json( userData );
        }
        catch ( e ) {
            next( e );
        }
    }


    async logout( req: Request , res: Response , next: NextFunction ) {
        try {

            const { refreshToken } = req.cookies;
            const { email } = req.params;

            const tokenData = await prisma.token.findFirst( { where : { refreshToken } } );
            const userData = await prisma.user.findFirst( { where : { id : tokenData.userId } } );

            if ( userData.email === email ) {
                const token = await UserService.logout( refreshToken );
                res.clearCookie( "refreshToken" );
                return res.json( token );
            }
            else {
                return res.status( 400 ).json( { message : "Непредвиденная ошибка" } );
            }
        }
        catch ( e ) {
            next( e );
        }
    }

    async activate( req: Request , res: Response , next: NextFunction ) {
        try {
            const activationLink = req.params.link;
            await UserService.activate( activationLink );
            return res.redirect( env.clientUrl );
        }
        catch ( e ) {
            next( e );
        }
    }

    async refresh( req: Request , res: Response , next: NextFunction ) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await UserService.refresh( refreshToken );
            res.cookie( "refreshToken" , userData.refreshToken , { maxAge : 30 * 24 * 60 * 60 * 1000 , httpOnly : true } );
            return res.json( userData );
        }
        catch ( e ) {
            next( e );
        }
    }


    async getUsers( req: Request , res: Response , next: NextFunction ) {
        try {
            const { sort , filter } = req.query;

            const users = await UserService.getAllUsers( sort as string , filter as string );
            return res.json( users );
        }
        catch ( e ) {
            next( e );
        }
    }

    async getUserById( req: Request , res: Response , next: NextFunction ) {
        try {


            const { userId } = req.params;
            const user = await UserService.getUserById( userId );

            if ( !user ) {
                throw ApiError.NotFound( `Пользователь с ID ${ userId } не найден` );
            }

            return res.json( user );
        }
        catch ( e ) {
            next( e );
        }
    }

    async updateUser( req: Request , res: Response , next: NextFunction ) {
        try {

            const { userId } = req.params;
            const newData = req.body;
            const { refreshToken } = req.cookies;

            const tokenData = await prisma.token.findFirst( { where : { refreshToken } } );

            if ( tokenData.userId === userId ) {
                const user = await UserService.updateUser( userId , newData );

                if ( !user ) {
                    throw ApiError.NotFound( `Пользователь с ID ${ userId } не найден` );
                }

                return res.json( user );
            }
            else {
                return res.status( 400 ).json( { message : "Непредвиденная ошибка" } );
            }


        }
        catch ( e ) {
            next( e );
        }
    }

    async deleteUser( req: Request , res: Response , next: NextFunction ) {
        try {

            const { userId } = req.params;
            const newData = req.body;
            const { refreshToken } = req.cookies;

            const tokenData = await prisma.token.findFirst( { where : { refreshToken } } );

            if ( tokenData.userId === userId ) {
                const user = await UserService.deleteUser( userId );

                if ( !user ) {
                    throw ApiError.NotFound( `Пользователь с ID ${ userId } не найден` );
                }

                return res.json( user );
            }
            else {
                return res.status( 400 ).json( { message : "Непредвиденная ошибка" } );
            }
        }
        catch ( e ) {
            next( e );
        }
    }
}

export default new UserController();