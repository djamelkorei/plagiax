import axios from "axios";
import type { SubmissionStatsDto } from "@/dto/submission.dto";
import type { AuthDto } from "@/dto/user.dto";

export type ApiResponse<T> =
  | {
      hasError: false;
      data: T; // Always valid when no error
      error: null; // Explicitly null
    }
  | {
      hasError: true;
      data: null; // Must be null when error
      error: string; // Must exist when error
    };

const api_auth_me = async (): Promise<ApiResponse<AuthDto>> => {
  try {
    const res = await axios.get<AuthDto>("/api/auth/me");

    return {
      data: res.data,
      hasError: false,
      error: null,
    };
  } catch (error: any) {
    console.error("Error in api_auth_me:", error);
    return {
      data: null,
      hasError: true,
      error:
        error?.response?.data?.message ??
        error?.message ??
        "Failed to fetch authenticated user",
    };
  }
};

const api_submissions_stats = async (): Promise<
  ApiResponse<SubmissionStatsDto[]>
> => {
  try {
    const res = await axios.get<SubmissionStatsDto[]>("/api/submissions/stats");

    return {
      data: res.data,
      hasError: false,
      error: null,
    };
  } catch (error: any) {
    console.error("Error in api_submissions_stats:", error);
    return {
      data: null,
      hasError: true,
      error:
        error?.response?.data?.message ??
        error?.message ??
        "Failed to fetch authenticated user",
    };
  }
};

export const ClientService = {
  api: {
    auth: {
      me: api_auth_me,
    },
    submissions: {
      stats: api_submissions_stats,
    },
  },
};
