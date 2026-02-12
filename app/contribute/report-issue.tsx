import { Colors } from "@/constants/Colors";
import { useReportIssueViewModel } from "@/features/contribute/useReportIssueViewModel";
import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReportIssueScreen() {
  const reportIssueViewModel = useReportIssueViewModel();
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* En-tête */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <TouchableOpacity
            onPress={reportIssueViewModel.goBack}
            style={styles.headerBack}
          >
            <Text style={[styles.headerBackIcon, { color: theme.text }]}>
              ←
            </Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: theme.text }]}>
            Signaler un problème
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.question, { color: theme.text }]}>
            Quel est le problème ?
          </Text>

          {/* Options */}
          <View style={styles.options}>
            {reportIssueViewModel.issueOptions.map(({ key, label }) => {
              const isSelected = reportIssueViewModel.selected === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => reportIssueViewModel.setSelected(key)}
                  style={({ pressed }) => [
                    styles.option,
                    { borderColor: theme.border, backgroundColor: theme.card },
                    isSelected && {
                      borderColor: theme.primary,
                      backgroundColor: theme.success + "20",
                    },
                    pressed && { opacity: 0.9 },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: theme.text },
                      isSelected && { color: theme.primary },
                    ]}
                  >
                    {label}
                  </Text>
                  <View
                    style={[
                      styles.check,
                      {
                        borderColor: theme.border,
                        backgroundColor: theme.card,
                      },
                      isSelected && {
                        backgroundColor: theme.primary,
                        borderColor: theme.primary,
                      },
                    ]}
                  >
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Champ détails */}
          <Text style={[styles.detailsLabel, { color: theme.textMuted }]}>
            Détails supplémentaires
          </Text>
          <TextInput
            value={reportIssueViewModel.details}
            onChangeText={reportIssueViewModel.setDetails}
            placeholder="Ajoutez des commentaires ou précisions..."
            placeholderTextColor={theme.textMuted}
            multiline
            style={[
              styles.textArea,
              {
                borderColor: reportIssueViewModel.detailsError
                  ? "#ef4444"
                  : theme.border,
                color: theme.text,
                backgroundColor: theme.card,
              },
            ]}
            textAlignVertical="top"
          />
          {reportIssueViewModel.detailsError && (
            <Text style={[styles.errorText, { color: "#ef4444" }]}>
              {reportIssueViewModel.detailsError}
            </Text>
          )}

          {/* Bouton envoyer */}
          <Pressable
            onPress={reportIssueViewModel.handleSubmit}
            style={({ pressed }) => [
              styles.submit,
              { backgroundColor: theme.primary },
              pressed && { backgroundColor: theme.secondary },
            ]}
          >
            <Text style={styles.submitText}>Envoyer</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  headerBack: { width: 32, alignItems: "flex-start" },
  headerBackIcon: { fontSize: 20, fontWeight: "500" },
  title: { flex: 1, textAlign: "center", fontSize: 18, fontWeight: "700" },
  headerSpacer: { width: 32 },
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  question: { fontSize: 16, fontWeight: "600", marginBottom: 12 },
  options: { gap: 10, marginBottom: 20 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionLabel: { flex: 1, fontSize: 15, fontWeight: "500" },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  checkMark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 18,
  },
  detailsLabel: { fontSize: 14, marginBottom: 8, marginTop: 4 },
  textArea: {
    minHeight: 140,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    fontSize: 15,
    marginBottom: 20,
  },
  errorText: { fontSize: 12, marginTop: -16, marginBottom: 12 },
  submit: { borderRadius: 12, paddingVertical: 14, alignItems: "center" },
  submitText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
