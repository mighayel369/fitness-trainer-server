export class TrainerSlotEntity {
  constructor(
    public _id: string,
    public trainer_id: string,
    public date: string,
    public startTime: string,
    public endTime: string,
    public status: string,
    public bookedBy: string | null
  ) {}
}
