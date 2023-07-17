import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const currentUser = await db.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      id: true,
      auth: true,
    },
  });

  if (!currentUser) {
    return res.json({ ok: false, error: "This user doesn't exist." });
  }

  await db.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      auth: false,
    },
  });

  req.session.user = {
    id: currentUser.id,
    auth: false,
  };

  req.session.destroy();

  return res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
