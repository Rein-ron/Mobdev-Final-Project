import { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, Modal } from "react-native";
import { getTransactions, deleteTransaction, addTransaction } from '../../src/api/api';
import { useTheme } from '../../context/ThemeContext';

export default function Transactions() {
  const { isDarkMode, theme } = useTheme();
  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [modalVisible, setModalVisible] = useState(false);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
  try {
      const data = await getTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      setTransactions([]);
      Alert.alert('Error', 'Failed to load transactions');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      Alert.alert('Error', 'Failed to delete transaction');
    }
  };

  const handleAdd = async () => {
    if (!category || !amount || !description) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const today = new Date().toISOString().split('T')[0];
      await addTransaction({
        type,
        category,
        amount: parseFloat(amount),
        description,
        date: today,
      });
      setModalVisible(false);
      setCategory("");
      setAmount("");
      setDescription("");
      setType("expense");
      fetchTransactions();
    } catch (error) {
      Alert.alert('Error', 'Failed to add transaction');
    }
  };

  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  const Card = ({ children }) => (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>{children}</View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121824' : '#f4f7fb' }]}>
        <Text style={styles.title}>Transactions</Text>

        <View style={styles.filterRow}>
          {['all', 'income', 'expense'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)}>
              <Text style={[styles.filter, filter === f && styles.activeFilter]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {filteredTransactions.length > 0 ? (
          filteredTransactions
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((t) => (
              <Card key={t.id}>
                <View style={styles.row}>
                  <Text style={styles.category}>{t.category}</Text>
                  <Text style={[styles.amount, t.type === "income" ? styles.income : styles.expense]}>
                    {t.type === "income" ? "+" : "-"} ₱{t.amount.toFixed(2)}
                  </Text>
                </View>
                <Text style={styles.date}>{t.date}</Text>
                <Text style={styles.desc}>{t.description}</Text>
                <View style={styles.actionRow}>
                  <TouchableOpacity onPress={() => handleDelete(t.id)}>
                    <Text style={styles.delete}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            ))
        ) : (
          <Card>
            <Text style={styles.muted}>No transactions found</Text>
          </Card>
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.fab} onPress={() => setModalVisible(true)}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Add Transaction Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Transaction</Text>

            {/* Type Toggle */}
            <View style={styles.typeRow}>
              <TouchableOpacity
                style={[styles.typeBtn, type === "expense" && styles.typeBtnActive]}
                onPress={() => setType("expense")}
              >
                <Text style={[styles.typeBtnText, type === "expense" && styles.typeBtnTextActive]}>Expense</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.typeBtn, type === "income" && styles.typeBtnActive]}
                onPress={() => setType("income")}
              >
                <Text style={[styles.typeBtnText, type === "income" && styles.typeBtnTextActive]}>Income</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Category (e.g. food, transport)"
              value={category}
              onChangeText={setCategory}
            />
            <TextInput
              style={styles.input}
              placeholder="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity style={styles.submitBtn} onPress={handleAdd}>
              <Text style={styles.submitText}>Add</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setModalVisible(false)}>
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
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  filterRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 15 },
  filter: { color: "#777", fontWeight: "600" },
  activeFilter: { color: "#2a6fdb", fontWeight: "bold" },
  row: { flexDirection: "row", justifyContent: "space-between" },
  category: { fontSize: 16, fontWeight: "bold", color: "#1f2a44" },
  amount: { fontSize: 16, fontWeight: "bold" },
  income: { color: "#2ecc71" },
  expense: { color: "#e74c3c" },
  date: { marginTop: 5, color: "#888", fontSize: 12 },
  desc: { color: "#555", fontSize: 13, marginTop: 2 },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 10 },
  delete: { color: "#e74c3c", fontWeight: "bold" },
  muted: { color: "#999" },
  fab: { position: "absolute", bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28, backgroundColor: "#2a6fdb", justifyContent: "center", alignItems: "center", elevation: 5 },
  fabText: { color: "#fff", fontSize: 28, lineHeight: 32 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalCard: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#1f2a44", marginBottom: 16 },
  typeRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  typeBtn: { flex: 1, padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "#ddd", alignItems: "center" },
  typeBtnActive: { backgroundColor: "#2a6fdb", borderColor: "#2a6fdb" },
  typeBtnText: { color: "#777", fontWeight: "600" },
  typeBtnTextActive: { color: "#fff" },
  input: { backgroundColor: "#f9f9f9", padding: 14, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
  submitBtn: { backgroundColor: "#2a6fdb", padding: 15, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  submitText: { color: "#fff", fontWeight: "bold" },
  cancelText: { textAlign: "center", color: "#888", marginTop: 4 },
});