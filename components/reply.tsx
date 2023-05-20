import Avatar from "@/components/avatar";
import Confirmation from "@/components/confirmation";
import { createdAgo } from "@/lib/timeConvert";
import useUser from "@/lib/useUser";
import { Reply, User } from "@prisma/client";
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { Tooltip } from "react-tooltip";

interface ReplyWithUser extends Reply {
  user: User;
}

interface ReplyProp {
  reply: ReplyWithUser;
  setReplyId: Dispatch<SetStateAction<string>>;
  handleDeleteReply: () => void;
}

export default function ReplyObject({
  reply,
  handleDeleteReply,
  setReplyId,
}: ReplyProp) {
  const { user } = useUser();
  const [deleteConfirm, setDeleteConfirm] = useState(false);

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
      {reply.user.id === user?.id ? (
        <div className="relative text-gray-400">
          <button
            data-tooltip-id="deleteReply"
            data-tooltip-content="Delete this Reply"
            className="rounded-lg border border-white p-1 hover:border-gray-200 hover:text-green-500 hover:shadow-sm"
            onClick={() => {
              setReplyId(String(reply.id));
              setDeleteConfirm(true);
            }}
          >
            <svg
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>

          <Tooltip id="deleteReply" delayShow={300} className="tooltip" />
          {deleteConfirm ? (
            <Confirmation
              text="Are you sure you want to delete this reply?"
              button1="Delete"
              button2="Cancel"
              onClick1={handleDeleteReply}
              onClick2={() => setDeleteConfirm(false)}
            />
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
