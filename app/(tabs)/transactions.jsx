import { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";

export default function Transactions() {

  // =========================
  // SAMPLE STATE (replace with DB later)
  // =========================
  const [transactions, setTransactions] = useState([
    { id: 1, type: "income", category: "Allowance", amount: 1000, date: "2026-04-01" },
    { id: 2, type: "expense", category: "Food", amount: 200, date: "2026-04-02" },
    { id: 3, type: "expense", category: "Transport", amount: 100, date: "2026-04-03" },
  ]);

  const [filter, setFilter] = useState("all");

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredTransactions = transactions.filter((t) => {
    if (filter === "all") return true;
    return t.type === filter;
  });

  // =========================
  // DELETE (UI READY)
  // =========================
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  // =========================
  // CARD COMPONENT
  // =========================
  const Card = ({ children }) => (
    <View style={styles.card}>{children}</View>
  );

  return (
    <ScrollView style={styles.container}>

      {/* ================= HEADER ================= */}
      <Text style={styles.title}>Transactions</Text>

      {/* ================= FILTERS ================= */}
      <View style={styles.filterRow}>
        <TouchableOpacity onPress={() => setFilter("all")}>
          <Text style={[styles.filter, filter === "all" && styles.activeFilter]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("income")}>
          <Text style={[styles.filter, filter === "income" && styles.activeFilter]}>
            Income
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setFilter("expense")}>
          <Text style={[styles.filter, filter === "expense" && styles.activeFilter]}>
            Expenses
          </Text>
        </TouchableOpacity>
      </View>

      {/* ================= TRANSACTION LIST ================= */}
      {filteredTransactions.length > 0 ? (
        filteredTransactions
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .map((t) => (
            <Card key={t.id}>

              <View style={styles.row}>
                <Text style={styles.category}>{t.category}</Text>

                <Text
                  style={[
                    styles.amount,
                    t.type === "income" ? styles.income : styles.expense,
                  ]}
                >
                  {t.type === "income" ? "+" : "-"} ₱{t.amount}
                </Text>
              </View>

              <Text style={styles.date}>{t.date}</Text>

              {/* ACTIONS */}
              <View style={styles.actionRow}>
                <TouchableOpacity>
                  <Text style={styles.edit}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => deleteTransaction(t.id)}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    padding: 16,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#1f2a44",
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  filterRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
  },

  filter: {
    color: "#777",
    fontWeight: "600",
  },

  activeFilter: {
    color: "#2a6fdb",
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  category: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2a44",
  },

  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },

  income: {
    color: "#2ecc71",
  },

  expense: {
    color: "#e74c3c",
  },

  date: {
    marginTop: 5,
    color: "#888",
    fontSize: 12,
  },

  actionRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    gap: 15,
  },

  edit: {
    color: "#f39c12",
    fontWeight: "bold",
  },

  delete: {
    color: "#e74c3c",
    fontWeight: "bold",
  },

  muted: {
    color: "#999",
  },
});