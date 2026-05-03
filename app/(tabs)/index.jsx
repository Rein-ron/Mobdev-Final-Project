import { View, Text, StyleSheet, ScrollView } from "react-native";

const Card = ({ children }) => {
  return <View style={styles.card}>{children}</View>;
};

const Dashboard = ({ transactions = [], budgets = [] }) => {
  const income = transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;

  const now = new Date();

  const getSummary = (days) => {
    return transactions
      .filter(t => {
        const diff = (now - new Date(t.date)) / (1000 * 60 * 60 * 24);
        return t.type === "expense" && diff <= days;
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const daily = getSummary(1);
  const weekly = getSummary(7);
  const monthly = getSummary(30);

  const categoryTotals = {};
  transactions.forEach(t => {
    if (t.type === "expense") {
      categoryTotals[t.category] =
        (categoryTotals[t.category] || 0) + t.amount;
    }
  });

  const topCategory =
    Object.keys(categoryTotals).length > 0
      ? Object.keys(categoryTotals).reduce((a, b) =>
          categoryTotals[a] > categoryTotals[b] ? a : b
        )
      : "None";

  const alerts = budgets
    .map(budget => {
      const spent = transactions
        .filter(t => t.category === budget.category)
        .reduce((sum, t) => sum + t.amount, 0);

      if (spent >= budget.limit) {
        return `⚠️ You exceeded ${budget.category}`;
      } else if (spent >= budget.limit * 0.8) {
        return `⚠️ Close to ${budget.category} limit`;
      }
      return null;
    })
    .filter(Boolean);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <ScrollView style={styles.container}>

      {/* ================= HEADER ================= */}
      <Text style={styles.title}>Financial Status</Text>

      {/* BALANCE CARD */}
      <Card>
        <Text style={styles.cardLabel}>Current Balance</Text>
        <Text style={styles.balance}>₱{balance}</Text>
      </Card>

      {/* SUMMARY CARDS */}
      <View style={styles.row}>
        <Card>
          <Text style={styles.cardLabel}>Income</Text>
          <Text style={styles.income}>₱{income}</Text>
        </Card>

        <Card>
          <Text style={styles.cardLabel}>Expenses</Text>
          <Text style={styles.expense}>₱{expenses}</Text>
        </Card>
      </View>

      {/* SPENDING SUMMARY */}
      <Card>
        <Text style={styles.sectionTitle}>Spending Summary</Text>
        <Text>Daily: ₱{daily}</Text>
        <Text>Weekly: ₱{weekly}</Text>
        <Text>Monthly: ₱{monthly}</Text>
      </Card>

      {/* ALERTS */}
      <Card>
        <Text style={styles.sectionTitle}>Budget Alerts</Text>
        {alerts.length > 0 ? (
          alerts.map((a, i) => (
            <Text key={i} style={styles.alert}>{a}</Text>
          ))
        ) : (
          <Text style={styles.muted}>No alerts 🎉</Text>
        )}
      </Card>

      {/* STATS */}
      <Card>
        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <Text>Top Category: {topCategory}</Text>
      </Card>

      {/* RECENT */}
      <Card>
        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {recentTransactions.length > 0 ? (
        recentTransactions.map((t, i) => (
          <Text key={i} style={styles.transaction}>
            {t.date} • {t.category || "N/A"} • ₱{t.amount}
          </Text>
        ))
        ) : (
          <Text style={styles.muted}>No recent transactions</Text>
        )}
      </Card>

    <Text style={{ marginBottom: 12 }}></Text>

    </ScrollView>
  );
};

export default Dashboard;

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
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },

  cardLabel: {
    fontSize: 14,
    color: "#888",
    marginBottom: 5,
  },

  balance: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#2a6fdb",
  },

  income: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2ecc71",
  },

  expense: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2a44",
  },

  alert: {
    color: "#e74c3c",
    marginBottom: 4,
  },

  muted: {
    color: "#999",
  },

  transaction: {
    paddingVertical: 4,
    color: "#333",
  },
});