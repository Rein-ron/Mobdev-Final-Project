import { useState, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from "react-native";
import { useFocusEffect } from "expo-router";
import { getTransactions, getBudgets, getSavingsGoals, addBudget, addSavingsGoal, updateSavingsGoal } from '../../src/api/api';

export default function BudgetAndSavings() {
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
      setTransactions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load transactions');
    }
  };

  const fetchBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load budgets');
    }
  };

  const fetchSavings = async () => {
    try {
      const data = await getSavingsGoals();
      setSavingsGoals(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load savings');
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
    <View style={styles.card}>{children}</View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <Text style={styles.title}>Budget and Savings</Text>

        {/* ================= BUDGET SECTION ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Budget Tracking</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setBudgetModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {budgetData.length > 0 ? (
          budgetData.map((b, i) => (
            <Card key={i}>
              <Text style={styles.cardTitle}>{b.category}</Text>
              <Text style={styles.amount}>₱{b.spent.toFixed(2)} / ₱{b.limit.toFixed(2)}</Text>
              <Text style={styles.subText}>Remaining: ₱{b.remaining.toFixed(2)}</Text>
              <View style={styles.row}>
                <View style={[styles.badge, b.status === "exceeded" && styles.badgeDanger, b.status === "warning" && styles.badgeWarning, b.status === "safe" && styles.badgeSafe]}>
                  <Text style={styles.badgeText}>
                    {b.status === "exceeded" ? "Exceeded" : b.status === "warning" ? "Near Limit" : "On Track"}
                  </Text>
                </View>
                <Text style={styles.percent}>{Math.round(b.percent)}%</Text>
              </View>
            </Card>
          ))
        ) : (
          <Card><Text style={styles.muted}>No budgets set</Text></Card>
        )}

        {/* ================= SAVINGS SECTION ================= */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Savings Goals</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setSavingsModal(true)}>
            <Text style={styles.addBtnText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {savingsData.length > 0 ? (
          savingsData.map((s, i) => (
            <Card key={i}>
              <Text style={styles.cardTitle}>{s.name}</Text>
              <Text style={styles.amount}>₱{s.saved.toFixed(2)} / ₱{s.target.toFixed(2)}</Text>
              <Text style={styles.subText}>Remaining: ₱{s.remaining.toFixed(2)}</Text>
              <Text style={styles.progress}>Progress: {Math.round(s.progress)}%</Text>
              <TouchableOpacity
                style={styles.updateBtn}
                onPress={() => { setSelectedSavingsIndex(i); setUpdateModal(true); }}
              >
                <Text style={styles.updateBtnText}>+ Add Savings</Text>
              </TouchableOpacity>
            </Card>
          ))
        ) : (
          <Card><Text style={styles.muted}>No savings goals yet</Text></Card>
        )}
      </ScrollView>

      {/* Budget Modal */}
      <Modal visible={budgetModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Budget</Text>
            <TextInput
              style={styles.input}
              placeholder="Category (e.g. food, transport)"
              value={budgetCategory}
              onChangeText={setBudgetCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Budget Limit"
              value={budgetLimit}
              onChangeText={setBudgetLimit}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddBudget}>
              <Text style={styles.submitText}>Add Budget</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setBudgetModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Savings Modal */}
      <Modal visible={savingsModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Savings Goal</Text>
            <TextInput
              style={styles.input}
              placeholder="Goal Name"
              value={savingsName}
              onChangeText={setSavingsName}
            />
            <TextInput
              style={styles.input}
              placeholder="Target Amount"
              value={savingsTarget}
              onChangeText={setSavingsTarget}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Amount Already Saved"
              value={savingsSaved}
              onChangeText={setSavingsSaved}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleAddSavings}>
              <Text style={styles.submitText}>Add Goal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSavingsModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Update Savings Modal */}
      <Modal visible={updateModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Update Savings</Text>
            <TextInput
              style={styles.input}
              placeholder="Amount to add"
              value={additionalSaved}
              onChangeText={setAdditionalSaved}
              keyboardType="numeric"
            />
            <TouchableOpacity style={styles.submitBtn} onPress={handleUpdateSavings}>
              <Text style={styles.submitText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setUpdateModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fb", padding: 16 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 12, color: "#1f2a44" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 15, marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#1f2a44" },
  addBtn: { backgroundColor: "#2a6fdb", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  addBtnText: { color: "#fff", fontWeight: "bold", fontSize: 13 },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  cardTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 6, color: "#1f2a44" },
  amount: { fontSize: 18, fontWeight: "bold", color: "#2a6fdb" },
  subText: { color: "#777", marginTop: 4 },
  progress: { marginTop: 6, fontWeight: "600", color: "#444" },
  muted: { color: "#999" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10 },
  percent: { fontWeight: "bold", color: "#1f2a44" },
  badge: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 20 },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  badgeSafe: { backgroundColor: "#2ecc71" },
  badgeWarning: { backgroundColor: "#f39c12" },
  badgeDanger: { backgroundColor: "#e74c3c" },
  updateBtn: { marginTop: 10, backgroundColor: "#f0f5ff", padding: 10, borderRadius: 10, alignItems: "center" },
  updateBtnText: { color: "#2a6fdb", fontWeight: "bold" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2a44", marginBottom: 16 },
  input: { backgroundColor: "#f9f9f9", padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
  submitBtn: { backgroundColor: "#2a6fdb", padding: 15, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  submitText: { color: "#fff", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#888", marginTop: 4 },
});