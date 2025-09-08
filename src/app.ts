import express from 'express'
import cors from 'cors' 
import bodyParser from 'body-parser'
import userrouter from 'Presentation/routes/userRoute'
import adminrouter from 'Presentation/routes/adminRoute'
import trainerrouter from 'Presentation/routes/trainerRoute'
import cookieParser from 'cookie-parser';
import logger from 'core/logger'
import morgan from 'morgan'
import config from 'config'
console.log(config)
const app=express()
app.use(cors({
  origin: config.CLIENT_URL,
  credentials: true
}))
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim()),
  },
}));
app.use(express.json())
app.use(bodyParser.json())
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))
app.use('/',userrouter)
app.use('/admin',adminrouter)
app.use('/trainer',trainerrouter)


export default app