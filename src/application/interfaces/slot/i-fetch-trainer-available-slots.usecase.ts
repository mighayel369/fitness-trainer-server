import { FetchAvailableSlotsRequestDTO } from "application/dto/slot/fetch-trainer-available-slots.dto";
export interface IFetchTrainerAvailableSlotsUseCase {
  execute(input: FetchAvailableSlotsRequestDTO): Promise<string[]>;
}