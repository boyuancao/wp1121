import Link from "next/link";

import { Check } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { getAvatar } from "@/lib/utils";

import TimeText from "./TimeText";

type TweetProps = {
  username?: string;
  handle?: string;
  id: number;
  authorName: string;
  selectedFromDate: string | null;
  selectedToDate: string | null;
  authorHandle: string;
  content: string;
  likes: number;
  liked?: boolean;
};

// note that the Tweet component is also a server component
// all client side things are abstracted away in other components
export default function Tweet({
  username,
  handle,
  id,
  authorName,
  selectedFromDate,
  selectedToDate,
  authorHandle,
  content,
  likes,
  liked,
}: TweetProps) {

  return (
    <>
      <Link
        className="w-full px-4 pt-3 transition-colors hover:bg-gray-50"
        href={{
          pathname: `/tweet/${id}`,
          query: {
            username,
            handle,
          },
        }}
      >
        <div className="flex gap-4 mt-1 mb-1 ml-1 mr-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={getAvatar(authorName)}
            alt="avatar"
            className="h-12 w-12 rounded-full"
          />
          
          <article className="flex grow flex-col">
            <p className="font-bold ml-2">
              {content}
              <time className="ml-2 font-normal">
                <TimeText date={selectedFromDate} format="YYYY-M-D h  " />
              </time>
              ~
              <time className="ml-2 font-normal">
                <TimeText date={selectedToDate} format="YYYY-M-D h" />
              </time>
              
            </p>
            <div>
              <span className="mt-2 ml-2 font-normal text-gray-400">
                @{authorHandle}
              </span>
            </div>
            
          </article>
          {liked && <Check size={22} />}
          <div>
            參加人數{likes? likes : 0}
          </div>
        </div>
      </Link>
      <Separator />
    </>
  );
}
