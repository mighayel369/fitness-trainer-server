
import { inject, injectable } from "tsyringe";
import { IBookingRepo } from "domain/repositories/IBookingRepo";
import { IFetchAllBookingsUseCase } from "application/interfaces/booking/i-fetch-all-bookings.usecase";
import { FetchAllTrainerPendingBookingsResponseDTO,FetchAllTrainerBookingRequestDTO } from "application/dto/booking/fetch-all-bookings.dto";
import { BookingMapper } from "application/mappers/booking-mapper";
import { BOOKING_STATUS } from "utils/Constants";
@injectable()
export class FetchTrainerAllPendingBookings 
  implements IFetchAllBookingsUseCase<FetchAllTrainerBookingRequestDTO, FetchAllTrainerPendingBookingsResponseDTO> {
  
  constructor(@inject("BookingRepo") private _repo: IBookingRepo) {}

  async execute(input: FetchAllTrainerBookingRequestDTO): Promise<FetchAllTrainerPendingBookingsResponseDTO> {
    const { trainerId, currentPage, limit, searchQuery } = input;
    
    const filter: any = { trainer:trainerId, status: BOOKING_STATUS.PENDING};
    
    const { data, totalCount } = await this._repo.findBookings(searchQuery, filter, currentPage, limit);

    return {
      data: data.map((d) => BookingMapper.toTrainerPendingResponseDTO(d)),
      total: Math.ceil(totalCount/limit) 
    };
  }
}