import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

import router from "./router";
import env from "./environment/EnvironmentEntity";
import errorHandler from "./middlewares/ErrorHandler";
import { service } from "./service/TokenService/TokenCleanupService";

dotenv.config();
const prisma = new PrismaClient();
const PORT = env.port || 5000;

export const app = express();

app.use( express.json() );
app.use( cookieParser() );
app.use( cors( {
    credentials : true ,
    origin : env.clientUrl
} ) );
app.use( "/api" , router );

// Определение требования авторизации
const swaggerOptions = {
    swaggerDefinition : {
        openapi : "3.0.0" ,
        info : {
            title : "My API" ,
            description : "API documentation for My Server" ,
            version : "1.0.0" ,
        } ,
        servers : [
            {
                url : "http://localhost:5000" ,
                description : "Local server" ,
            } ,
        ] ,
        components : {
            securitySchemes : {
                BearerAuth : {
                    type : "http" ,
                    scheme : "bearer" ,
                    bearerFormat : "JWT" ,
                } ,
            } ,
        } ,
        security : [ { BearerAuth : [] } ] ,
    } ,
    apis : [ "./src/router/*.ts" ] , // Путь к файлам с описанием маршрутов
};

const swaggerSpec = swaggerJsdoc( swaggerOptions );

app.use( "/api-docs" , swaggerUi.serve , swaggerUi.setup( swaggerSpec ) );
app.use( errorHandler );

const start = async () => {
    try {
        await prisma.$connect();
        app.listen( PORT , () => console.log( ` Server started on PORT = ${ PORT }` ) );
        await service.startCleanup();

    }
    catch ( e ) {
        console.log( e );
    }
};

start();
