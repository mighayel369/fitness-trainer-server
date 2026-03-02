import { FetchAllTrainersRequestDTO } from "application/dto/trainer/fetch-all-trainers.dto";

export interface IFetchAllTrainersUseCase<responseDTO>{
    execute(input:FetchAllTrainersRequestDTO):Promise<responseDTO>
}