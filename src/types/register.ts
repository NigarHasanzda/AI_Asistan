// types.ts
export interface RegisterRequest {
  userName: string;
  email: string;
  password: string;
  role: number; // 0 = normal user, 1 = admin və s.
}

export interface RegisterResponse {
  type: string;
  title: string;
  status: number;
  errors?: {
    [key: string]: string[];
  };
  traceId?: string;
}

export interface CreateProfileRequest {
  fullname: string;
  targetJobId: number;
}

export interface CreateProfileResponse {
  id: number;
  fullname: string;
  targetJobId: number;
}


export type CreateSkillRequest = {
  skillName: string;
};

// Response tipi
export interface CreateSkillResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    skill: string;
    userId: number;
  };
}
