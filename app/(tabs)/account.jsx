import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, Modal, TextInput, Switch, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { signOut, updateProfile, updatePassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { Ionicons } from "@expo/vector-icons";

export default function AccountScreen() {
  const router = useRouter();
  const user = auth.currentUser;

  // --- STATE MANAGEMENT ---
  // System Configurations & Core Layout Toggles
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English (US)');
  const [selectedTimeZone, setSelectedTimeZone] = useState('GMT+08:00 (PST)');

  // Notification Feature Switch Toggles
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [remindersEnabled, setRemindersEnabled] = useState(true);
  const [updatesEnabled, setUpdatesEnabled] = useState(false);

  // Modal Visibility Controllers
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [timeZoneModalVisible, setTimeZoneModalVisible] = useState(false);

  // Profile Form Inputs
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- STATIC PRESETS ---
  const languageOptions = ['English (US)', 'English (UK)', 'Filipino', 'Spanish', 'Japanese', 'Simplified Chinese'];
  const timeZoneOptions = [
    'GMT+08:00 (PST - Philippine Time)',
    'GMT-05:00 (EST - Eastern Time)',
    'GMT-08:00 (PST - Pacific Time)',
    'GMT+00:00 (UTC / GMT)',
    'GMT+09:00 (JST - Japan Time)',
    'GMT+10:00 (AEST - Australian Time)'
  ];

  // Dynamic Appearance Theme Palette Matrix
  const theme = {
    bg: isDarkMode ? "#121824" : "#f4f7fb",
    cardBg: isDarkMode ? "#1e2736" : "#fff",
    text: isDarkMode ? "#ffffff" : "#1f2a44",
    subText: isDarkMode ? "#9aa5b5" : "#777",
    border: isDarkMode ? "#2c3747" : "#f0f0f0",
    inputBg: isDarkMode ? "#252f41" : "#f9f9f9",
    inputBorder: isDarkMode ? "#364359" : "#eee"
  };

  // --- HANDLERS ---
  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await signOut(auth);
              router.replace('/(auth)/loginRegister');
            } catch (error) {
              Alert.alert('Error', 'Failed to log out. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleUpdateProfile = async () => {
    if (!displayName.trim()) {
      Alert.alert('Error', 'Name cannot be empty.');
      return;
    }
    try {
      await updateProfile(auth.currentUser, { displayName: displayName });
      Alert.alert('Success', 'Profile updated successfully!');
      setProfileModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setPasswordModalVisible(false);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const triggerSupportAction = (title, message) => {
    Alert.alert(title, message, [{ text: "Understood", style: "default" }]);
  };

  const showLicenses = () => {
    Alert.alert(
      "Open Source Licenses",
      "This application is built using open-source software packages:\n\n• React Native (MIT)\n• Expo SDK (MIT)\n• Firebase Core & Auth (Apache 2.0)\n• Ionicons Vector Graphics (MIT)",
      [{ text: "Close", style: "cancel" }]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Profile Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={50} color="#fff" />
          </View>
          <Text style={styles.nameText}>{user?.displayName || 'Set your name'}</Text>
          <Text style={styles.emailText}>{user ? user.email : 'No user logged in'}</Text>
        </View>

        {/* ================= APPEARANCE SECTION ================= */}
        <Text style={[styles.sectionHeader, { color: theme.subText }]}>Appearance</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.cardBg }]}>
          <View style={styles.rowItem}>
            <View style={styles.menuLeft}>
              <Ionicons name={isDarkMode ? "moon" : "sunny"} size={22} color={isDarkMode ? "#f1c40f" : "#f39c12"} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>Dark Mode</Text>
                <Text style={styles.subDescription}>Toggle dark and light theme layouts</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={isDarkMode ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setIsDarkMode}
              value={isDarkMode}
            />
          </View>
        </View>

        {/* ================= NOTIFICATIONS SECTION ================= */}
        <Text style={[styles.sectionHeader, { color: theme.subText }]}>Notifications</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.cardBg }]}>

          <View style={[styles.rowItem, { borderBottomWidth: 0.5, borderBottomColor: theme.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="notifications-outline" size={22} color={theme.text} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>Push Notifications</Text>
                <Text style={styles.subDescription}>Receive instant alerts on this device</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={pushEnabled ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setPushEnabled}
              value={pushEnabled}
            />
          </View>

          <View style={[styles.rowItem, { borderBottomWidth: 0.5, borderBottomColor: theme.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="mail-outline" size={22} color={theme.text} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>Email Notifications</Text>
                <Text style={styles.subDescription}>Get transaction statements and alerts via email</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={emailEnabled ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setEmailEnabled}
              value={emailEnabled}
            />
          </View>

          <View style={[styles.rowItem, { borderBottomWidth: 0.5, borderBottomColor: theme.border }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="calendar-outline" size={22} color={theme.text} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>Event Reminders</Text>
                <Text style={styles.subDescription}>Alerts for upcoming scheduled items</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={remindersEnabled ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setRemindersEnabled}
              value={remindersEnabled}
            />
          </View>

          <View style={styles.rowItem}>
            <View style={styles.menuLeft}>
              <Ionicons name="heart-outline" size={22} color={theme.text} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>Donation Updates</Text>
                <Text style={styles.subDescription}>Campaign results and funding logs</Text>
              </View>
            </View>
            <Switch
              trackColor={{ false: "#767577", true: "#bcd3f7" }}
              thumbColor={updatesEnabled ? "#2a6fdb" : "#f4f3f4"}
              onValueChange={setUpdatesEnabled}
              value={updatesEnabled}
            />
          </View>
        </View>

        {/* ================= LANGUAGE & REGION SECTION ================= */}
        <Text style={[styles.sectionHeader, { color: theme.subText }]}>Language & Region</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.cardBg }]}>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={() => setLanguageModalVisible(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="language-outline" size={22} color={theme.text} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>App Language</Text>
                <Text style={styles.subDescription}>{selectedLanguage}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: "transparent" }]} onPress={() => setTimeZoneModalVisible(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="time-outline" size={22} color={theme.text} />
              <View>
                <Text style={[styles.menuText, { color: theme.text }]}>Time Zone</Text>
                <Text style={styles.subDescription}>{selectedTimeZone}</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* ================= HELP & SUPPORT SECTION ================= */}
        <Text style={[styles.sectionHeader, { color: theme.subText }]}>Help & Support</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.cardBg }]}>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => triggerSupportAction("Help Center", "Opening documentation guides, setup tutorials, and application system instructions...")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="help-circle-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Help Center</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: theme.border }]}
            onPress={() => triggerSupportAction("Contact Us", "Connecting to support routing desk at tickets@sbt-database.com...")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="chatbox-ellipses-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Contact Us</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomColor: "transparent" }]}
            onPress={() => triggerSupportAction("FAQs", "Loading frequently asked questions about transactions, accounts, and donation processing parameters...")}
          >
            <View style={styles.menuLeft}>
              <Ionicons name="list-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>FAQs</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* ================= ABOUT SECTION ================= */}
        <Text style={[styles.sectionHeader, { color: theme.subText }]}>About</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.cardBg }]}>
          <View style={[styles.menuItem, { borderBottomColor: theme.border, paddingVertical: 14 }]}>
            <View style={styles.menuLeft}>
              <Ionicons name="information-circle-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>App Version</Text>
            </View>
            <Text style={[styles.versionValue, { color: theme.subText }]}>1.0.0 (Build 2026)</Text>
          </View>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: "transparent" }]} onPress={showLicenses}>
            <View style={styles.menuLeft}>
              <Ionicons name="document-text-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Licenses</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* ================= ACCOUNT SETTINGS SECTION ================= */}
        <Text style={[styles.sectionHeader, { color: theme.subText }]}>Account Settings</Text>
        <View style={[styles.menuSection, { backgroundColor: theme.cardBg }]}>
          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={() => setProfileModalVisible(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="create-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Edit Profile Name</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: theme.border }]} onPress={() => router.push('/privacySecurity')}>
            <View style={styles.menuLeft}>
              <Ionicons name="shield-checkmark-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Privacy & Security</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomColor: "transparent" }]} onPress={() => setPasswordModalVisible(true)}>
            <View style={styles.menuLeft}>
              <Ionicons name="lock-closed-outline" size={22} color={theme.text} />
              <Text style={[styles.menuText, { color: theme.text }]}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Log out action button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* ================= EDIT PROFILE MODAL ================= */}
      <Modal visible={profileModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Edit Profile Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Display Name"
              placeholderTextColor="#888"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateProfile}>
              <Text style={styles.submitText}>Save Profile</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setProfileModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= CHANGE PASSWORD MODAL ================= */}
      <Modal visible={passwordModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Change Password</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={newPassword}
              onChangeText={setNewPassword}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Confirm New Password"
              placeholderTextColor="#888"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleChangePassword}>
              <Text style={styles.submitText}>Update Password</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPasswordModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= LANGUAGE OPTIONS SELECTOR MODAL ================= */}
      <Modal visible={languageModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg, maxHeight: '50%' }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Language</Text>
            <ScrollView>
              {languageOptions.map((lang) => (
                <TouchableOpacity
                  key={lang}
                  style={[styles.pickerOptionItem, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    setSelectedLanguage(lang);
                    setLanguageModalVisible(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, { color: theme.text, fontWeight: selectedLanguage === lang ? 'bold' : '400' }]}>
                    {lang}
                  </Text>
                  {selectedLanguage === lang && <Ionicons name="checkmark-circle" size={20} color="#2a6fdb" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
              <Text style={[styles.cancelText, { marginTop: 12 }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ================= TIME ZONE OPTIONS SELECTOR MODAL ================= */}
      <Modal visible={timeZoneModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg, maxHeight: '50%' }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Select Time Zone</Text>
            <ScrollView>
              {timeZoneOptions.map((zone) => (
                <TouchableOpacity
                  key={zone}
                  style={[styles.pickerOptionItem, { borderBottomColor: theme.border }]}
                  onPress={() => {
                    setSelectedTimeZone(zone.split(' (')[0]);
                    setTimeZoneModalVisible(false);
                  }}
                >
                  <Text style={[styles.pickerOptionText, { color: theme.text, fontWeight: selectedTimeZone === zone.split(' (')[0] ? 'bold' : '400' }]}>
                    {zone}
                  </Text>
                  {selectedTimeZone === zone.split(' (')[0] && <Ionicons name="checkmark-circle" size={20} color="#2a6fdb" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity onPress={() => setTimeZoneModalVisible(false)}>
              <Text style={[styles.cancelText, { marginTop: 12 }]}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16 },
  headerCard: { backgroundColor: "#1f2a44", borderRadius: 16, padding: 24, alignItems: "center", marginTop: 20, marginBottom: 16, elevation: 3, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10 },
  avatarCircle: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#2a6fdb", justifyContent: "center", alignItems: "center", marginBottom: 16 },
  nameText: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  emailText: { fontSize: 14, color: "#aaa", marginBottom: 4 },
  sectionHeader: { fontSize: 11, fontWeight: "bold", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6, marginLeft: 4, marginTop: 10 },
  menuSection: { borderRadius: 16, paddingVertical: 2, paddingHorizontal: 16, marginBottom: 14, elevation: 2, shadowColor: "#000", shadowOpacity: 0.02, shadowRadius: 5 },
  menuItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 0.5 },
  rowItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12 },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  menuText: { fontSize: 15, fontWeight: "500" },
  versionValue: { fontSize: 14, fontWeight: "500" },
  subDescription: { fontSize: 12, color: "#888", marginTop: 2, paddingRight: 8 },
  logoutButton: { backgroundColor: "#e74c3c", flexDirection: "row", padding: 15, borderRadius: 25, alignItems: "center", justifyContent: "center", marginHorizontal: 10, marginTop: 8, marginBottom: 30, elevation: 2 },
  logoutButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  pickerOptionItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 0.5 },
  pickerOptionText: { fontSize: 15 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: { padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1 },
  submitBtn: { backgroundColor: "#2a6fdb", padding: 15, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  submitText: { color: "#fff", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#888", marginTop: 4, paddingVertical: 4 },
});