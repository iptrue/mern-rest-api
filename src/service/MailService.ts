import nodemailer, { TransportOptions } from "nodemailer";import env from "../environment/EnvironmentEntity";

class MailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        const transportOptions = {
            host: env.smtpHost,
            port: env.port,
            secure: true,
            auth: {
                user: env.smtpUser,
                pass: env.smtpPassword,
            },
        };
        this.transporter = nodemailer.createTransport(transportOptions);
    }

    public async sendActivationMail( to: string , link: string ): Promise<void> {
        try {
            console.log( "sent email to " , to , "with link " , link );
            await this.transporter.sendMail( {
                from : env.smtpUser ,
                to ,
                subject : "Активация аккаунта на " + env.apiUrl ,
                text : "" ,
                html :
                    `<div>
              <h1>Для активации перейдите по ссылке</h1>
          <a href="${ link }">${ link }</a>
      </div>`

            } );
        }
        catch ( e ) {
            console.log( e );
        }

    }
}

const mailService = new MailService();
export default mailService;