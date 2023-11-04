"use client";

import { useState } from "react";
import type { EventHandler, MouseEvent } from "react";

import useLike from "@/hooks/useLike";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  handle?: string;
  initialLiked?: boolean;
  tweetId: number;
};

export default function LikeButton({
  handle,
  initialLiked,
  tweetId,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  // const [likesCount, setLikesCount] = useState(initialLikes);
  const { likeTweet, unlikeTweet, loading } = useLike();

  const handleClick: EventHandler<MouseEvent> = async (e) => {
    // since the parent node of the button is a Link, when we click on the
    // button, the Link will also be clicked, which will cause the page to
    // navigate to the tweet page, which is not what we want. So we stop the
    // event propagation and prevent the default behavior of the event.
    e.stopPropagation();
    e.preventDefault();
    if (!handle) return;
    if (liked) {
      await unlikeTweet({
        tweetId,
        userHandle: handle,
      });
      // setLikesCount((prev) => prev - 1);
      setLiked(false);
    } else {
      await likeTweet({
        tweetId,
        userHandle: handle,
      });
      // setLikesCount((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <button
      className={cn(
        "flex w-16 items-center gap-1 hover:text-brand",
        liked && "text-brand",
      )}
      onClick={handleClick}
      disabled={loading}
    >
      <div
        className={cn(
          "flex items-center gap-1 rounded-full p-3 transition-colors duration-300 hover:bg-brand/10 border border-gray-300",
          liked && "bg-green-400 text-white",
        )}
      >
        <div className="flex items-center">
          {liked ? "我已參加" : "我想參加"}
        </div>
      </div>
    </button>
  );
}
