import { inject, injectable } from "tsyringe";
import { ISlotRepo } from "domain/repositories/ISlotRepo";
import { IUpdateTrainerWeeklyAvailabilityUseCase } from "application/interfaces/slot/i-update-trainer-weekly-availability.usecase"; 
import { UpdateTrainerAvailabilityRequestDTO } from "application/dto/slot/update-trainer-availability.dto";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";

@injectable()
export class UpdateTrainerWeeklyAvailabilityUseCase implements IUpdateTrainerWeeklyAvailabilityUseCase {
  constructor(
    @inject("ITrainerSlotRepo") private readonly _slotRepo: ISlotRepo
  ) {}

  async execute(input: UpdateTrainerAvailabilityRequestDTO): Promise<void> {
    const { trainerId, availability } = input;

    this.validateSlots(availability);

    await this._slotRepo.updateWeeklyAvailability(
      trainerId,
      availability
    );

  }

  private validateSlots(availability: UpdateTrainerAvailabilityRequestDTO["availability"]): void {
    const timeToMinutes = (time: string): number => {
      const [timePart, modifier] = time.split(" ");
      let [hours, minutes] = timePart.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };

    for (const day in availability) {
      const slots = availability[day as keyof typeof availability];
      if (!slots || slots.length === 0) continue;

      const sorted = [...slots].sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

      let prevEnd = -1;
      for (const slot of sorted) {
        const start = timeToMinutes(slot.start);
        const end = timeToMinutes(slot.end);

        if (start >= end) {
          throw new AppError(`On ${day}, start time ${slot.start} must be before end time ${slot.end}`, HttpStatus.BAD_REQUEST);
        }
        if (start < prevEnd) {
          throw new AppError(`Overlapping slots detected on ${day}`, HttpStatus.BAD_REQUEST);
        }
        prevEnd = end;
      }
    }
  }
}