import express, { Application } from 'express'
import { AppRoutes } from './routes/app.routes'

const app: Application = express()
const appRoute = new AppRoutes()
const { config } = require('../config/app.config')
const port = config.get('http.port')

app.use('/', appRoute.router)

app.listen(port, () => {
    console.log(`Server running on ${port}..`)
})
