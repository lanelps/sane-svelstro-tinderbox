<script lang="ts">
  import { onMount } from "svelte";
  import Hls from "hls.js";
  import type { MuxVideo } from "@/types";

  interface Props {
    video: MuxVideo;
    class?: string;
  }

  const { video, class: className }: Props = $props();

  const playbackId = $derived(video.asset?.playbackId);

  // `mux.video` has no poster field. Mux serves a thumbnail for every playback ID.
  const placeholder = $derived(
    playbackId
      ? `https://image.mux.com/${playbackId}/thumbnail.webp?width=1920&fit_mode=preserve`
      : ""
  );

  let videoElement = $state<HTMLVideoElement>();
  let videoLoaded = $state(false);

  /**
   * @name onMount
   * @function
   * @description Initializes HLS playback on mount. Uses hls.js first and native HLS only as the fallback: desktop Chrome answers "maybe" to the native HLS check and then fails with MEDIA_ERR_SRC_NOT_SUPPORTED. Skips autoplay when the visitor prefers reduced motion, and destroys hls.js on unmount.
   * @returns {(() => void) | undefined} The cleanup function.
   */
  onMount(() => {
    if (!videoElement || !playbackId) return;

    const videoSrc = `https://stream.mux.com/${playbackId}.m3u8`;
    let hls: Hls | undefined;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(videoElement);
    } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = videoSrc;
    } else {
      console.error("This browser does not support HLS.");
      return;
    }

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoElement.controls = true;
    } else {
      void videoElement.play().catch(() => {});
    }

    return () => {
      videoElement?.pause();
      hls?.destroy();
    };
  });

  /**
   * @name handleVideoLoaded
   * @function
   * @description Callback fired when the video's data has loaded. Sets `videoLoaded` to true, triggering the placeholder fade-out.
   * @returns {void}
   */
  const handleVideoLoaded = () => {
    videoLoaded = true;
  };
</script>

<figure class={["relative aspect-video bg-gray-200", className]}>
  <video
    bind:this={videoElement}
    data-playback-id={playbackId}
    muted
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
