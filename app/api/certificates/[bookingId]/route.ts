import { NextResponse } from "next/server";

export async function POST(
  _request: Request,
  { params }: { params: { bookingId: string } },
) {
  return NextResponse.json({
    bookingId: params.bookingId,
    certificateUrl: "https://res.cloudinary.com/demo/raw/upload/sample-certificate.pdf",
  });
}
