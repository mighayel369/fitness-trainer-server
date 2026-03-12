import {ToggleProgramVisibilityRequestDTO, ToggleProgramVisibilityResponseDTO } from "../../dto/programs/toggle-program-visibility.dto";


export interface IToggleProgramVisibility{
    execute(input: ToggleProgramVisibilityRequestDTO): Promise<ToggleProgramVisibilityResponseDTO>;
}