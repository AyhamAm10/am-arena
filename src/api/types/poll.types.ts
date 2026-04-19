export type PollType = "tournament" | "global" | "message";
export type PollOptionType = "text" | "user";

export type PollUserRef = {
  id: number;
  gamer_name: string;
  full_name: string;
  avatarUrl: string | null;
  avatarPublicId?: string | null;
};

export type PollOptionResponse = {
  id: number;
  label: string | null;
  type: PollOptionType;
  votes_count: number;
  percentage: number;
  selected?: boolean;
  user: PollUserRef | null;
  voters?: Array<PollUserRef & { voted_at: string | null }>;
};

export type PollResponse = {
  id: number;
  title: string;
  description: string;
  type: PollType;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
  updated_at: string;
  tournament_id: number | null;
  chat_id: number | null;
  message_id: number | null;
  total_votes: number;
  options_count: number;
  closed: boolean;
  current_user_vote_option_id: number | null;
  options: PollOptionResponse[];
};
