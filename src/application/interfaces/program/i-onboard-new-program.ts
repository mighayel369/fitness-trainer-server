import { OnboardProgramRequestDTO } from "application/dto/programs/onboard-new-program.dto";

export interface IOnboardNewProgram {
    execute(input: OnboardProgramRequestDTO): Promise<void>;
}