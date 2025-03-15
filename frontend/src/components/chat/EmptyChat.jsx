import { Button } from "../ui/button";
import { FaFacebookMessenger } from "react-icons/fa";

export default function EmptyMessages() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4  bg-black p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white">
        <FaFacebookMessenger className="h-8 w-8 text-white" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-white">Your messages</h2>
        <p className="text-sm text-white/70">Send a message to start a chat.</p>
      </div>
      <Button className="mt-4 bg-blue-500 hover:bg-blue-600">
        Send message
      </Button>
    </div>
  );
}
