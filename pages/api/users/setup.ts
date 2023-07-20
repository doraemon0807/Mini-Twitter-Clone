import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    body: { name, username, description, avatarColor },
    session: { user },
  } = req;

  const currentUser = await db.user.findUnique({
    where: {
      id: user?.id,
    },
    select: {
      id: true,
    },
  });

  if (!currentUser) {
    return res.json({ ok: false, error: "This user doesn't exist." });
  }

  const usernameAlreadyExist = Boolean(
    await db.user.findUnique({
      where: {
        username,
      },
    })
  );

  if (usernameAlreadyExist) {
    return res.json({ ok: false, error: "This username is already taken." });
  }

  const newUser = await db.user.update({
    where: {
      id: currentUser.id,
    },
    data: {
      name,
      username,
      description,
      avatarColor,
      setup: true,
    },
  });

  // req.session.user = {
  //   id: currentUser.id,
  //   setup: newUser.setup || true,
  //   auth: true,
  // };

  req.session.user = {
    id: currentUser.id,
    setup: newUser.setup || true,
  };

  await req.session.save();

  res.json({ ok: true });
}

export default withApiSession(
  withHandler({
    methods: ["POST"],
    handler,
    isPrivate: false,
  })
);
