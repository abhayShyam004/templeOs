import { NextResponse } from "next/server";
import { checkAdminAuth } from "@/lib/admin-auth";
import { signCloudinaryParams } from "@/lib/cloudinary";

type SignatureRequestBody = {
  paramsToSign?: Record<string, string | number | boolean>;
};

export async function POST(request: Request) {
  const authCheck = await checkAdminAuth();
  if (authCheck) return authCheck;

  try {
    const body = (await request.json()) as SignatureRequestBody;

    if (!body.paramsToSign || typeof body.paramsToSign !== "object") {
      return NextResponse.json({ error: "Missing paramsToSign payload" }, { status: 400 });
    }

    const signature = signCloudinaryParams(body.paramsToSign);

    return NextResponse.json({ signature });
  } catch (error) {
    console.error("Failed to sign Cloudinary upload params", error);
    return NextResponse.json({ error: "Failed to sign upload params" }, { status: 500 });
  }
}
