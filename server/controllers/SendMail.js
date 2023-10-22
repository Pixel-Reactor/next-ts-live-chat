import { Template } from "../ContactForm/Template.js";
import nodemailer from 'nodemailer';
import { dirname } from 'path';
import { fileURLToPath } from "url";

export const SendMail = async (req, res) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));

    try {
       
     
        
        const { email } = req.body;
        const code = req.Code;

        if(!email || !req.Saved ){res.status(201).send({status:403,done:false,message:'Email send failed'})}

        const contentHTML = Template(code) 
        
        const transporter = nodemailer.createTransport({
            service:process.env.MAIL_HOST,
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
            
        })
        const info = await transporter.sendMail({
            from: `${process.env.MAIL_USER}`,
            to: email,
            subject: "Thank you for join DonutChat!",
            attachments: [
            {
                filename: 'background_2.png',
                path: __dirname + '/../ContactForm/images/background_2.png',
                cid: 'bg'
            },
            {
                filename: 'header3',
                path: __dirname + '/../ContactForm/images/header3.png',
                cid: 'header'
            }, ],
            html: contentHTML

        });
      
        if(info.messageId ){
          
            res.status(200).send({status:200,done:true,message:'Mail sent'})
        }else{
           
            res.status(201).send({status:403,done:false,message:'mail send failed'})
        }
       

    } catch (error) {
        console.log(error)
        res.status(201).send({status:403,done:false,message:'mail send failed'})
    }
}