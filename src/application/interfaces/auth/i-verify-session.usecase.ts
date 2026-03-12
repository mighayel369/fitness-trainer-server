export interface IVerifySession<T> {
    execute(id: string): Promise<T>;
}