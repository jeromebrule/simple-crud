import { NextRequest, NextResponse } from "next/server";
import schema from "../schema";
import prisma from "prisma/client";
import { getToken } from "next-auth/jwt";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary:
 *     description: Retrieve a single product.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to get.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Retrieve a single product.
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
 *                       description: The user ID.
 *                       example: 0
 *                     projectNumber:
 *                       type: string
 *                       description: Project Number - Auto Generated
 *                       example: 0
 *                     productName:
 *                       type: string
 *                       description: The product name.
 *                       example: Product test 01
 *                     productOwnerName:
 *                       type: string
 *                       description: The product owner name.
 *                       example: John Smith
 *                     developers:
 *                       type: array
 *                       description: The product developer names.
 *                       example: [{'id':1,'name':'John Smith'}]
 *                     scrumMasterName:
 *                       type: string
 *                       description: The scrum master name.
 *                       example: John Smith
 *                     startDate:
 *                       type: string
 *                       description: Starting date
 *                       example: 2023/12/12
 *                     methodology:
 *                       type: string
 *                       description: Methodology
 *                       example: [AGILE, WATERFALL]
 *                     location:
 *                       type: string
 *                       description: Where the project is located
 *                       example: https://github.com/govt/govttest
 */

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product)
    return NextResponse.json({ error: "product not found" }, { status: 404 });
  return NextResponse.json(product);
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a single product.
 *     description: Update a single product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to update.
 *         schema:
 *           type: integer
 *     requestBody:
 *       description: Updated product information.
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const validation = schema.safeParse(body);

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret: secret });

  // if (!token)
  //   return NextResponse.json({error: "Not authentificated"}, {status: 401});

  if (!validation.success)
    return NextResponse.json(validation.error.errors, { status: 400 });

  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!product)
    return NextResponse.json({ error: "product not found" }, { status: 404 });

  const updatedProduct = await prisma.product.update({
    where: { id: product.id },
    data: {
      name: body.productName,
    },
  });

  return NextResponse.json(updatedProduct);
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary:
 *     description: Delete a single product.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the product to delete.
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Delete a single product.
 */

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const product = await prisma.product.findUnique({
    where: { id: parseInt(params.id) },
  });

  const secret = process.env.NEXTAUTH_SECRET;
  const token = await getToken({ req: request, secret: secret });

  if (!token)
    return NextResponse.json({ error: "Not authentificated" }, { status: 401 });

  if (!product)
    return NextResponse.json({ error: "product not found" }, { status: 404 });

  const deletedUser = await prisma.product.delete({
    where: { id: product.id },
  });

  return NextResponse.json(
    { message: "Product deleted successfully" },
    {
      status: 200,
      statusText: "Product deleted successfully",
    }
  );
}
