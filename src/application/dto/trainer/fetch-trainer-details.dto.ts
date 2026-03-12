
export interface TrainerDetailsResponseDTO {
    trainerId: string;
    name: string;
    email: string;
    status: boolean;
    profilePic: string;
    pricePerSession: number;
    verified: string;
    certificate: string;
    joined: string;
    gender: string;
    programs: { programId: string; name: string }[];
    role: string;
    experience: number;
    languages:string[];
    rejectReason?: string;
    phone?:string
}

export interface TrainerPrivateProfileDTO extends TrainerDetailsResponseDTO{
    address: string;
    bio: string;
}

export interface UserTrainerViewDTO extends TrainerDetailsResponseDTO{
    address: string;
    bio: string;
    rating: number;
}