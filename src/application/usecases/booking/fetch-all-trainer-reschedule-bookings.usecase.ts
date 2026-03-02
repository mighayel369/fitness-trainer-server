
import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllTrainerRescheduleBookingsResponseDTO,FetchAllTrainerBookingRequestDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { BookingMapper } from "application/mappers/booking-mapper";
import { BOOKING_STATUS } from "utils/Constants";
@injectable()
export class FetchTrainerAllRescheduleBookings 
  implements IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO,FetchAllTrainerRescheduleBookingsResponseDTO> {
  
  constructor(@inject("BookingRepo") private _repo: IBookingRepo) {}

  async execute(input: FetchAllTrainerBookingRequestDTO): Promise<FetchAllTrainerRescheduleBookingsResponseDTO> {
    const { trainerId, currentPage, limit, searchQuery } = input;
    
    const filter: any = { trainer:trainerId, status: BOOKING_STATUS.RESCHEDULE_REQUESTED };
  
    const { data, totalCount } = await this._repo.findBookings(searchQuery, filter, currentPage, limit);

    return {
      data: data.map((d) => BookingMapper.toTrainerRescheduleRequestsDTO(d)),
      total: Math.ceil(totalCount/limit) 
    };
  }
}