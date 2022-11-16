import express from 'express'
import dotenv from 'dotenv'
import { verifyAcces } from './middlewares/verify.middlewares.js'
import routers from './routers/routers.js'

dotenv.config()
const app = express()
app.use(express.json())
app.use(verifyAcces)

app.use(routers)

// admin password olma

app.listen(7000 , console.log(7000))