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
      query: { page },
    } = req;

    const offset = 10;

    const tweets = await db.tweet.findMany({
      take: offset,
      skip: (Number(page) - 1) * offset,
      orderBy: [
        {
          createdAt: "desc",
        },
        {
          id: "desc",
        },
      ],
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
    });

    const tweetCount = await db.tweet.count();

    res.json({
      ok: true,
      tweets,
      totalPage: Math.ceil(tweetCount / offset),
    });
  }

  if (req.method === "POST") {
    const {
      body: { description },
      session: { user },
    } = req;

    const tweet = await db.tweet.create({
      data: {
        description,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
    });

    res.json({ ok: true, tweet });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);
