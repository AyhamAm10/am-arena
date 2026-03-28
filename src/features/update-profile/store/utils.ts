type UpdateProfileUtils = {
  canSubmit: boolean;
  formError: string | null;
  pickImage: () => Promise<void>;
  onSubmit: () => Promise<void>;
  isLoadingUser: boolean;
  isUserError: boolean;
  showUsernameAvailable: boolean;
  footerCaption: string;
  remoteAvatarUrl: string | null;
  showInitialSpinner: boolean;
};

const store = (): UpdateProfileUtils => ({
  canSubmit: false,
  formError: null,
  pickImage: async () => {},
  onSubmit: async () => {},
  isLoadingUser: true,
  isUserError: false,
  showUsernameAvailable: false,
  footerCaption: "",
  remoteAvatarUrl: null,
  showInitialSpinner: true,
});

export { store as UpdateProfileUtils };
export type { UpdateProfileUtils as UpdateProfileUtilsType };
