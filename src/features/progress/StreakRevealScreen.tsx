import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

// The same liquid-fill "brain" idea as the web app's real StudyStreak
// popover (studium-website's components/dashboard-shell.tsx BrainIcon) —
// same Lucide brain silhouette (two closed hemisphere paths, not the
// usual multi-stroke line art, since a fill needs one solid enclosed
// shape) and the same amber-while-building → secured-once-the-goal-is-hit
// color swap, keyed to today's real KP/target ratio. The web drives an
// SVG clip-rect directly; that specific technique (an animated
// react-native-svg Rect's props driving a <ClipPath>) turned out not to
// repaint reliably here, so the reveal is a plain RN View instead: a
// fixed, always-visible outline, plus a full-color copy of the same
// brain sitting behind an overflow:hidden wrapper whose HEIGHT animates
// from 0 to full — the standard, reliable RN way to "reveal from the
// bottom up," same visual result as the web's clip-rect.
const BRAIN_PATH =
  'M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z';
const CHECK_PATH = 'M7.7 12 L10.8 15.1 L16.6 8.6';
const BUILDING_FILL = '#F59E0B'; // amber — pops against the teal ground, same role the web's amber fill plays against its own white surface
const SECURED_FILL = '#ECFEFF'; // a pale mint, not the web's brand teal — that color IS this screen's background now, so "secured" needs contrast the other way

function BrainFill({ percent, secured, size }: { percent: number; secured: boolean; size: number }) {
  const fillHeight = useSharedValue(0);

  useEffect(() => {
    fillHeight.value = withTiming((percent / 100) * size, { duration: 900, easing: Easing.out(Easing.cubic) });
  }, [percent, size, fillHeight]);

  const maskStyle = useAnimatedStyle(() => ({ height: fillHeight.value }));
  const fillColor = secured ? SECURED_FILL : BUILDING_FILL;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} viewBox="0 0 24 24" style={StyleSheet.absoluteFill}>
        <Path d={BRAIN_PATH} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth={1.3} strokeLinejoin="round" />
      </Svg>

      <Animated.View style={[styles.fillMask, maskStyle]}>
        <Svg width={size} height={size} viewBox="0 0 24 24" style={styles.fillMaskInner}>
          <Path d={BRAIN_PATH} fill={fillColor} />
        </Svg>
      </Animated.View>

      {secured && (
        <Svg width={size} height={size} viewBox="0 0 24 24" style={StyleSheet.absoluteFill}>
          <Path d={CHECK_PATH} fill="none" stroke="#0B6467" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
        </Svg>
      )}
    </View>
  );
}

// Tapping the header's streak pill used to jump straight to /progress with
// no transition. Now it plays this short reveal first — the real brain
// fills to today's real KP/target ratio while the KP number counts up to
// match — and only then hands off to Progress, replacing itself in the
// stack so the back gesture from Progress returns straight to Home, not
// back through this screen. Tapping anywhere skips straight there for
// anyone who doesn't want to wait it out.
//
// No screen-level entrance/exit animation here on purpose (an earlier
// circular wipe was tried and cut per feedback) — the reveal is just the
// individual elements' own fade/zoom-ins below, and the hand-off to
// Progress is instant, not gated behind an exit animation finishing.
// Progress itself is warmed well before that hand-off ever happens: both
// the route prefetch and the real planner fetch fire the moment the
// streak pill is tapped, on Home, before this screen even mounts — see
// features/dashboard/DashboardScreen.tsx's goToStreakReveal — so by the
// time either the timer below or a tap ends this screen, Progress has
// had this whole animation's worth of head start to be ready.
const AUTO_ADVANCE_MS = 2400;
const COUNT_UP_MS = 900;

export function StreakRevealScreen({
  streakDays,
  todayKP,
  targetKP,
}: {
  streakDays: number;
  todayKP: number;
  targetKP: number;
}) {
  const router = useRouter();
  const [displayKP, setDisplayKP] = useState(0);
  const countProgress = useSharedValue(0);
  const hasExited = useRef(false);
  const secured = targetKP > 0 && todayKP >= targetKP;
  const percent = targetKP > 0 ? Math.min(100, Math.round((todayKP / targetKP) * 100)) : 0;
  const kpUntilSecured = Math.max(0, targetKP - todayKP);

  function goToProgress() {
    if (hasExited.current) return;
    hasExited.current = true;
    router.replace('/progress');
  }

  useEffect(() => {
    countProgress.value = withTiming(1, { duration: COUNT_UP_MS, easing: Easing.out(Easing.cubic) });
    const timer = setTimeout(goToProgress, AUTO_ADVANCE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Drives displayKP from the JS thread as countProgress animates on the
  // UI thread — the standard Reanimated pattern for a number that needs
  // to actually re-render as text, not just move a style property.
  useAnimatedReaction(
    () => countProgress.value,
    (value) => {
      runOnJS(setDisplayKP)(Math.round(value * todayKP));
    },
  );

  return (
    <Pressable
      style={styles.fill}
      onPress={goToProgress}
      accessibilityRole="button"
      accessibilityLabel={`${todayKP} of ${targetKP} knowledge points today. Tap to view progress.`}>
      <LinearGradient colors={['#14B8A6', '#0F766E', '#082F2C']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }} style={styles.fill}>
        <View style={styles.content}>
          <Animated.Text entering={FadeIn.duration(250)} style={styles.eyebrow}>
            {streakDays} DAY STREAK
          </Animated.Text>

          <Animated.View entering={ZoomIn.duration(450)} style={styles.brainWrap}>
            <BrainFill percent={percent} secured={secured} size={112} />
          </Animated.View>

          <View style={styles.kpRow}>
            <Animated.Text entering={FadeIn.delay(150).duration(250)} style={styles.count}>
              {displayKP}
            </Animated.Text>
            <Animated.Text entering={FadeIn.delay(250).duration(250)} style={styles.countTarget}>
              {' '}
              / {targetKP} KP
            </Animated.Text>
          </View>

          <Animated.Text entering={FadeInDown.delay(650).duration(300)} style={styles.label}>
            {secured ? "TODAY'S GOAL SECURED" : "TODAY'S KNOWLEDGE POINTS"}
          </Animated.Text>

          <Animated.Text entering={FadeInDown.delay(850).duration(300)} style={styles.sub}>
            {secured ? 'Come back tomorrow to keep it going.' : `${kpUntilSecured} KP left to reach today's goal`}
          </Animated.Text>
        </View>

        <Animated.Text entering={FadeIn.delay(1100).duration(300)} style={styles.tapHint}>
          Tap to see your full progress
        </Animated.Text>
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eyebrow: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 22,
  },
  brainWrap: {
    marginBottom: 18,
  },
  // The reveal-from-the-bottom mask: pinned to the bottom of the brain's
  // own box with overflow hidden, animated height 0→full. The SVG inside
  // it is rendered at the box's FULL size, anchored to this wrapper's own
  // bottom — so as the wrapper grows taller, more of that fixed image's
  // silhouette becomes visible from the bottom up, never repositioning
  // the artwork itself.
  fillMask: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  fillMaskInner: {
    position: 'absolute',
    left: 0,
    bottom: 0,
  },
  kpRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  count: {
    color: '#FFFFFF',
    fontSize: 60,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    lineHeight: 64,
  },
  countTarget: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 20,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginBottom: 8,
  },
  label: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 10,
  },
  sub: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 6,
  },
  tapHint: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 44,
  },
});
