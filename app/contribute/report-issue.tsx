import { getUserProfile } from '@/auth/authService';
import { Colors } from '@/constants/Colors';
import { useCreateReportMutation } from '@/hooks/reportMutation';
import { User } from '@/models/user';
import { IssueKey, IssueOption } from '@/types/IssueKey';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  useColorScheme,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ISSUE_OPTIONS: IssueOption[] = [
  { key: 'closed', label: 'Fermé' },
  { key: 'dirty', label: 'Sale' },
  { key: 'maintenance', label: 'En maintenance' },
  { key: 'other', label: 'Autre' },
];

export default function ReportIssueScreen() {
  const { toiletId } = useLocalSearchParams();
  const [selected, setSelected] = useState<IssueKey>('closed');
  const [details, setDetails] = useState<string>('');
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [detailsError, setDetailsError] = useState<string>('');
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? 'light'];
  
  const toiletIdNum = Number(toiletId) || -1;

  const createReportMutation = useCreateReportMutation();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = (): void => {
    if (selected === 'other' && details.trim() === '') {
      setDetailsError('Veuillez préciser le problème');
      return;
    }

    setDetailsError('');
    const payload = {
      userId: userProfile?.id ?? -1,
      toiletId: toiletIdNum,
      type: selected,
      description: details,
    };

    createReportMutation.mutate(payload);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* En-tête */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>Signaler un problème</Text>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={[styles.question, { color: theme.text }]}>Quel est le problème ?</Text>

          {/* Options */}
          <View style={styles.options}>
            {ISSUE_OPTIONS.map(({ key, label }) => {
              const isSelected = selected === key;
              return (
                <Pressable
                  key={key}
                  onPress={() => setSelected(key)}
                  style={({ pressed }) => [
                    styles.option,
                    { borderColor: theme.border, backgroundColor: theme.card },
                    isSelected && { borderColor: theme.primary, backgroundColor: theme.success + '20' },
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
                      { borderColor: theme.border, backgroundColor: theme.card },
                      isSelected && { backgroundColor: theme.primary, borderColor: theme.primary },
                    ]}
                  >
                    {isSelected && <Text style={styles.checkMark}>✓</Text>}
                  </View>
                </Pressable>
              );
            })}
          </View>

          {/* Champ détails */}
          <Text style={[styles.detailsLabel, { color: theme.textMuted }]}>Détails supplémentaires</Text>
          <TextInput
            value={details}
            onChangeText={setDetails}
            placeholder="Ajoutez des commentaires ou précisions..."
            placeholderTextColor={theme.textMuted}
            multiline
            style={[
              styles.textArea,
              { borderColor: detailsError ? '#ef4444' : theme.border, color: theme.text, backgroundColor: theme.card },
            ]}
            textAlignVertical="top"
          />
          {detailsError && (
            <Text style={[styles.errorText, { color: '#ef4444' }]}>{detailsError}</Text>
          )}

          {/* Bouton envoyer */}
          <Pressable
            onPress={handleSubmit}
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
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 22, fontWeight: '700' },
  content: { flex: 1 },
  contentContainer: { padding: 20, paddingBottom: 100 },
  question: { fontSize: 16, fontWeight: '600', marginBottom: 12 },
  options: { gap: 10, marginBottom: 20 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  optionLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  check: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: { color: '#FFFFFF', fontSize: 16, fontWeight: '700', lineHeight: 18 },
  detailsLabel: { fontSize: 14, marginBottom: 8, marginTop: 4 },
  textArea: { minHeight: 140, borderWidth: 1, borderRadius: 12, padding: 12, fontSize: 15, marginBottom: 20 },
  errorText: { fontSize: 12, marginTop: -16, marginBottom: 12 },
  submit: { borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  submitText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
