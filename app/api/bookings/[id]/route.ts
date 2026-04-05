import { NextResponse } from "next/server";

export async function PATCH(
  _request: Request,
  { params }: { params: { id: string } },
) {
  return NextResponse.json({
    booking: {
      id: params.id,
      status: "COMPLETED",
      certificateUrl: "/certificates/sample.pdf",
    },
  });
}
