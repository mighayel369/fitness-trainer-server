


export interface IFetchAllBookingsUseCase<I, O> {
  execute(input: I): Promise<O>;
}