import type { ReelEntity } from "@/src/api/types/reel.types";
import type { PollResponse } from "@/src/api/types/poll.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

export type ArenaTab = "reels" | "voting";

type ApiState = {
  activeTab: ArenaTab;
  setActiveTab: (tab: ArenaTab) => void;
  reels: ReelEntity[];
  reelsMeta: ApiPaginationMeta | undefined;
  isLoadingReels: boolean;
  isFetchingReels: boolean;
  isReelsError: boolean;
  refreshReels: () => Promise<void>;
  globalPolls: PollResponse[];
  globalPollsMeta: ApiPaginationMeta | undefined;
  isLoadingGlobalPolls: boolean;
  isFetchingGlobalPolls: boolean;
  isGlobalPollsError: boolean;
  refreshGlobalPolls: () => Promise<void>;
  likeReel: (reelId: string) => Promise<unknown>;
  removeReelLike: (reelId: string) => Promise<void>;
  isReelLikeBusy: boolean;
  voteOnPoll: (pollId: number, optionId: number) => Promise<unknown>;
  isVotingPoll: boolean;
  addReelComment: (reelId: string, comment: string, mentionedUserIds?: number[]) => Promise<unknown>;
  isAddingComment: boolean;
  commentReelId: string | null;
  setCommentReelId: (reelId: string | null) => void;
};

const store = (): ApiState => ({
  activeTab: "reels",
  setActiveTab: () => {},
  reels: [],
  reelsMeta: undefined,
  isLoadingReels: false,
  isFetchingReels: false,
  isReelsError: false,
  refreshReels: async () => {},
  globalPolls: [],
  globalPollsMeta: undefined,
  isLoadingGlobalPolls: false,
  isFetchingGlobalPolls: false,
  isGlobalPollsError: false,
  refreshGlobalPolls: async () => {},
  likeReel: async () => {},
  removeReelLike: async () => {},
  isReelLikeBusy: false,
  voteOnPoll: async () => {},
  isVotingPoll: false,
  addReelComment: async () => {},
  isAddingComment: false,
  commentReelId: null,
  setCommentReelId: () => {},
});

export { store as ApiState };
export type { ApiState as ReelsApiState };
