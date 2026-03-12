import { 
    FetchProgramInventoryRequestDTO, 
    FetchProgramInventoryResponseDTO 
} from "application/dto/programs/program-summary.dto";

export interface IFetchProgramInventory{
    execute(input: FetchProgramInventoryRequestDTO): Promise<FetchProgramInventoryResponseDTO>;
}