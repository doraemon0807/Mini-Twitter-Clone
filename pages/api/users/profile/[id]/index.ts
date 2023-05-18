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
      session: { user },
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

    const myProfile = Boolean(profileId === user?.id);

    res.json({
      ok: true,
      profile,
      myProfile,
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
