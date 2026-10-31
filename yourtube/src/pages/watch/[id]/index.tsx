
import Comments from "@/components/Comments";
import RelatedVideos from "@/components/RelatedVideos";
import VideoInfo from "@/components/VideoInfo";
import Videoplayer from "@/components/Videoplayer";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [allVideos, setAllVideos] = useState<any[]>([]);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const fetchVideo = async () => {
      try {
        const res = await axiosInstance.get("/video/getall");

        const fetchedVideos = Array.isArray(res.data) ? res.data : [];

        setAllVideos(fetchedVideos);

        const selectedVideo = fetchedVideos.find(
          (vid: any) => vid._id === id
        );

        setCurrentVideo(selectedVideo || null);
      } catch (error) {
        console.error("Error fetching video:", error);
        setCurrentVideo(null);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [router.isReady, id]);

  if (loading) {
    return <div>Loading video...</div>;
  }

  if (!currentVideo) {
    return <div>Video not found.</div>;
  }

  const relatedVideos = allVideos.filter(
    (vid) => vid._id !== currentVideo._id
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <Videoplayer video={currentVideo} />

            <VideoInfo video={currentVideo} />

            <Comments videoId={currentVideo._id} />
          </div>

          <div className="space-y-4">
            <RelatedVideos videos={relatedVideos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchPage;
