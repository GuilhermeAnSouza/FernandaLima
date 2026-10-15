import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@/components/Button";
import { colors, radius, spacing, typography } from "@/constants/theme";

type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  warning?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  icon?: keyof typeof Ionicons.glyphMap;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  warning,
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  icon = "close",
  onConfirm,
  onCancel,
  loading = false
}: ConfirmModalProps) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      translateY.setValue(300);
      Animated.timing(translateY, { toValue: 0, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible, translateY]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      navigationBarTranslucent
      onRequestClose={() => { if (!loading) onCancel(); }}
    >
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={loading ? undefined : onCancel} />

        <Animated.View
          style={[styles.sheet, { paddingBottom: insets.bottom + spacing.lg, transform: [{ translateY }] }]}
        >
          <View style={styles.handle} />

          <View style={styles.iconCircle}>
            <Ionicons name={icon} size={26} color={colors.danger} />
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          {!!warning && <Text style={styles.warning}>{warning}</Text>}

          <View style={styles.actions}>
            <Button title={cancelLabel} variant="secondary" onPress={onCancel} disabled={loading} style={styles.action} />
            <Button title={confirmLabel} variant="danger" onPress={onConfirm} loading={loading} style={styles.action} />
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.md,
    paddingHorizontal: spacing.xl - 4,
    alignItems: "center",
  },
  handle: { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, marginBottom: spacing.lg },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: radius.circle,
    backgroundColor: colors.dangerLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: { fontSize: 18, fontWeight: "700", color: colors.text, marginBottom: spacing.sm },
  message: { ...typography.body, color: colors.textMuted, textAlign: "center" },
  warning: { ...typography.small, color: colors.textLight, marginTop: spacing.sm, textAlign: "center" },
  actions: { flexDirection: "row", gap: spacing.md, marginTop: spacing.xl },
  action: { flex: 1 },
});