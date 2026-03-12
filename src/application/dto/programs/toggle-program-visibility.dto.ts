export interface ToggleProgramVisibilityRequestDTO {
  programId: string;
  isPublished: boolean;
}

export interface ToggleProgramVisibilityResponseDTO {
  isPublished: boolean;
}