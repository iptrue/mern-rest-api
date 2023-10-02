import dotenv from "dotenv";

dotenv.config();
class EnvironmentEntity {
    port: number;
    dbUrl: string;
    jwtAccessSecret: string;
    jwtRefreshSecret: string;
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    apiUrl: string;
    clientUrl: string;

    constructor() {
        this.port = Number( this.getRequiredVariable( process.env.PORT , "PORT" , Number ) );
        this.dbUrl = this.getRequiredVariable( process.env.DATABASE_URL , "DATABASE_URL" , String );
        this.jwtAccessSecret = this.getRequiredVariable( process.env.JWT_ACCESS_SECRET , "JWT_ACCESS_SECRET" , String );
        this.jwtRefreshSecret = this.getRequiredVariable( process.env.JWT_REFRESH_SECRET , "JWT_REFRESH_SECRET" , String );
        this.smtpHost = this.getRequiredVariable( process.env.SMTP_HOST , "SMTP_HOST" , String );
        this.smtpPort = Number( this.getRequiredVariable( process.env.SMTP_PORT , "SMTP_PORT" , Number ) );
        this.smtpUser = this.getRequiredVariable( process.env.SMTP_USER , "SMTP_USER" , String );
        this.smtpPassword = this.getRequiredVariable( process.env.SMTP_PASSWORD , "SMTP_PASSWORD" , String );
        this.apiUrl = this.getRequiredVariable( process.env.API_URL , "API_URL" , String );
        this.clientUrl = this.getRequiredVariable( process.env.CLIENT_URL , "CLIENT_URL" , String );
    }

    private getRequiredVariable( value: string | undefined , name: string , type: any ): string {
        if ( !value ) {
            throw new Error( `Environment variable ${ name } is missing.` );
        }
        return value;
    }

}

const env = new EnvironmentEntity()
export default  env;