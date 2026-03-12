
export interface IArchiveProgram {
    execute(programId: string): Promise<void>;
}