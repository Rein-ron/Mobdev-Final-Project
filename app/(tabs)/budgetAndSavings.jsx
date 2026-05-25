import { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { getTransactions, getBudgets, getSavingsGoals, addBudget, addSavingsGoal, updateSavingsGoal } from '../../src/api/api';
import { useTheme } from '../../context/ThemeContext';

export default function BudgetAndSavings() {
  const { theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  const [budgetModal, setBudgetModal] = useState(false);
  const [savingsModal, setSavingsModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  const [budgetCategory, setBudgetCategory] = useState("");
  const [budgetLimit, setBudgetLimit] = useState("");

  const [savingsName, setSavingsName] = useState("");
  const [savingsTarget, setSavingsTarget] = useState("");
  const [savingsSaved, setSavingsSaved] = useState("");

  const [selectedSavingsIndex, setSelectedSavingsIndex] = useState(null);
  const [additionalSaved, setAdditionalSaved] = useState("");

  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      fetchBudgets();
      fetchSavings();
    }, [])
  );

  const fetchTransactions = async () => {
    try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      setTransactions([]);
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(Array.isArray(data) ? data : []);
    } catch (error) {
      setBudgets([]);
    }
  };

  const fetchSavings = async () => {
    try {
      const data = await getSavingsGoals();
      setSavingsGoals(Array.isArray(data) ? data : []);
    } catch (error) {
      setSavingsGoals([]);
    }
  };

  const handleAddBudget = async () => {
    if (!budgetCategory || !budgetLimit) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (isNaN(parseFloat(budgetLimit))) {
      Alert.alert('Error', 'Budget limit must be a number');
      return;
    }
    try {
      await addBudget({ category: budgetCategory, limit: parseFloat(budgetLimit) });
      setBudgetCategory("");
      setBudgetLimit("");
      setBudgetModal(false);
      fetchBudgets();
    } catch (error) {
      Alert.alert('Error', 'Failed to add budget');
    }
  };

  const handleAddSavings = async () => {
    if (!savingsName || !savingsTarget || !savingsSaved) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (isNaN(parseFloat(savingsTarget)) || isNaN(parseFloat(savingsSaved))) {
      Alert.alert('Error', 'Amounts must be numbers');
      return;
    }
    try {
      await addSavingsGoal({ name: savingsName, target: parseFloat(savingsTarget), saved: parseFloat(savingsSaved) });
      setSavingsName("");
      setSavingsTarget("");
      setSavingsSaved("");
      setSavingsModal(false);
      fetchSavings();
    } catch (error) {
      Alert.alert('Error', 'Failed to add savings goal');
    }
  };

  const handleUpdateSavings = async () => {
    if (!additionalSaved || isNaN(parseFloat(additionalSaved))) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }
    try {
      const goal = savingsGoals[selectedSavingsIndex];
      const newSaved = goal.saved + parseFloat(additionalSaved);
      await updateSavingsGoal(goal.id, newSaved);
      setAdditionalSaved("");
      setUpdateModal(false);
      fetchSavings();
    } catch (error) {
      Alert.alert('Error', 'Failed to update savings');
    }
  };

  const getSpent = (category) => {
    return transactions
      .filter((t) => t.type === "expense" && t.category === category)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const budgetData = budgets.map((b) => {
    const spent = getSpent(b.category);
    const remaining = b.limit - spent;
    const percent = (spent / b.limit) * 100;
    let status = "safe";
    if (percent >= 100) status = "exceeded";
    else if (percent >= 80) status = "warning";
    return { ...b, spent, remaining, percent, status };
  });

  const savingsData = savingsGoals.map((g) => {
    const progress = (g.saved / g.target) * 100;
    return { ...g, progress, remaining: g.target - g.saved };
  });

  const Card = ({ children }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>{children}</View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
        <Text style={[styles.title, { color: theme.text }]}>Budget and Savings</Text>

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Budget Tracking</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setBudgetModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {budgetData.length > 0 ? (
          budgetData.map((b, i) => (
            <Card key={i}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{b.category}</Text>
              <Text style={styles.amount}>₱{b.spent.toFixed(2)} / ₱{b.limit.toFixed(2)}</Text>
              <Text style={[styles.subText, { color: theme.subText }]}>Remaining: ₱{b.remaining.toFixed(2)}</Text>
              <View style={styles.row}>
                <View style={[styles.badge, b.status === "exceeded" && styles.badgeDanger, b.status === "warning" && styles.badgeWarning, b.status === "safe" && styles.badgeSafe]}>
                  <Text style={styles.badgeText}>
                    {b.status === "exceeded" ? "Exceeded" : b.status === "warning" ? "Near Limit" : "On Track"}
                  </Text>
                </View>
                <Text style={[styles.percent, { color: theme.text }]}>{Math.round(b.percent)}%</Text>
              </View>
            </Card>
          ))
        ) : (
          <Card><Text style={[styles.muted, { color: theme.subText }]}>No budgets set</Text></Card>
        )}

        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Savings Goals</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setSavingsModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {savingsData.length > 0 ? (
          savingsData.map((s, i) => (
            <Card key={i}>
              <Text style={[styles.cardTitle, { color: theme.text }]}>{s.name}</Text>
              <Text style={styles.amount}>₱{s.saved.toFixed(2)} / ₱{s.target.toFixed(2)}</Text>
              <Text style={[styles.subText, { color: theme.subText }]}>Remaining: ₱{s.remaining.toFixed(2)}</Text>
              <Text style={[styles.progress, { color: theme.subText }]}>Progress: {Math.round(s.progress)}%</Text>
              <TouchableOpacity
                style={[styles.updateBtn, { backgroundColor: theme.inputBg }]}
                onPress={() => { setSelectedSavingsIndex(i); setUpdateModal(true); }}
              >
                <Text style={styles.updateBtnText}>+ Add Savings</Text>
              </TouchableOpacity>
            </Card>
          ))
        ) : (
          <Card><Text style={[styles.muted, { color: theme.subText }]}>No savings goals yet</Text></Card>
        )}
      </ScrollView>

      <Modal visible={budgetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Budget</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Category (e.g. food, transport)"
              placeholderTextColor={theme.subText}
              value={budgetCategory}
              onChangeText={setBudgetCategory}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Budget Limit"
              placeholderTextColor={theme.subText}
              value={budgetLimit}
              onChangeText={setBudgetLimit}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddBudget}>
              <Text style={styles.submitText}>Add Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBudgetModal(false)}>
              <Text style={[styles.cancelText, { color: theme.subText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={savingsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Add Savings Goal</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Goal Name"
              placeholderTextColor={theme.subText}
              value={savingsName}
              onChangeText={setSavingsName}
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Target Amount"
              placeholderTextColor={theme.subText}
              value={savingsTarget}
              onChangeText={setSavingsTarget}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Amount Already Saved"
              placeholderTextColor={theme.subText}
              value={savingsSaved}
              onChangeText={setSavingsSaved}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSavings}>
              <Text style={styles.submitText}>Add Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSavingsModal(false)}>
              <Text style={[styles.cancelText, { color: theme.subText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={updateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: theme.cardBg }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Update Savings</Text>
            <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.inputBorder, color: theme.text }]}
              placeholder="Amount to add"
              placeholderTextColor={theme.subText}
              value={additionalSaved}
              onChangeText={setAdditionalSaved}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateSavings}>
              <Text style={styles.submitText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUpdateModal(false)}>
              <Text style={[styles.cancelText, { color: theme.subText }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  addBtn: { backgroundColor: "#2a6fdb", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  card: { borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  amount: { fontSize: 18, fontWeight: "bold", color: "#2a6fdb" },
  subText: { marginTop: 4 },
  progress: { marginTop: 6, fontWeight: "600" },
  muted: {},
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  percent: { fontWeight: "bold" },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  badgeSafe: { backgroundColor: "#2ecc71" },
  badgeWarning: { backgroundColor: "#f39c12" },
  badgeDanger: { backgroundColor: "#e74c3c" },
  updateBtn: { marginTop: 10, padding: 10, borderRadius: 10, alignItems: "center" },
  updateBtnText: { color: "#2a6fdb", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 16 },
  input: { padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1 },
  submitBtn: { backgroundColor: "#2a6fdb", padding: 15, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  submitText: { color: "#fff", fontWeight: "bold" },
  cancelText: { textAlign: "center", marginTop: 4 },
});