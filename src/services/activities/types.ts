
// Define the TeamActivity type
export interface TeamActivity {
  id: string;
  team_id: string;
  logged_by_user_id: string;
  verified_user_id: string;
  status: "pending" | "completed";
  created_at: string;
  cycle_start: string;
  cycle_end: string | null;
}
