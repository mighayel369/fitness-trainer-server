export interface UpdateStatusRequestDTO{
    id:string,
    isActive:boolean
}

export interface UpdateStatusResponseDTO{
    success:boolean,
    message:string,
    newStatus:boolean
}