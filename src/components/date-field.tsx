import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Radius } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function parseDateKey(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const parsed = new Date(`${value}T00:00:00`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

// yyyy-mm-dd built from the picker's local Date fields (not
// toISOString, which would shift the date across a UTC day boundary
// depending on the device's timezone) — matches the plain date-key
// format every other exam-date consumer in this app already expects
// (src/lib/studyPlanner.ts's isValidFutureDate/getDaysRemaining, and the
// real /api/study-plan request body).
function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatHuman(value: string): string | null {
  const date = parseDateKey(value);
  if (!date) return null;
  return `${MONTH_NAMES[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

// A real native calendar picker (Android's system date dialog; iOS gets
// an inline native picker) rather than a typed YYYY-MM-DD text field —
// still writes/reads the exact same plain date-key string every existing
// consumer of an exam date in this app already expects, so nothing
// downstream needed to change.
export function DateField({
  value,
  onChange,
  placeholder,
  minimumDate,
  accessibilityLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  minimumDate?: Date;
  accessibilityLabel?: string;
}) {
  const theme = useTheme();
  const [iosPickerOpen, setIosPickerOpen] = useState(false);
  const selected = parseDateKey(value);
  const initialValue = selected ?? minimumDate ?? new Date();

  function open() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initialValue,
        mode: 'date',
        display: 'calendar',
        minimumDate,
        onChange: (event, date) => {
          if (event.type === 'set' && date) onChange(toDateKey(date));
        },
      });
    } else {
      setIosPickerOpen(true);
    }
  }

  return (
    <View>
      <Pressable
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? placeholder}
        style={({ pressed }) => [
          styles.field,
          { borderColor: theme.border, backgroundColor: theme.backgroundElement },
          pressed && { backgroundColor: theme.backgroundSelected },
        ]}>
        <ThemedText style={[styles.text, !selected && { color: theme.textSecondary }]} numberOfLines={1}>
          {formatHuman(value) ?? placeholder}
        </ThemedText>
        <Ionicons name="calendar-outline" size={20} color={theme.textSecondary} />
      </Pressable>

      {Platform.OS === 'ios' && iosPickerOpen && (
        <DateTimePicker
          value={initialValue}
          mode="date"
          display="inline"
          minimumDate={minimumDate}
          onChange={(event, date) => {
            setIosPickerOpen(false);
            if (event.type === 'set' && date) onChange(toDateKey(date));
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    borderRadius: Radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  text: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
  },
});
