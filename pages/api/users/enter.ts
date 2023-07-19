import db from "@/lib/db";
import withHandler, { ResponseType } from "@/lib/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import { withApiSession } from "@/lib/withSession";
import { randColor, randomColorPicker } from "@/lib/utils";
// import twilio from "twilio";
// import mail from "@emailjs/nodejs";

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

interface LoginProps {
  phone?: string;
  email?: string;
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email }: LoginProps = req.body;
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
            auth: false,
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

  // if (phone) {
  //   // Send token to phone number
  //   const message = await twilioClient.messages.create({
  //     messagingServiceSid: process.env.TWILIO_MSID,
  //     to: phone,
  //     from: process.env.TWILIO_PHONE,
  //     body: `Your verification code is ${payload}.`,
  //   });
  //   console.log(message);
  // } else if (email) {
  //   // Send token to email
  //   const email = await mail.send(
  //     process.env.EMALIJS_SID!,
  //     process.env.EMALIJS_TEMPID!,
  //     {
  //       to_name: req.body.email,
  //       from_name: "Mini-Twitter Team",
  //       subject: "Mini-Twitter Verification Code",
  //       html: `<strong>Your verification code is ${payload}.</strong>`,
  //     },
  //     {
  //       publicKey: process.env.EMAILJS_PUBKEY!,
  //       privateKey: process.env.EMALJS_PRIVATEKEY!,
  //     }
  //   );
  //   console.log(email);
  // }

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
