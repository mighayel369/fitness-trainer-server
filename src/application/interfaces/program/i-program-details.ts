import { ProgramDetailsResponseDTO } from "application/dto/programs/program-details.dto";

export interface IFetchProgramDetails{
    execute(programId: string): Promise<ProgramDetailsResponseDTO>;
}