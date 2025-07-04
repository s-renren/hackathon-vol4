"use server";

import { createClient } from "@/utils/supabase/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function waitingRoom({ roomId }: { roomId: string }) {
  try {
    if (!roomId) {
      throw new Error("roomId が未定義です。");
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error("認証が必要です");
    }

    const roomWithParticipant = await prisma.room.findUnique({
      where: { id: roomId },
      include: { RoomParticipant: true },
    });
    if (!roomWithParticipant) {
      return { success: false, error: "ルームが見つかりません。" };
    }
    if (
      roomWithParticipant.RoomParticipant.some(
        (participant) => participant.userId === user.id
      )
    ) {
      return { success: true, room: roomWithParticipant };
    }

    if (
      roomWithParticipant.RoomParticipant.length >= roomWithParticipant.maxUser
    ) {
      return { success: false, error: "ルームが満員です。" };
    }

    await prisma.roomParticipant.create({
      data: { roomId, userId: user.id, isHost: false },
    });

    const updatedRoom = await prisma.room.findUnique({
      where: { id: roomId },
      include: { RoomParticipant: true },
    });
    if (!updatedRoom) {
      return { success: false, error: "ルーム情報の取得に失敗しました。" };
    }

    return { success: true, room: updatedRoom };
  } catch (error) {
    console.error("Waiting room error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "ルームへの参加に失敗しました",
    };
  }
}
