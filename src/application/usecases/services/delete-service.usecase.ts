import { IServiceRepo } from "domain/repositories/IServiceRepo";
import { inject, injectable } from "tsyringe";
import { IDeleteServiceUseCase } from "application/interfaces/services/i-delete.service.usecase";
import { AppError } from "domain/errors/AppError";
import { HttpStatus } from "utils/HttpStatus";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { ERROR_MESSAGES } from "utils/ErrorMessage";
@injectable()
export class DeleteServiceUseCase implements IDeleteServiceUseCase {
  constructor(
    @inject("IServiceRepo") private _serviceRepo: IServiceRepo,
    @inject("BookingRepo") private _bookingRepo: IBookingRepo
  ) {}

  async execute(serviceId: string): Promise<void> {

    const result = await this._serviceRepo.deleteService(serviceId);
    if(!result){
      throw new AppError(ERROR_MESSAGES.SERVICE_NOT_FOUND,HttpStatus.BAD_REQUEST)
    }
  }
}