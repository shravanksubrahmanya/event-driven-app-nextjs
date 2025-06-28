import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { forbidden } from "next/navigation";
import { messageInRaw } from "svix";

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  try {
    const todoId = params.id;
    const todo = await prisma.todo.findUnique({ where: { id: todoId } });
    if (!todo) {
      return NextResponse.json({ error: "Todo not found" }, { status: 401 });
    }

    if (todo.userId != userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.todo.delete({ where: { id: todoId } });

    return NextResponse.json(
      { message: "Todo deleted Successfully" },
      { status: 403 }
    );
  } catch (error) {
    console.error("Error updating subscription", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
