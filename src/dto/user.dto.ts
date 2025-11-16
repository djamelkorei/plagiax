export interface AuthDto {
  id: number,
  name: string,
  email: string,
  ai_enabled: boolean,
  student_count: number,
  submission_count: number,
  membership_threshold: number,
  membership_length: number,
  membership_student_count: number,
  membership_started_at: Date,
  membership_ended_at: Date,
  membership_days_left: number,
  is_membership_active: boolean,
  is_instructor: boolean,
}

export interface UserDTO {
  id: number,
  name: string,
  email: string,
  created_at: string,
  active: boolean,
}
