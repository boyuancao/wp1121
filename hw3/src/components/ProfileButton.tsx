"use client";

import { useRouter } from "next/navigation";

export default function ProfileButton() {
  const router = useRouter();

  return (
    <button
      className="flex items-center gap-2 rounded-full p-3 text-start transition-colors duration-300 hover:bg-gray-200 border"
      // go to home page without any query params to allow the user to change their username and handle
      // see src/components/NameDialog.tsx for more details
      onClick={() => router.push("/")}
    >
      <div>切換使用者</div>
    </button>
  );
}
