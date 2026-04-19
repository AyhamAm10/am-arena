import type {
  AchievementPublic,
  TournamentHistoryItem,
  TournamentSummary,
  UserAchievementEntry,
} from "@/src/api/types/user.types";

export type ProfileScreenModel = {
  gamerName: string;
  fullName: string;
  profilePictureUrl: string | null;
  xpPoints: number;
  selectedTitle: string | null;
  selectedAchievement: AchievementPublic | null;
  titlesCount: number;
  tournamentsParticipatedCount: number;
  achievements: UserAchievementEntry[];
  earnedTitles: UserAchievementEntry[];
  wonTournaments: TournamentSummary[];
  participatedTournaments: TournamentHistoryItem[];
  level: number;
};

type ProfileUtilsState = {
  screenModel: ProfileScreenModel | null;
  headerTitle: string;
  showBack: boolean;
  showViewAll: boolean;
  showEditButton: boolean;
  showLogoutButton: boolean;
  showFriendButton: boolean;
};

const store = (): ProfileUtilsState => ({
  screenModel: null,
  headerTitle: "My Profile",
  showBack: false,
  showViewAll: false,
  showEditButton: false,
  showLogoutButton: false,
  showFriendButton: false,
});

export { store as ProfileUtilsState };
export type { ProfileUtilsState as ProfileUtilsStateType };
