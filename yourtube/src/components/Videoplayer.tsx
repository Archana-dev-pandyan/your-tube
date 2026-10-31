
import { useRef } from "react";

interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    filepath: string;
  };
}

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export default function VideoPlayer({ video }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const videoPath = video?.filepath?.replace(/\\/g, "/");
  const videoUrl = videoPath
    ? `${BACKEND_URL}/${videoPath}`
    : "";

  return (
    <div className="aspect-video bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        key={videoUrl}
        className="w-full h-full"
        controls
        playsInline
        preload="metadata"
        poster="/placeholder.svg"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
