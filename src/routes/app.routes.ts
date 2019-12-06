import { AppController } from '../controllers/app.controller'

const express = require('express')

export class AppRoutes {
    private path = '/api'
    public router = express.Router()

    constructor(private appController: AppController = new AppController()) {
        this.initializeRoutes()
    }

    private initializeRoutes = () => {
        this.router.post(`${this.path}/addUser`, this.appController.addUser)
        this.router.get(`${this.path}/userList`, this.appController.getUserList)
    }
}
