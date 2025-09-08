import { connect } from 'mongoose'
import config from '../../../config'
import { injectable } from "tsyringe";
import { IDBDatasource } from 'domain/repositories/IDBDatasource'
@injectable()

export class IDBDatasourceImpl implements IDBDatasource {
    async connectDb(): Promise<boolean> {
        try {
            const url = config.MONGO_URL
            console.log(url)
            const Connected = await connect(url)
            console.log('database connected successfully')
            return !!Connected
        } catch (err) {
            console.error('DB connection error:', err)
            return false
        }
    }
}

