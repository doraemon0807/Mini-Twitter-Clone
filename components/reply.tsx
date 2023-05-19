import Avatar from "@/components/avatar";
import { createdAgo } from "@/lib/timeConvert";
import { Reply, User } from "@prisma/client";
import Link from "next/link";

interface ReplyWithUser extends Reply {
  user: User;
}

interface ReplyProp {
  reply: ReplyWithUser;
}

export default function ReplyObject({ reply }: ReplyProp) {
  return (
    <div
      key={reply.id}
      className="flex justify-between rounded-lg border p-3 shadow-sm"
    >
      <div className="flex items-start space-x-3">
        <Link href={`/profile/${reply.user.id}`}>
          <Avatar size="small" color={reply.user.avatarColor} />
        </Link>
        <div className="flex flex-col">
          <div className="flex items-center space-x-1">
            <Link
              href={`/profile/${reply.user.id}`}
              className="block text-sm font-medium text-gray-700"
            >
              {reply.user.name}
            </Link>
            <Link
              href={`/profile/${reply.user.id}`}
              className="text-sm text-gray-500"
            >
              @{reply.user.username}
            </Link>
            <span className="text-sm text-gray-500">·</span>
            <span className="text-xs text-gray-500">
              {createdAgo(reply.createdAt)}
            </span>
          </div>
          <p className="mt-2 text-gray-700">{reply.answer}</p>
        </div>
      </div>
      <div>Delete</div>
    </div>
  );
}
