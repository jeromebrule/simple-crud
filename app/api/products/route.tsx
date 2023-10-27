import { NextRequest, NextResponse } from "next/server";
import schema from "./schema";
import prisma from "prisma/client";

/**
 * @swagger
 * /api/products:
 *   get:
 *     description: Get all the products
 *     responses:
 *       200:
 *         description: Get all products
 */
export async function GET(request: NextRequest) {
  const products = await prisma.product.findMany();

  return NextResponse.json(products);
}

/**
 * @swagger
 * /api/products/:
 *   post:
 *     summary: Create a single product.
 *     description: Create a single product by ID.
 *     requestBody:
 *       description: Create product information.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: The product name.
 *               productOwnerName:
 *                 type: string
 *                 description: The product owner name.
 *               developers:
 *                 type: array
 *                 description: The product developer names.
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     projectNumber:
 *                       type: string
 *                       description: Project Number - Auto Generated
 *                       example: 0
 *                     name:
 *                       type: string
 *               scrumMasterName:
 *                 type: string
 *                 description: The scrum master name.
 *               startDate:
 *                 type: string
 *                 description: Starting date
 *               methodology:
 *                 type: string
 *                 description: Methodology
 *               location:
 *                 type: string
 *                 description: Where the project is located
 *     responses:
 *       200:
 *         description: Product updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: The product ID.
 *                     productName:
 *                       type: string
 *                       description: The product name.
 *                     productOwnerName:
 *                       type: string
 *                       description: The product owner name.
 *                     developers:
 *                       type: array
 *                       description: The product developer names.
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           name:
 *                             type: string
 *                     scrumMasterName:
 *                       type: string
 *                       description: The scrum master name.
 *                     startDate:
 *                       type: string
 *                       description: Starting date
 *                     methodology:
 *                       type: string
 *                       description: Methodology
 *                     location:
 *                       type: string
 *                       description: Where the project is located
 */

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validation = schema.safeParse(body);

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { name: body.name },
  });

  if (product)
    return NextResponse.json(
      { error: "product already exist" },
      { status: 400 }
    );

  const newProduct = await prisma.product.create({
    data: {
      name: body.name,
    },
  });

  return NextResponse.json(newProduct, { status: 201 });
}
