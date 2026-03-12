interface BaseSessionDTO {
    name: string;
    role: string;
    profilePic: string;
    status: boolean;
}

export interface ClientSessionDTO extends BaseSessionDTO {}

export interface TrainerSessionDTO extends BaseSessionDTO {
    verified: "pending" | "approved" | "rejected";
}