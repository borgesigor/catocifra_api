import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { UnexpectedError } from '../Shared/Handlers/Errors';

export class MailService{

  private URLSite: string = dotenv.config().parsed?.URL_SITE as string

  private async sendMail(to: string, subject: string, html: string){

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: true,
      auth: {
        user: dotenv.config().parsed?.MAIL_FROM as string,
        pass: dotenv.config().parsed?.MAIL_SENDER_PASSWORD as string
      }
    });

    const sender = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      html: html
    }).catch(err => new UnexpectedError(err));

    return sender

  }

  public async sendResetPassword(to: string, name: string, token: string){

    const style=`
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');

        body{
          font-family: Inter, sans-serif;
          background-color: white;
          color: #141414;
          padding: 0;
          margin: 0;
          font-size: 16px;
        }

        .button{
          padding: 0.7rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;

          background: #141414;
          color: white;
        }

        .container{
          height: 100vh;
          margin: 0 auto;
          width: fit-content;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 2rem;
        }

        .badge{
          background-color: white;
          border: 1px solid #141414;
          width: fit-content;
          padding: 0.25rem 0.7rem;
          border-radius: 5rem;
          font-size: 0.9rem;
        }
        
        p{
          opacity: 80%;
        }

      </style>
    `

    const html = `
      <div class="container">
        ${style}
        <div>
          <h1>Olá, ${name}!</h1>
          <p>
            Você solicitou uma alteração de senha em sua conta,<br/>
            se não foi você, por favor, ignore este e-mail.
            Esse link expira em 30 minutos.
          </p>
        </div>
        <a href="${this.URLSite}/${token}" class="button">
          Trocar senha
        </a>
      </div>
    `

    return await this.sendMail(to, 'Reset your password', html)
    
  }

}