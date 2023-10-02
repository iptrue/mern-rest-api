import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class TokenCleanupService {
    private readonly interval: number;
    private intervalId: NodeJS.Timeout;

    constructor() {
        this.interval =  24 * 60 * 60 * 1000 ; // 1 day in milliseconds
    }

    startCleanup() {
            this.intervalId = setInterval( () => this.cleanup() , this.interval );

    }

    async stopCleanup() {
            clearInterval( this.intervalId );
    }

    async cleanup() {
        try {
            console.log( "cleaning" );
            const currentDateTime = new Date();
            console.log( currentDateTime );
            const expiredTokens = await prisma.token.findMany( {
                where : {
                    expireAt : {
                        lte : currentDateTime
                    }
                }
            } );
            console.log( expiredTokens );
            for ( const token of expiredTokens ) {
                console.log( token );
                await prisma.token.delete( {
                    where : {
                        id : token.id
                    }
                } );
            }
        }
        catch ( error ) {
            console.error( "Token cleanup error:" , error );
        }
    }
}

export const service = new TokenCleanupService();
