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

  const tweetCount = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
    select: {
      _count: {
        select: {
          Liked: true,
          Reply: true,
        },
      },
    },
  });

  const isLiked = Boolean(
    await db.liked.findFirst({
      where: {
        userId: user?.id,
        tweetId,
      },
      select: {
        id: true,
      },
    })
  );

  res.json({ ok: true, tweetCount, isLiked });
}

export default withApiSession(
  withHandler({
    methods: ["GET"],
    handler,
  })
);
