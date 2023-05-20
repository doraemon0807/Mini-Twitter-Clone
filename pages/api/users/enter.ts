import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";
import { randColor, randomColorPicker } from "@/lib/utils";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const token = await db.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            avatarColor: randomColorPicker(randColor),
            setup: false,
            ...user,
          },
        },
      },
    },
  });

  const foundToken = await db.token.count({
    where: {
      userId: token.userId,
    },
  });

  if (foundToken > 1) {
    await db.token.deleteMany({
      where: {
        userId: token.userId,
        NOT: {
          createdAt: token.createdAt,
        },
      },
    });
  }

  return res.json({
    ok: true,
    token,
  });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
