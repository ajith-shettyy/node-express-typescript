import { Request, Response } from 'express'

import log from '../utility/logger'

export class AppController {
    addUser = async (req: Request, res: Response) => {
        // Code to add User
        res.send({ messge: 'User Added successfully' })
    }

    getUserList = async (req: Request, res: Response) => {
        log.error({
            level: 'ERROR',
            source: 'APP_CONTROLLER',
            message: `Something went wrong in logger utility`,
        })
        res.send([{ id: 1, name: 'Ramesh' }, { id: 2, name: 'Rajesh' }, { id: 3, name: 'Suresh' }])
    }
}
