import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  const tweetId = Number(id);

  const tweet = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
    select: {
      id: true,
    },
  });

  if (!tweet) {
    return res.json({ ok: false, error: "The Tweet doesn't exist" });
  }

  const alreadyLiked = await db.liked.findFirst({
    where: {
      userId: user?.id,
      tweetId,
    },
    select: {
      id: true,
    },
  });

  if (alreadyLiked) {
    await db.liked.delete({
      where: {
        id: alreadyLiked.id,
      },
    });
  } else {
    await db.liked.create({
      data: {
        user: {
          connect: {
            id: user?.id,
          },
        },
        tweet: {
          connect: {
            id: tweetId,
          },
        },
      },
    });
  }

  const isLiked = Boolean(alreadyLiked);

  res.json({ ok: true, isLiked });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
