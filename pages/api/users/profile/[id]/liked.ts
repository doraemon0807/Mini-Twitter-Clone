import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { id, page },
    } = req;

    const profileId = Number(id);

    const profile = await db.user.findUnique({
      where: {
        id: profileId,
      },
    });

    if (!profile) {
      return res.json({ ok: false, error: "This user doesn't exist." });
    }

    const offset = 5;

    const liked = await db.liked.findMany({
      take: offset,
      skip: (Number(page) - 1) * offset,
      where: {
        userId: profile.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatarColor: true,
          },
        },
        tweet: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarColor: true,
              },
            },
            _count: {
              select: {
                liked: true,
                reply: true,
              },
            },
          },
        },
      },
    });

    res.json({
      ok: true,
      liked,
    });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);
