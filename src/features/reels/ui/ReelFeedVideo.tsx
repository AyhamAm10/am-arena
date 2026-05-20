import type { AVPlaybackStatus } from "expo-av";
import { ResizeMode, Video } from "expo-av";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, View } from "react-native";
import Svg, { Path } from "react-native-svg";
import { styles } from "../styles";
import { colors_V2 } from "@/src/theme/colors";

type ReelFeedVideoProps = {
  uri: string;
  isActive: boolean;
  screenFocused: boolean;
  onPlaybackTick: (isActiveRow: boolean, status: AVPlaybackStatus) => void;
};

export function ReelFeedVideo({
  uri,
  isActive,
  screenFocused,
  onPlaybackTick,
}: ReelFeedVideoProps) {
  const ref = useRef<InstanceType<typeof Video> | null>(null);
  const prevActiveRef = useRef(false);
  const pendingSeekFromEnterRef = useRef(false);
  const [userPaused, setUserPaused] = useState(false);
  const isActiveRef = useRef(isActive);
  const screenFocusedRef = useRef(screenFocused);
  isActiveRef.current = isActive;
  screenFocusedRef.current = screenFocused;

  const wantsPlay = isActive && screenFocused && !userPaused;

  const applyEnterPlayback = useCallback(async () => {
    const video = ref.current;
    if (!video) return;
    try {
      await video.setPositionAsync(0);
      await video.setIsMutedAsync(false);
      await video.playAsync();
    } catch {
      /* race */
    }
  }, []);

  useEffect(() => {
    void (async () => {
      const video = ref.current;
      if (!video) return;
      try {
        if (!screenFocused || !isActive) {
          pendingSeekFromEnterRef.current = false;
          await video.pauseAsync();
          await video.setIsMutedAsync(true);
          if (!isActive) prevActiveRef.current = false;
          return;
        }

        if (!prevActiveRef.current) {
          setUserPaused(false);
          prevActiveRef.current = true;
          const status = await video.getStatusAsync();
          if (status.isLoaded) {
            await applyEnterPlayback();
          } else {
            pendingSeekFromEnterRef.current = true;
          }
          return;
        }

        if (userPaused) {
          await video.pauseAsync();
          return;
        }

        await video.setIsMutedAsync(false);
        await video.playAsync();
      } catch {
        /* unload / swap race */
      }
    })();
  }, [applyEnterPlayback, isActive, screenFocused, uri, userPaused]);

  const onVideoPress = useCallback(() => {
    if (!isActiveRef.current || !screenFocusedRef.current) return;
    setUserPaused((paused) => !paused);
  }, []);

  const onVideoLoad = useCallback(
    (status: AVPlaybackStatus) => {
      if (!pendingSeekFromEnterRef.current || !status.isLoaded) return;
      pendingSeekFromEnterRef.current = false;
      if (!isActiveRef.current || !screenFocusedRef.current) return;
      void applyEnterPlayback();
    },
    [applyEnterPlayback]
  );

  return (
    <View style={styles.videoPlayerStack}>
      <Video
        ref={ref}
        source={{ uri }}
        style={styles.video}
        resizeMode={ResizeMode.COVER}
        isLooping
        shouldPlay={wantsPlay}
        isMuted={!wantsPlay}
        volume={1}
        useNativeControls={false}
        progressUpdateIntervalMillis={100}
        onLoad={onVideoLoad}
        onPlaybackStatusUpdate={(status) => onPlaybackTick(isActive, status)}
      />
      {userPaused && isActive && screenFocused ? (
        <Pressable
          style={styles.playOverlay}
          onPress={onVideoPress}
          accessibilityRole="button"
          accessibilityLabel="تشغيل الفيديو"
        >
          <View style={styles.playIconWrap}>
            <Svg width={42} height={42} viewBox="0 0 24 24" fill="none">
              <Path d="M9 7.5v9l8-4.5-8-4.5z" fill={colors_V2.textPrimary} />
            </Svg>
          </View>
        </Pressable>
      ) : null}
      <Pressable
        style={styles.videoTapLayer}
        onPress={onVideoPress}
        accessibilityRole="button"
        accessibilityLabel="تشغيل أو إيقاف الفيديو"
      />
    </View>
  );
}