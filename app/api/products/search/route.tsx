import {NextRequest, NextResponse} from "next/server";
import schema from "../schema";
import prisma from "@/prisma/client";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const result = await prisma.product.findMany({
    where: {
      productName: {
        contains: body.productName,
      },
    },
  });

  return NextResponse.json(result);
}
