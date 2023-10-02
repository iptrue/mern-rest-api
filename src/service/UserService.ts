import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import ApiError from "../exceptions/ApiError";
import mailService from "./MailService";
import UserDto from "../dtos/UserDto";
import tokenService from "./TokenService/TokenService";
import { PrismaClient } from "@prisma/client";
import env from "../environment/EnvironmentEntity";
import { UserData } from "./UserData";

const prisma = new PrismaClient();

class UserService {
    async registration( email: string , password: string ) {
        const candidate = await prisma.user.findUnique( { where : { email } } );
        if ( candidate ) {
            throw ApiError.BadRequest( `Пользователь с почтовым адресом ${ email } уже существует` );
        }
        const hashPassword = await bcrypt.hash( password , 3 );
        const activationLink = uuid(); // v34fa-asfasf-142saf-sa-asf

        const user = await prisma.user.create( { data : { email , password : hashPassword , activationLink } } );
        await mailService.sendActivationMail( email , `${ env.apiUrl }/api/activate/${ activationLink }` );

        const userDto = new UserDto( user ); // id, email, isActivated

        const tokens = tokenService.generateTokens( { ...userDto } );
        await tokenService.saveToken( userDto.id , tokens.refreshToken );
        return { ...tokens , user : userDto };
    }

    async activate( activationLink: string ) {
        const user = await prisma.user.findFirst( { where : { activationLink } } );
        if ( !user ) {
            throw ApiError.BadRequest( "Некорректная ссылка активации" );
        }
        await prisma.user.update( { where : { id : user.id } , data : { isActivated : true } } );
    }

    async login( email: string , password: string ) {
        const user = await prisma.user.findUnique( { where : { email } } );
        if ( !user ) {
            throw ApiError.BadRequest( "Пользователь с таким email не найден" );
        }
        const isPassEquals = await bcrypt.compare( password , user.password );
        if ( !isPassEquals ) {
            throw ApiError.BadRequest( "Неверный пароль" );
        }
        const userDto = new UserDto( user );
        const tokens = tokenService.generateTokens( { ...userDto } );

        await tokenService.saveToken( userDto.id , tokens.refreshToken );
        return { ...tokens , user : userDto };
    }

    async logout( refreshToken: any ) {
        const token = await tokenService.removeToken( refreshToken );
        return token;
    }


    async refresh( refreshToken: any ) {
        if ( !refreshToken ) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken( refreshToken ) as UserData;
        const tokenFromDb = await tokenService.findToken( refreshToken );
        if ( !userData || !tokenFromDb ) {
            throw ApiError.UnauthorizedError();
        }
        const user = await prisma.user.findUnique( { where : { id : userData.id } } );
        const userDto = new UserDto( user );
        const tokens = tokenService.generateTokens( { ...userDto } );

        await tokenService.saveToken( userDto.id , tokens.refreshToken );
        return { ...tokens , user : userDto };
    }

    async getUserById( userId: string ) {
        const user = await prisma.user.findUnique( {
            where : { id : userId } ,
        } );
        return user;
    }

    async updateUser( userId: string , newData: Partial<UserDto> ) {
        const user = await prisma.user.update( {
            where : { id : userId } ,
            data : newData ,
        } );
        return user;
    }

    async deleteUser( userId: string ) {
        const user = await prisma.user.delete( { where : { id : userId } } );
        return user;
    }

    async getAllUsers( sort?: string , filter?: string ) {
        let usersQuery = prisma.user.findMany();

        if ( sort && filter ) {
            const [ sortField , sortOrder ] = sort.split( ":" );
            usersQuery = prisma.user.findMany( {
                where : {
                    email : { contains : filter , mode : "insensitive" }
                } ,
                orderBy : {
                    [sortField] : sortOrder as "asc" | "desc"
                }
            } );
            const users = await usersQuery;
            return users;
        }

        if ( sort ) {
            const [ sortField , sortOrder ] = sort.split( ":" );
            usersQuery = prisma.user.findMany( {

                orderBy : {
                    [sortField] : sortOrder as "asc" | "desc"
                }
            } );
        }

        if ( filter ) {
            usersQuery = prisma.user.findMany( {
                where : {
                    email : { contains : filter , mode : "insensitive" }
                }
            } );
        }

        const users = await usersQuery;
        return users;
    }

}

export default new UserService();
