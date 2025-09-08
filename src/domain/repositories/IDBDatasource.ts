export interface IDBDatasource{
    connectDb():Promise<boolean>
}