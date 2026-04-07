import { v2 as cloudinary } from "cloudinary";

let configured = false;

function getRequiredEnv(name: "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME" | "NEXT_PUBLIC_CLOUDINARY_API_KEY" | "CLOUDINARY_API_SECRET") {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required Cloudinary environment variable: ${name}`);
  }

  return value;
}

export function getCloudinary() {
  if (!configured) {
    cloudinary.config({
      cloud_name: getRequiredEnv("NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME"),
      api_key: getRequiredEnv("NEXT_PUBLIC_CLOUDINARY_API_KEY"),
      api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
      secure: true,
    });

    configured = true;
  }

  return cloudinary;
}

export function signCloudinaryParams(paramsToSign: Record<string, string | number | boolean>) {
  const apiSecret = getRequiredEnv("CLOUDINARY_API_SECRET");

  return getCloudinary().utils.api_sign_request(paramsToSign, apiSecret);
}
