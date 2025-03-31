<script lang="ts">
  import { onMount } from "svelte";
  import Hls from "hls.js";
  import { urlFor } from "@sanity/lib/image";
  import type { MuxVideo } from "@/types";

  interface Props {
    video: MuxVideo;
    class?: string;
  }

  const { video, class: className }: Props = $props();

  const placeholder = $derived(
    video.poster.asset
      ? urlFor(video.poster, { quality: 50 }).width(16).url()
      : ""
  );

  let videoElement = $state<HTMLVideoElement>();
  let videoLoaded = $state(false);

  onMount(() => {
    if (!videoElement) return;

    const playbackId = video.asset.playbackId;
    const videoSrc = `https://stream.mux.com/${playbackId}.m3u8`;

    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = videoSrc;
    } else if (Hls.isSupported()) {
      var hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoElement);
    } else {
      console.error("This browser does not support HLS.");
    }
  });

  const handleVideoLoaded = () => {
    videoLoaded = true;
  };
</script>

<figure class="relative aspect-video bg-gray-200" class:class={className}>
  <video
    bind:this={videoElement}
    data-playback-id={video.asset.playbackId}
    muted
    autoplay
    playsinline
    loop
    class="absolute inset-0 z-10 h-full w-full object-cover"
    onloadeddata={handleVideoLoaded}
  ></video>
  <img
    class={[
      "pointer-events-none absolute inset-0 top-0 left-0 block h-full w-full object-cover transition-opacity",
      videoLoaded ? "opacity-0" : "opacity-100",
    ]}
    src={placeholder}
    alt=""
    aria-hidden="true"
    role="presentation"
    loading="eager"
  />
</figure>
