import { LinearGradient } from 'expo-linear-gradient';
import { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View, type DimensionValue } from 'react-native';
import Animated, { Easing, cancelAnimation, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

import { Radius } from '@/constants/theme';
import { useResolvedThemeName } from '@/hooks/use-theme';

// Neutral (not brand-teal) placeholder tones — a skeleton reads as "this
// spot is empty" regardless of theme, the same gray-on-gray language
// every platform uses, rather than tinting the whole loading screen teal.
const TONES = {
  light: { base: 'rgba(15, 23, 42, 0.07)', sheen: 'rgba(15, 23, 42, 0.13)' },
  dark: { base: 'rgba(255, 255, 255, 0.07)', sheen: 'rgba(255, 255, 255, 0.15)' },
};

/**
 * A placeholder block the size/shape of the real content it's standing in
 * for, with a soft band sweeping left-to-right on a loop — the shimmer
 * every loading state in this app should use instead of a spinner. Sized
 * with plain `width`/`height` (numbers or percentages both work; the
 * sweep measures its own rendered width via onLayout so it's correct
 * either way).
 */
export function Skeleton({
  width = '100%',
  height,
  radius = Radius.sm,
  style,
}: {
  width?: DimensionValue;
  height: number;
  radius?: number;
  style?: object;
}) {
  const tone = TONES[useResolvedThemeName()];
  const [measuredWidth, setMeasuredWidth] = useState(0);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.linear }), -1, false);
    return () => cancelAnimation(progress);
  }, [progress]);

  const bandWidth = Math.max(measuredWidth * 0.6, 48);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -bandWidth + progress.value * (measuredWidth + bandWidth * 2) }],
  }));

  function onLayout(e: LayoutChangeEvent) {
    setMeasuredWidth(e.nativeEvent.layout.width);
  }

  return (
    <View
      onLayout={onLayout}
      style={[{ width, height, borderRadius: radius, backgroundColor: tone.base, overflow: 'hidden' }, style]}>
      {measuredWidth > 0 && (
        <Animated.View style={[styles.band, { width: bandWidth }, animatedStyle]}>
          <LinearGradient
            colors={['transparent', tone.sheen, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  band: {
    position: 'absolute',
    top: 0,
    bottom: 0,
  },
});
