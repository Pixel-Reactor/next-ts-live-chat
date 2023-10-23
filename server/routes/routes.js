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
import { ImgLink } from "../controllers/ImgLink.js";
import { GetMessages } from "../controllers/GetMessages.js";
import { GetChannelsList } from "../controllers/GetChannelsList.js";
import CreateChannel from "../controllers/CreateChannel.js";
import { SrcChannel } from "../controllers/SrcChannel.js";
import { SaveChannel } from "../controllers/SaveChannel.js";
import { RemoveChannel } from "../controllers/ExitChannel.js";
import { PrivateMessage } from "../controllers/PrivateMessage.js";
import { GetConversations } from "../controllers/GetConversations.js";
import { GetConversation } from "../controllers/GetConversation.js";
import { GetPrivateMessages } from "../controllers/GetPrivateMessage.js";
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
 
router.post('/createchannel',isUser,CreateChannel)

router.post('/savechannel',isUser,SaveChannel)

router.post('/privatemessage',isUser,PrivateMessage)

router.get('/conversations',isUser,GetConversations)

router.post('/conversation',isUser,GetConversation)

router.post('/getprivatemessages',isUser,GetPrivateMessages)

router.get('/getchannels',isUser,GetChannelsList)

router.post('/channelsrc',isUser,SrcChannel)

router.post('/removechannel',RemoveChannel)

router.get('/avatar/:id', ImgLink);


router.get('/ping',async(req,res)=>{
    res.status(200).json({message:'recibido!'})
})




export default router
