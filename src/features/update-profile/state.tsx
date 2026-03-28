import { type PropsWithChildren, useState } from "react";
import { useMirrorRegistry } from "./store";

function State({ children }: PropsWithChildren) {
  const [fullName, setFullName] = useState("");
  const [gamerName, setGamerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profileImageUri, setProfileImageUri] = useState("");

  useMirrorRegistry("fullName", fullName, fullName);
  useMirrorRegistry("gamerName", gamerName, gamerName);
  useMirrorRegistry("email", email, email);
  useMirrorRegistry("phone", phone, phone);
  useMirrorRegistry("profileImageUri", profileImageUri, profileImageUri);

  useMirrorRegistry("setFullName", setFullName);
  useMirrorRegistry("setGamerName", setGamerName);
  useMirrorRegistry("setEmail", setEmail);
  useMirrorRegistry("setPhone", setPhone);
  useMirrorRegistry("setProfileImageUri", setProfileImageUri);

  return children;
}

export { State };
