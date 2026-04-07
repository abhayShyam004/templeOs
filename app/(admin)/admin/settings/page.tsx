import { AdminSettingsClient } from "./settings-client";

export default function AdminSettingsPage() {
  return (
    <AdminSettingsClient
      uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET || process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
    />
  );
}
