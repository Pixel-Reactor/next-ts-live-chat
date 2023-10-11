import { Router } from "express";
import { loginUser } from "../controllers/loginUser.js";
import newUser from "../controllers/newUser.js";
import fileUpload from '../middlewares/fileUpload.js'
import { formCheck } from "../middlewares/formCheck.js";
import { SendMail } from "../controllers/SendMail.js";
import { ConfirmUser } from "../controllers/ConfirmUser.js";
import { GetMailForm } from "../controllers/GetMailForm.js";
import { CheckUsername } from "../controllers/CheckUsername.js";
import { CheckEmail } from "../controllers/CheckEmail.js";
import ResendEmail from "../controllers/ResendEmail.js";
import { isUser } from "../middlewares/isUser.js";
import { GetUserInfo } from "../controllers/GetUserInfo.js";
import { ImgLink } from "../controllers/imgLink.js";
import { GetMessages } from "../controllers/GetMessages.js";
import { GetChannelsList } from "../controllers/GetChannelsList.js";

const router = Router()


router.post('/signup',fileUpload,formCheck,newUser,SendMail)

router.get('/activation/:code',ConfirmUser)

router.get('/getmail/:id',GetMailForm)

router.post('/check/username',CheckUsername)

router.post('/check/email',CheckEmail)

router.post('/resend/email',ResendEmail,SendMail)

router.post('/login',loginUser)

router.post('/userinfo',isUser,GetUserInfo)

router.post('/getmessages',isUser,GetMessages)

router.post('/channelinfo',isUser,GetMessages)

router.get('/getchannels',isUser,GetChannelsList)


router.get('/avatar/:id', ImgLink);


router.get('/ping',async(req,res)=>{
    res.status(200).json({message:'recibido!'})
})




export default router