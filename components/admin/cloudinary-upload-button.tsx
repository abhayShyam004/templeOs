"use client";

import { useState } from "react";
import { CldUploadWidget } from "next-cloudinary";

type CloudinaryUploadButtonProps = {
  buttonLabel?: string;
  className?: string;
  maxFiles?: number;
  multiple?: boolean;
  onUploaded: (url: string) => void;
  uploadPreset?: string;
};

type UploadInfo = {
  secure_url?: string;
};

type UploadResult = {
  event?: string;
  info?: UploadInfo | string;
};

function getUploadedUrl(result: UploadResult) {
  if (!result || result.event !== "success") return null;
  if (!result.info || typeof result.info === "string") return null;
  return result.info.secure_url ?? null;
}

export function CloudinaryUploadButton({
  buttonLabel = "Upload from Cloudinary",
  className,
  maxFiles = 1,
  multiple = false,
  onUploaded,
  uploadPreset,
}: CloudinaryUploadButtonProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <CldUploadWidget
      options={{
        clientAllowedFormats: ["jpg", "jpeg", "png", "webp", "avif"],
        maxFiles,
        multiple,
        resourceType: "image",
        sources: ["local", "url", "camera"],
      }}
      signatureEndpoint="/api/admin/cloudinary/sign"
      uploadPreset={uploadPreset}
      onClose={() => setIsUploading(false)}
      onError={() => setIsUploading(false)}
      onQueuesStart={() => setIsUploading(true)}
      onSuccess={(result) => {
        const uploadedUrl = getUploadedUrl(result as UploadResult);

        if (uploadedUrl) {
          onUploaded(uploadedUrl);
        }

        setIsUploading(false);
      }}
    >
      {({ open, isLoading }) => (
        <button
          type="button"
          onClick={() => open()}
          disabled={Boolean(isLoading) || isUploading}
          className={className}
        >
          {isUploading ? "Uploading..." : buttonLabel}
        </button>
      )}
    </CldUploadWidget>
  );
}
