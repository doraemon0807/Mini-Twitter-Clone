import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const profile = await db.user.findUnique({
      where: {
        id: req.session.user?.id,
      },
    });

    if (!profile) {
      return res.json({ ok: false });
    }
    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    const {
      body: { name, username, description, avatarColor },
      session: { user },
    } = req;

    const currentUser = await db.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (!currentUser)
      return res.json({ ok: false, error: "This user doesn't exist." });

    const usernameAlreadyExist = await db.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
      },
    });
    if (usernameAlreadyExist && usernameAlreadyExist.id !== currentUser.id) {
      return res.json({ ok: false, error: "This username is already taken." });
    }

    await db.user.update({
      where: {
        id: user?.id,
      },
      data: {
        username,
        name,
        description,
        avatarColor,
      },
    });

    return res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({
    methods: ["GET", "POST"],
    handler,
    isPrivate: false,
  })
);
