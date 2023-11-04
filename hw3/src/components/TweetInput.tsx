"use client";

import { useRef, useState } from "react";

import { ChevronDown } from "lucide-react";

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import GrowingTextarea from "@/components/GrowingTextarea";
import UserAvatar from "@/components/UserAvatar";
import { Separator } from "@/components/ui/separator";
import useTweet from "@/hooks/useTweet";
// import useLike from "@/hooks/useLike";
import useUserInfo from "@/hooks/useUserInfo";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

type NewListDialogProps = {
  // last_id: number;
  // liked: boolean;
  // likes: number;
  open: boolean;
  onClose: () => void;
};

export default function TweetInput({ open, onClose }: NewListDialogProps) {
  const { handle } = useUserInfo();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { postTweet, loading } = useTweet();
  const [selectedFromDate_, setSelectedFromDate] = useState<Date | null>(null);
  const [selectedToDate_, setSelectedToDate] = useState<Date | null>(null);
  // const [liked_, setLiked] = useState(liked);
  // const [likesCount, setLikesCount] = useState(likes);
  // const { likeTweet } = useLike();

  const handleFromDateChange = (date: Date | null) => {

    setSelectedFromDate(date);
  };

  const handleToDateChange = (date: Date | null) => {

    setSelectedToDate(date);
  };

  const handleTweet = async () => {
    const content = textareaRef.current?.value;
    if (!content) return;
    if (!handle) return;

    if(!selectedFromDate_) return;
    if(!selectedToDate_) return;
    if(selectedFromDate_ >= selectedToDate_){
      alert("開始時間早於結束時間");
      return;
    }
    
    const timeDifference = Math.abs(selectedToDate_.getTime() - selectedFromDate_.getTime());

  // 将毫秒差转换为天数
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

    // 检查天数差是否小于等于 7
    if (daysDifference > 7) {
      alert("開始與結束時間相差最多 7 天");
      return;
    }

    const selectedFromDate = selectedFromDate_.toDateString();
    const selectedToDate = selectedToDate_.toDateString();

    try {
      await postTweet({
        handle,
        content,
        selectedFromDate,
        selectedToDate,
      });

      // const tweetId = last_id;

      // console.log("哈哈", tweetId);

      // await likeTweet({
      //   tweetId,
      //   userHandle: handle,
      // });
      // setLikesCount((prev) => prev + 1);
      // setLiked(true);
      
      textareaRef.current.value = "";
      // this triggers the onInput event on the growing textarea
      // thus triggering the resize
      // for more info, see: https://developer.mozilla.org/en-US/docs/Web/API/Event
      textareaRef.current.dispatchEvent(
        new Event("input", { bubbles: true, composed: true }),
      );
    } catch (e) {
      console.error(e);
      alert("Error posting tweet");
    } finally {

      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <div className="flex gap-4" onClick={() => textareaRef.current?.focus()}>
          <UserAvatar className="h-12 w-12" />
          <div className="flex w-full flex-col px-2">
            <button className="flex w-fit items-center rounded-full border-[1px] border-gray-300 px-2 text-sm font-bold text-brand">
              Everyone
              <ChevronDown size={16} className="text-gray-300" />
            </button>
            <div className="mb-2 mt-6">
              <GrowingTextarea
                ref={textareaRef}
                wrapperClassName="col-start-2 row-start-2"
                className="bg-transparent text-xl outline-none placeholder:text-gray-500"
                placeholder="標題"
              />
              <div className="flex w-full flex-col">
                <div>
                  <h1>From</h1>
                  <DatePicker selected={selectedFromDate_} onChange={handleFromDateChange} className="border border-black rounded-md" />
                </div>
                <div>
                  <h1>To</h1>
                  <DatePicker selected={selectedToDate_} onChange={handleToDateChange} className="border border-black rounded-md" />
                </div>
              </div>
            </div>
            
            <Separator />
            <div className="flex justify-end">
              <button
                className={cn(
                  "my-2 rounded-full bg-brand px-4 py-2 text-white transition-colors hover:bg-brand/70",
                  "disabled:cursor-not-allowed disabled:bg-brand/40 disabled:hover:bg-brand/40",
                )}
                onClick={handleTweet}
                disabled={loading}
              >
                新增
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
