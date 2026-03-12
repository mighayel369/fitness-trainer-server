import { ModifyProgramSpecsRequestDTO } from "application/dto/programs/modify-program-sepcs.dto";

export interface IModifyProgramSpecs{
    execute(input: ModifyProgramSpecsRequestDTO): Promise<void>;
}