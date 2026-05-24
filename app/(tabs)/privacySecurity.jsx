import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from "@expo/vector-icons";

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [profileVisibility, setProfileVisibility] = useState(true);
  const [showBadges, setShowBadges] = useState(true);

  const handleViewDocument = (title, content) => {
    Alert.alert(title, `${content}\n\n[Full layout text would scroll here inside production build structures]`, [{ text: "Done" }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1f2a44" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Privacy Preferences</Text>
        <View style={styles.card}>
          <View style={styles.rowItem}>
            <View style={styles.textBlock}>
              <Text style={styles.itemTitle}>Profile Visibility</Text>
              <Text style={styles.itemDescription}>Allow your profile name to be searchable within community tracking groups.</Text>
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
              <Text style={styles.itemTitle}>Show Badges</Text>
              <Text style={styles.itemDescription}>Display your active budget and saving tier badges on your public view banner.</Text>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={showBadges ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setShowBadges}
              value={showBadges}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Legal & Documents</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleViewDocument("Privacy Policy", "Your financial records, tracking budgets, and personal configuration profiles are secured under encryption protocols.")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={20} color="#1f2a44" />
              <Text style={styles.menuItemText}>Privacy Policy</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => handleViewDocument("Terms of Service", "By operating this budgeting system application, you agree to local data processing rules.")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="ribbon-outline" size={20} color="#1f2a44" />
              <Text style={styles.menuItemText}>Terms of Service</Text>
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
  scrollContent: { padding: 16 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#777", textTransform: "uppercase", letterSpacing: 1, marginBottom: 10, marginTop: 15 },
  card: { backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 16, marginBottom: 12, elevation: 2, shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 10 },
  rowItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  textBlock: { flex: 1, paddingRight: 16 },
  itemTitle: { fontSize: 15, fontWeight: "600", color: "#1f2a44", marginBottom: 2 },
  itemDescription: { fontSize: 12, color: "#888", lineHeight: 16 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 16, borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  menuItemText: { fontSize: 15, fontWeight: "500", color: "#1f2a44" },
});