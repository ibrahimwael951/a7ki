"use client";
import { Bookmark } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import { toast } from "sonner";
import axios from "axios";

const SaveBtn = ({
  thoughtId,
  Saved,
}: {
  thoughtId: string;
  Saved?: boolean;
}) => {
  const [isSaved, setIsSaved] = useState(Saved || false);
  const [loading, setLoading] = useState(false);
  const handleSave = () => {
    setLoading(true);
    try {
      axios.post(`/api/thought/${thoughtId}/save`);
      setIsSaved(!isSaved);
      toast.success(
        isSaved ? "Thought Removed from Saves!" : "Thought Added to Saves!",
      );
    } catch (error) {
      toast.error(
        isSaved
          ? "Failed to remove thought from saves."
          : "Failed to save thought.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      disabled={loading}
      size={"sm"}
      onClick={handleSave}
      className="h-10"
    >
      <Bookmark
        size={50}
        className={`${
          isSaved ? "fill-current text-yellow-500" : "text-muted-foreground"
        } 
        mx-auto
        `}
      />
    </Button>
  );
};

export default SaveBtn;
