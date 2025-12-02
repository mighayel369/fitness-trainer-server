import { TrainerSlotEntity } from "domain/entities/TrainerSlotEntity";
import { IFindTrainerSlotUseCase } from "domain/usecases/IFIndTrainerSlotUseCase";
import { ITrainerRepo } from "domain/repositories/ITrainerRepo";
import { inject, injectable } from "tsyringe";
import dayjs from "dayjs";
import { ITrainerSlotRepo } from "domain/repositories/ITrainerSlotRepo";

@injectable()
export class FindTrainerSlotUseCase implements IFindTrainerSlotUseCase {
  constructor(
    @inject("ITrainerRepo") private readonly trainerRepo: ITrainerRepo,
    @inject("ITrainerSlotRepo") private readonly trainerSlotRepo: ITrainerSlotRepo
  ) {}

  async findSlots(trainerId: string): Promise<{ date: string; slots: TrainerSlotEntity[] }[]> {
    const trainer = await this.trainerRepo.findTrainerById(trainerId);
    if (!trainer || !trainer.timeSlot || trainer.timeSlot.length === 0) {
    return [];
    }

    let days: string[] = [];
    let current = dayjs();

    while (days.length < 6) {
      if (current.day() !== 0) {
        days.push(current.format("YYYY-MM-DD"));
      }
      current = current.add(1, "day");
    }

    const bookOrLeaveSlots = await this.trainerSlotRepo.find(
      trainerId,
      days[0],
      days[days.length - 1]
    );

    const result = days.map(date => {
      const slots: TrainerSlotEntity[] = trainer.timeSlot!.map(slot => {
        const override = bookOrLeaveSlots?.find(
          x => x.date === date && x.startTime === slot.startTime
        );

        return new TrainerSlotEntity(
          override?._id?.toString() || "",   
          trainerId,                         
          date,                                
          slot.startTime,                    
          slot.endTime,                      
          override ? override.status : "available",
          override?.bookedBy?.toString() || null  
        );
      });

      return { date, slots };
    });
  
    return result;
  }
}
