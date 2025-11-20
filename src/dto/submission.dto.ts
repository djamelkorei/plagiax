export interface SubmissionStatsDto {
  year: number;
  month: number;
  count: number;
}

export interface SubmissionDto {
  id: number;
  title: string;
  posted_at: Date;

  original_filename: string;
  file_link: string;

  report_link: string;
  similarity: number;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "IGNORED" | "DELETED";
  error_message: string;

  ai_link: string;
  ai_similarity: number;
  ai_error_message: string;
  ai_state: "IGNORED" | "COMPLETE" | "REJECTED" | "ERROR" | "FAILED";

  user_name: string;
  user_email: string;
}
