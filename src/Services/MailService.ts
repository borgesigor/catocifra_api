import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

class MailService{

  async sendMail(to: string, subject: string, html: string){

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

    const info = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: to,
      subject: subject,
      html: html
    });

    return info

  }

}