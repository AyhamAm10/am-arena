import { useFetchCurrentUser } from "@/src/hooks/api/auth/useFetchCurrentUser";
import { uploadImageToCloudinary } from "@/src/lib/cloudinary/upload-image";
import { formatImageUrl } from "@/src/lib/utils/image-url-factory";
import * as ImagePicker from "expo-image-picker";
import {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { useMirror, useMirrorRegistry } from "./store";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type InitialSnap = {
  fullName: string;
  gamerName: string;
  email: string;
  phone: string;
};

function Utils({ children }: PropsWithChildren) {
  const submit = useMirror("submit");
  const isLoading = useMirror("isLoading");
  const fullName = useMirror("fullName");
  const gamerName = useMirror("gamerName");
  const email = useMirror("email");
  const phone = useMirror("phone");
  const profileImageUri = useMirror("profileImageUri");
  const setFullName = useMirror("setFullName");
  const setGamerName = useMirror("setGamerName");
  const setEmail = useMirror("setEmail");
  const setPhone = useMirror("setPhone");
  const setProfileImageUri = useMirror("setProfileImageUri");

  const initialRef = useRef<InitialSnap | null>(null);
  const pickedImageRef = useRef<{
    uri: string;
    mimeType: string;
    fileName: string;
  } | null>(null);

  const meQuery = useFetchCurrentUser({ enabled: true });
  const currentUser = meQuery.data;
  const isLoadingUser = meQuery.isLoading || meQuery.isFetching;
  const isUserError = meQuery.isError;
  const showInitialSpinner = meQuery.isLoading && !meQuery.data;

  useEffect(() => {
    if (!currentUser) return;
    const snap: InitialSnap = {
      fullName: currentUser.full_name.trim(),
      gamerName: currentUser.gamer_name.trim(),
      email: currentUser.email.trim(),
      phone: String(currentUser.phone ?? "").trim(),
    };
    initialRef.current = snap;
    setFullName(currentUser.full_name);
    setGamerName(currentUser.gamer_name);
    setEmail(currentUser.email);
    setPhone(String(currentUser.phone ?? ""));
    setProfileImageUri("");
    pickedImageRef.current = null;
  }, [
    currentUser?.id,
    currentUser?.updated_at,
    currentUser?.full_name,
    currentUser?.gamer_name,
    currentUser?.email,
    currentUser?.phone,
    setFullName,
    setGamerName,
    setEmail,
    setPhone,
    setProfileImageUri,
  ]);

  const remoteAvatarUrl = useMemo(() => {
    if (!currentUser?.avatarUrl) return null;
    return formatImageUrl(currentUser.avatarUrl) || null;
  }, [currentUser?.avatarUrl]);

  const dirty = useMemo(() => {
    if (!initialRef.current) return false;
    const i = initialRef.current;
    if (profileImageUri) return true;
    return (
      fullName.trim() !== i.fullName ||
      gamerName.trim() !== i.gamerName ||
      email.trim() !== i.email ||
      phone.trim() !== i.phone
    );
  }, [fullName, gamerName, email, phone, profileImageUri]);

  const formError = useMemo(() => {
    const e = email.trim();
    if (e && !EMAIL_RE.test(e)) {
      return "صيغة البريد الإلكتروني غير صحيحة.";
    }
    return null;
  }, [email]);

  const showUsernameAvailable = useMemo(() => {
    const i = initialRef.current;
    if (!i) return false;
    const g = gamerName.trim();
    if (g === i.gamerName) return false;
    return g.length >= 3 && /^[a-zA-Z0-9_]+$/.test(g);
  }, [gamerName]);

  const canSubmit = useMemo(() => {
    return (
      !!initialRef.current &&
      dirty &&
      !formError &&
      !isLoading &&
      !isLoadingUser &&
      !isUserError
    );
  }, [dirty, formError, isLoading, isLoadingUser, isUserError]);

  const footerCaption = useMemo(() => {
    if (isLoadingUser || isUserError) return "";
    if (!dirty) return "لا توجد تغييرات على الملف الحالي";
    return "";
  }, [dirty, isLoadingUser, isUserError]);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
    });

    if (result.canceled || !result.assets?.length) {
      return;
    }

    const asset = result.assets[0];
    pickedImageRef.current = {
      uri: asset.uri,
      mimeType: asset.mimeType ?? "image/jpeg",
      fileName: asset.fileName ?? "avatar.jpg",
    };
    setProfileImageUri(asset.uri);
  };

  const onSubmit = async () => {
    if (!canSubmit || !initialRef.current) return;

    const payload: Record<string, string | null> = {
      full_name: fullName.trim(),
      gamer_name: gamerName.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    if (profileImageUri) {
      const picked = pickedImageRef.current;
      const uploaded = await uploadImageToCloudinary({
        uri: picked?.uri ?? profileImageUri,
        fileName: picked?.fileName || "profile.jpg",
        mimeType: picked?.mimeType || "image/jpeg",
      });

      payload.avatarUrl = uploaded.avatarUrl;
      payload.avatarPublicId = uploaded.avatarPublicId;
    }

    await submit(payload);
  };

  useMirrorRegistry("formError", formError);
  useMirrorRegistry("canSubmit", canSubmit);
  useMirrorRegistry("pickImage", pickImage, profileImageUri);
  useMirrorRegistry("onSubmit", onSubmit, canSubmit);
  useMirrorRegistry("isLoadingUser", isLoadingUser, isLoadingUser);
  useMirrorRegistry("isUserError", isUserError, isUserError);
  useMirrorRegistry("showUsernameAvailable", showUsernameAvailable, gamerName);
  useMirrorRegistry("footerCaption", footerCaption, footerCaption);
  useMirrorRegistry("remoteAvatarUrl", remoteAvatarUrl, remoteAvatarUrl);
  useMirrorRegistry(
    "showInitialSpinner",
    showInitialSpinner,
    showInitialSpinner
  );

  return children;
}

export { Utils };
