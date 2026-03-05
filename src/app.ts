import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import authRouter from './Presentation/routes/auth-route'
import userRouter from './Presentation/routes/user-route'
import trainerRouter from './Presentation/routes/trainer-route'
import serviceRouter from './Presentation/routes/service-route'
import bookingRouter from './Presentation/routes/booking-route'
import walletRouter from './Presentation/routes/wallet-route'
import paymentRouter from './Presentation/routes/payment-route'
import slotRouter from './Presentation/routes/slot-route'
import dashboardRouter from './Presentation/routes/dashboard-route'


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

app.use('/auth', authRouter)
app.use('/user',userRouter)
app.use('/trainer',trainerRouter)
app.use('/service',serviceRouter)
app.use('/booking',bookingRouter)
app.use('/wallet',walletRouter)
app.use('/payment',paymentRouter)
app.use('/slot',slotRouter)
app.use('/dashboard',dashboardRouter)

app.use(errorHandler)

export default app