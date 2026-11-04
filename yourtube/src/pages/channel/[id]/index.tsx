
import ChannelHeader from "@/components/ChannelHeader";
import ChannelTabs from "@/components/ChannelTabs";
import ChannelVideos from "@/components/ChannelVideos";
import VideoUploader from "@/components/VideoUploader";
import { useUser } from "@/lib/AuthContext";
import axiosInstance from "@/lib/axiosinstance";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

const Index = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useUser();

  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchChannelVideos = async () => {
    if (!id || Array.isArray(id)) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get("/video/getall");

      const allVideos = Array.isArray(res.data) ? res.data : [];

      // Show only videos uploaded by this channel.
      const channelVideos = allVideos.filter(
        (video: any) => String(video.uploader) === String(id)
      );

      setVideos(channelVideos);
    } catch (error) {
      console.error("Error fetching channel videos:", error);
      setVideos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (router.isReady && id && !Array.isArray(id)) {
      fetchChannelVideos();
    }
  }, [router.isReady, id]);

  if (!router.isReady) {
    return <div className="p-5">Loading channel...</div>;
  }

  if (!id || Array.isArray(id)) {
    return <div className="p-5">Channel not found.</div>;
  }

  return (
    <div className="flex-1 min-h-screen bg-white">
      <div className="max-w-full mx-auto">
        <ChannelHeader channel={user} user={user} />

        <ChannelTabs />

        <div className="px-4 pb-8">
          <VideoUploader
            channelId={id}
            channelName={user?.channelname || user?.name || ""}
            onUploadSuccess={fetchChannelVideos}
          />
        </div>

        <div className="px-4 pb-8">
          {loading ? (
            <p className="py-8 text-center">Loading videos...</p>
          ) : (
            <ChannelVideos videos={videos} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
