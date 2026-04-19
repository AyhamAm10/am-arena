import { Platform } from "react-native";

export type LocalImageAsset = {
  uri: string;
  mimeType: string;
  fileName: string;
};

export type UploadedCloudinaryImage = {
  avatarUrl: string;
  avatarPublicId: string;
};

/**
 * Uploads a picked image to Cloudinary as multipart form-data.
 * On iOS/Android, `FormData` must use `{ uri, type, name }` (not a raw object blob).
 * On web, the RN file shape is serialized as "[object Object]" — use a real Blob instead.
 */
export async function uploadImageToCloudinary(
  asset: LocalImageAsset
): Promise<UploadedCloudinaryImage> {
  const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME?.trim();
  const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET?.trim();

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary environment variables are missing.");
  }

  const uri = asset.uri?.trim();
  if (!uri) {
    throw new Error("Missing image URI.");
  }

  const name = (asset.fileName || "avatar.jpg").replace(/[/\\]/g, "_");
  const type = asset.mimeType?.trim() || "image/jpeg";

  const formData = new FormData();

  if (Platform.OS === "web") {
    const res = await fetch(uri);
    const blob = await res.blob();
    const file =
      typeof File !== "undefined"
        ? new File([blob], name, { type: blob.type || type })
        : blob;
    formData.append("file", file as Blob);
  } else {
    formData.append("file", {
      uri,
      type,
      name,
    } as any);
  }

  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const payload = await response.json();
  if (!response.ok || !payload?.secure_url || !payload?.public_id) {
    throw new Error(payload?.error?.message || "Cloudinary upload failed.");
  }

  return {
    avatarUrl: payload.secure_url,
    avatarPublicId: payload.public_id,
  };
}
