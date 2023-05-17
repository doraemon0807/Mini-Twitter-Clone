import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { answer },
    session: { user },
    query: { id },
  } = req;

  const tweetId = Number(id);

  const tweet = await db.tweet.findUnique({
    where: {
      id: tweetId,
    },
  });

  if (!tweet) {
    return res.json({ ok: false, error: "The tweet doesn't exist." });
  }

  const reply = await db.reply.create({
    data: {
      answer,
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

  res.json({ ok: true, reply });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
  })
);
