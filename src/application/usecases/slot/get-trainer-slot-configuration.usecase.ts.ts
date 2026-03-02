import { inject, injectable } from "tsyringe";
import { ISlotRepo } from "domain/repositories/ISlotRepo";
import { IGetTrainerSlotConfigurationUseCase } from "application/interfaces/slot/i-get-trainer-slot-configuration.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { TrainerSlotResponseDTO } from "application/dto/slot/trainer-slot-response.dto";
import { SlotMapper } from "application/mappers/slot-mapper";
@injectable()
export class GetTrainerSlotConfigurationUseCase implements IGetTrainerSlotConfigurationUseCase {
  constructor(
    @inject("ITrainerSlotRepo") private readonly _slotRepo: ISlotRepo
  ) {}

  async execute(trainerId: string): Promise<TrainerSlotResponseDTO> {
    let slotEntity = await this._slotRepo.getTrainerSlot(trainerId);

    if (!slotEntity) {
      slotEntity = await this._slotRepo.createTrainerSlot(trainerId);
    }

    if (!slotEntity) {
      throw new AppError("Could not retrieve trainer availability", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    return SlotMapper.toTrainerSlotResponseDTO(slotEntity)
  }
  }