import { inject, injectable } from "tsyringe";
import { ISlotRepo } from "domain/repositories/ISlotRepo";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IFetchTrainerAvailableSlotsUseCase } from "application/interfaces/slot/i-fetch-trainer-available-slots.usecase";
import { generateHourlySlots } from "utils/generateTimeSlots";
import { FetchAvailableSlotsRequestDTO } from "application/dto/slot/fetch-trainer-available-slots.dto";
@injectable()
export class FetchTrainerAvailableSlotsUseCase implements IFetchTrainerAvailableSlotsUseCase {
  constructor(
    @inject("ITrainerSlotRepo") private _slotRepo: ISlotRepo,
    @inject("BookingRepo") private _bookingRepo: IBookingRepo
  ) {}

  async execute(input: FetchAvailableSlotsRequestDTO): Promise<string[]> {
    const { trainerId, date: dateStr } = input;
    const date = new Date(dateStr);
    
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

    const slotDoc = await this._slotRepo.getTrainerSlot(trainerId);
    if (!slotDoc) return [];

    const dayAvailability = slotDoc.weeklyAvailability[dayName as keyof typeof slotDoc.weeklyAvailability];
    if (!dayAvailability || dayAvailability.length === 0) return [];

    const allSlots = generateHourlySlots(dayAvailability, date);
    console.log(allSlots)
    const bookedSlots = await this._bookingRepo.findBookedSlots(trainerId, date);
    console.log(bookedSlots)
     return allSlots.filter(slot => !bookedSlots.includes(slot));
  }
}