import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const totalBookings = await prisma.booking.count();
    const pendingOrders = await prisma.prasadOrder.count({ where: { status: "PROCESSING" } });
    const pendingGoodieOrders = await prisma.goodieOrder.count({ where: { status: "PROCESSING" } });
    const pendingTestimonials = await prisma.testimonial.count({ where: { isApproved: false } });
    
    // Fetch paid bookings and sum their pooja prices
    const paidBookings = await prisma.booking.findMany({
      where: { paymentStatus: "PAID" },
      include: { pooja: { select: { price: true } } }
    });
    const bookingRevenue = paidBookings.reduce((acc, b) => acc + b.pooja.price, 0);

    // Fetch paid prasad orders and sum their total amounts
    const prasadOrders = await prisma.prasadOrder.findMany({
      where: { paymentId: { not: null } } // Assuming paymentId presence means paid for now
    });
    const prasadRevenue = prasadOrders.reduce((acc, o) => acc + o.totalAmount, 0);
    const goodieOrders = await prisma.goodieOrder.findMany({
      where: { paymentId: { not: null } }
    });
    const goodiesRevenue = goodieOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    const revenue = bookingRevenue + prasadRevenue + goodiesRevenue;

    const darshanConfig = await prisma.darshanConfig.findFirst();

    return NextResponse.json({
      totalBookings,
      revenue,
      pendingOrders: pendingOrders + pendingGoodieOrders,
      pendingTestimonials,
      isLive: darshanConfig?.isLive || false,
      liveDarshanUrl: darshanConfig?.youtubeUrl || "",
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({
      totalBookings: 0,
      revenue: 0,
      pendingOrders: 0,
      pendingTestimonials: 0,
      isLive: false,
      liveDarshanUrl: "",
    }, { status: 500 });
  }
}
