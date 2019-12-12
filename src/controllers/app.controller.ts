import { Request, Response } from 'express'

export class AppController {
    addUser = async (req: Request, res: Response): Promise<Response> => {
        // Code to add User
        return res.send({ messge: 'User Added successfully' })
    }

    getUserList = async (req: Request, res: Response): Promise<Response> => {
        return res.send([{ id: 1, name: 'Ramesh' }, { id: 2, name: 'Rajesh' }, { id: 3, name: 'Suresh' }])
    }
}
