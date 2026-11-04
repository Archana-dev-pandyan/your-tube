"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosinstance";
import { useUser } from "@/lib/AuthContext";

export default function HistoryContent() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      loadHistory();
    } else {
      setHistory([]);
      setLoading(false);
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const historyData = await axiosInstance.get(
        `/history/${user._id}`
      );

      setHistory(
        Array.isArray(historyData.data) ? historyData.data : []
      );
    } catch (error) {
      console.error("Error loading history:", error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      console.log("Removing from history:", historyId);

      setHistory((prevHistory) =>
        prevHistory.filter((item) => item._id !== historyId)
      );
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  };

  if (loading) {
    return <div>Loading history...</div>;
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />

        <h2 className="text-xl font-semibold mb-2">
          Keep track of what you watch
        </h2>

        <p className="text-gray-600">
          Watch history isn't viewable when signed out.
        </p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />

        <h2 className="text-xl font-semibold mb-2">
          No watch history yet
        </h2>

        <p className="text-gray-600">
          Videos you watch will appear here.
        </p>
      </div>
    );
  }

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:5000";

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          {history.length} videos
        </p>
      </div>

      <div className="space-y-4">
        {history.map((item) => {
          const video = item.videoid;

          if (!video || typeof video !== "object") {
            return null;
          }

          const videoPath = video.filepath?.replace(/\\/g, "/");

          const videoUrl = videoPath
            ? `${BACKEND_URL}/${videoPath}`
            : "";

          return (
            <div key={item._id} className="flex gap-4 group">
              <Link
                href={`/watch/${video._id}`}
                className="flex-shrink-0"
              >
                <div className="relative w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                  {videoUrl && (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      preload="metadata"
                      muted
                    />
                  )}
                </div>
              </Link>

              <div className="flex-1 min-w-0">
                <Link href={`/watch/${video._id}`}>
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 mb-1">
                    {video.videotitle || "Untitled video"}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600">
                  {video.videochanel || "Unknown channel"}
                </p>

                <p className="text-sm text-gray-600">
                  {(video.views || 0).toLocaleString()} views
                  {video.createdAt && (
                    <>
                      {" • "}
                      {formatDistanceToNow(
                        new Date(video.createdAt)
                      )} ago
                    </>
                  )}
                </p>

                {item.createdAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Added{" "}
                    {formatDistanceToNow(
                      new Date(item.createdAt)
                    )} ago
                  </p>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() =>
                      handleRemoveFromHistory(item._id)
                    }
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove from watch history
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}
      </div>
    </div>
  );
}