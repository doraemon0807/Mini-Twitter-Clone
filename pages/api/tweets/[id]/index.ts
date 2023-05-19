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
      query: { id },
    } = req;

    const tweetId = Number(id);

    const tweet = await db.tweet.findUnique({
      where: {
        id: tweetId,
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
        reply: {
          select: {
            answer: true,
            id: true,
            createdAt: true,
            user: {
              select: {
                id: true,
                name: true,
                username: true,
                avatarColor: true,
              },
            },
          },
          take: 10,
        },
        _count: {
          select: {
            liked: true,
            reply: true,
          },
        },
      },
    });

    res.json({ ok: true, tweet });
  }

  if (req.method === "POST") {
    const {
      query: { id },
      body: {description}
    } = req;

    const tweetId = Number(id);

    const tweet = await db.tweet.findUnique({
      where:{
        id: tweetId,
      },
      select:{
        id: true
      }
    })

    if (!tweet) return res.json({ok: false, error: "This tweet doesn't exist"})

    await db.tweet.update({
      where:{
        id: tweetId,
      },
      data:{
        description
      }
    })

    res.json({ ok: true, tweet });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
  })
);
