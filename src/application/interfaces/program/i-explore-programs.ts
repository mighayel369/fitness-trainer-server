import { ExploreProgramsResponseDTO } from "application/dto/programs/program-summary.dto";


export interface IExplorePrograms{
    execute():Promise<ExploreProgramsResponseDTO>
}