import CreatePost from "@/components/posts/CreatePost";
import CreateReel from "@/components/reels/createReel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader} from "@/components/ui/dialog";
import React, { useState } from "react";

const CreateDialog = ({ open, setOpen }) => {
  const [isReel, setIsReel] = useState(false);
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        
        <DialogHeader className="space-y-1.5 text-center font-semibold text-lg sm:text-left">
          {isReel ? "Create new Reel" : "Create new Post"}
        </DialogHeader>
        <div className="flex gap-2">
          <Button
            variant={!isReel ? "default" : "outline"}
            onClick={() => setIsReel(false)}
          >
            Post
          </Button>
          <Button
            variant={isReel ? "default" : "outline"}
            onClick={() => setIsReel(true)}
          >
            Reel
          </Button>
        </div>

          {isReel ? (
            <CreateReel open={open} setOpen={setOpen} />
          ): (
            <CreatePost open={open} setOpen={setOpen} />
          )}

      </DialogContent>
    </Dialog>
  );
};

export default CreateDialog;
