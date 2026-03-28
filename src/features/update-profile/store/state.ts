type UpdateProfileState = {
  fullName: string;
  gamerName: string;
  email: string;
  phone: string;
  profileImageUri: string;
  setFullName: (v: string) => void;
  setGamerName: (v: string) => void;
  setEmail: (v: string) => void;
  setPhone: (v: string) => void;
  setProfileImageUri: (v: string) => void;
};

const store = (): UpdateProfileState => ({
  fullName: "",
  gamerName: "",
  email: "",
  phone: "",
  profileImageUri: "",
  setFullName: () => {},
  setGamerName: () => {},
  setEmail: () => {},
  setPhone: () => {},
  setProfileImageUri: () => {},
});

export { store as UpdateProfileState };
export type { UpdateProfileState as UpdateProfileStateType };
