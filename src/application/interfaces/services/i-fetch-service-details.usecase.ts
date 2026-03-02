import { ServiceDetailsResponseDTO } from "application/dto/services/service-details.dto";
export interface IFetchServiceDetailsUseCase {
  execute(serviceId: string): Promise<ServiceDetailsResponseDTO>;
}