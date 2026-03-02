import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import userrouter from 'Presentation/routes/userRoute'
import adminrouter from 'Presentation/routes/adminRoute'
import trainerrouter from 'Presentation/routes/trainerRoute'
import publicrouter from 'Presentation/routes/publicRoute'
import cookieParser from 'cookie-parser';
import logger from 'utils/logger'
import morgan from 'morgan'
import config from 'config'
import { errorHandler } from 'Presentation/middleware/errorHandler'
console.log(config)
const app = express()
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
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/public', publicrouter)
app.use('/admin', adminrouter)
app.use('/trainer', trainerrouter)
app.use('/', userrouter)


app.use(errorHandler)

export default app