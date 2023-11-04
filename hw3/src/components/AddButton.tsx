"use client";

import { useState } from "react";
import TweetInput from "@/components/TweetInput";


export default function ProfileButton() {
  const [newListDialogOpen, setNewListDialogOpen] = useState(false);

  const handleAddClick = () => {

    setNewListDialogOpen(true)
  }
    
  return (
    <div>
        <button
            className="flex items-center gap-2 rounded-full p-3 text-start transition-colors duration-300 hover:bg-gray-200 border"
            onClick={handleAddClick}
        >
        Add
        </button>
        <TweetInput
            // last_id={last.last_id}
            // liked={last.liked}
            // likes={last.likes}
            open={newListDialogOpen}
            onClose={() => setNewListDialogOpen(false)}
        />
    </div>
  );
}
