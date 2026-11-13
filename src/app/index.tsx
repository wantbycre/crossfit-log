import { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  TextInput,
  type TextInputProps,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { BottomTabInset, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";

type WorkoutLog = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number;
  createdAt: string;
};

type WorkoutDraft = {
  name: string;
  sets: string;
  reps: string;
  weight: string;
};

const emptyDraft: WorkoutDraft = { name: "", sets: "", reps: "", weight: "" };

function toNumber(value: string) {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function FormInput(props: TextInputProps) {
  const theme = useTheme();

  return (
    <TextInput
      placeholderTextColor={theme.textSecondary}
      {...props}
      style={[
        styles.input,
        { color: theme.text, backgroundColor: theme.backgroundElement },
        props.style,
      ]}
    />
  );
}

export default function HomeScreen() {
  const theme = useTheme();
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [draft, setDraft] = useState<WorkoutDraft>(emptyDraft);

  const updateDraft = (key: keyof WorkoutDraft) => (value: string) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const handleAdd = () => {
    const trimmedName = draft.name.trim();
    if (!trimmedName) return;

    const newLog: WorkoutLog = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: trimmedName,
      sets: toNumber(draft.sets),
      reps: toNumber(draft.reps),
      weight: toNumber(draft.weight),
      createdAt: new Date().toISOString(),
    };

    setLogs((prev) => [newLog, ...prev]);
    setDraft(emptyDraft);
  };

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView style={styles.container} behavior="padding">
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
          <ThemedText type="subtitle">오늘의 WOD</ThemedText>

          <ThemedView style={styles.form}>
            <FormInput
              placeholder="운동 이름"
              value={draft.name}
              onChangeText={updateDraft("name")}
            />
            <ThemedView style={styles.row}>
              <FormInput
                style={styles.rowInput}
                placeholder="세트"
                keyboardType="number-pad"
                value={draft.sets}
                onChangeText={updateDraft("sets")}
              />
              <FormInput
                style={styles.rowInput}
                placeholder="횟수"
                keyboardType="number-pad"
                value={draft.reps}
                onChangeText={updateDraft("reps")}
              />
              <FormInput
                style={styles.rowInput}
                placeholder="무게(kg)"
                keyboardType="decimal-pad"
                value={draft.weight}
                onChangeText={updateDraft("weight")}
              />
            </ThemedView>

            <Pressable
              onPress={handleAdd}
              style={({ pressed }) => [
                styles.button,
                { backgroundColor: theme.text },
                pressed && styles.pressed,
              ]}>
              <ThemedText type="smallBold" style={{ color: theme.background }}>
                기록 추가
              </ThemedText>
            </Pressable>
          </ThemedView>

          <FlatList
            data={logs}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <ThemedView type="backgroundElement" style={styles.item}>
                <ThemedText>
                  {item.name} {item.sets}세트 x {item.reps}회 / {item.weight}kg
                </ThemedText>
              </ThemedView>
            )}
            ListEmptyComponent={
              <ThemedText type="small" themeColor="textSecondary" style={styles.empty}>
                아직 기록이 없어요
              </ThemedText>
            }
          />

          <FormInput placeholder="키보드 테스트용 (임시)" style={styles.tempInput} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    gap: Spacing.three,
  },
  form: {
    gap: Spacing.two,
  },
  row: {
    flexDirection: "row",
    gap: Spacing.two,
  },
  input: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: Spacing.two,
    fontSize: 16,
  },
  rowInput: {
    flex: 1,
  },
  button: {
    alignItems: "center",
    paddingVertical: Spacing.three,
    borderRadius: Spacing.two,
  },
  pressed: {
    opacity: 0.7,
  },
  listContent: {
    gap: Spacing.two,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  item: {
    padding: Spacing.three,
    borderRadius: Spacing.two,
  },
  empty: {
    textAlign: "center",
    marginTop: Spacing.four,
  },
  tempInput: {
    marginBottom: BottomTabInset + Spacing.two,
  },
});
