import type { ReelCommentEntity, ReelEntity } from "@/src/api/types/reel.types";
import type { ApiPaginationMeta } from "@/src/api/types/pubg-tournament.types";

type ApiState = {
  reels: ReelEntity[];
  reelsMeta: ApiPaginationMeta | undefined;
  isLoadingReels: boolean;
  isReelsError: boolean;
  likeReel: (reelId: string) => Promise<unknown>;
  removeReelLike: (reelId: string) => Promise<void>;
  isReelLikeBusy: boolean;
  addReelComment: (reelId: string, comment: string) => Promise<unknown>;
  isAddingComment: boolean;
  comments: ReelCommentEntity[];
  isLoadingComments: boolean;
  commentReelId: string | null;
  setCommentReelId: (reelId: string | null) => void;
};

const store = (): ApiState => ({
  reels: [],
  reelsMeta: undefined,
  isLoadingReels: false,
  isReelsError: false,
  likeReel: async () => {},
  removeReelLike: async () => {},
  isReelLikeBusy: false,
  addReelComment: async () => {},
  isAddingComment: false,
  comments: [],
  isLoadingComments: false,
  commentReelId: null,
  setCommentReelId: () => {},
});

export { store as ApiState };
export type { ApiState as ReelsApiState };
