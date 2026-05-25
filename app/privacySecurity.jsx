import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from '../context/ThemeContext';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const { theme } = useTheme();
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showBadges, setShowBadges] = useState(true);

  const handleViewDocument = (title, content) => {
    Alert.alert(title, `${content}\n\n[Full layout text would scroll here inside production build structures]`, [{ text: "Done" }]);
  };

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/(tabs)/account');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.header, { backgroundColor: theme.bg, borderBottomColor: theme.border }]}>
        <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy & Security</Text>
        <View style={{ width: 24 }} />
      </View>

 
      <ScrollView
        style={{ backgroundColor: theme.bg }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.sectionTitle, { color: theme.subText }]}>Privacy Preferences</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.rowItem, { borderBottomColor: theme.border }]}>
            <View style={styles.textBlock}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>Profile Visibility</Text>
              <Text style={[styles.itemDescription, { color: theme.subText }]}>Allow your profile name to be searchable within community tracking groups.</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={profileVisibility ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setProfileVisibility}
              value={profileVisibility}
            />
          </View>

          <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
            <View style={styles.textBlock}>
              <Text style={[styles.itemTitle, { color: theme.text }]}>Show Badges</Text>
              <Text style={[styles.itemDescription, { color: theme.subText }]}>Display your active budget and saving tier badges on your public view banner.</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={showBadges ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setShowBadges}
              value={showBadges}
            />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.subText }]}>Legal & Documents</Text>
        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => handleViewDocument("Privacy Policy", "Your financial records, tracking budgets, and personal configuration profiles are secured under encryption protocols.")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => handleViewDocument("Terms of Service", "By operating this budgeting system application, you agree to local data processing rules.")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="ribbon-outline" size={20} color={theme.text} />
              <Text style={[styles.menuItemText, { color: theme.text }]}>Terms of Service</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fb" },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#eee' },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1f2a44' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 28 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#777", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 15 },
  card: { backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 10 },
  rowItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", minHeight: 76, paddingVertical: 14, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  textBlock: { flex: 1, minWidth: 0, paddingRight: 14 },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#1f2a44", marginBottom: 2 },
  itemDescription: { fontSize: 12, color: "#888", lineHeight: 17 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1, minWidth: 0 },
  menuItemText: { fontSize: 15, fontWeight: "500", color: "#1f2a44" },
});
