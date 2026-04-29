import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function BudgetAndSavings({
  transactions = [],
  budgets = [],
  savingsGoals = [],
}) {

  // =======================
  // CALCULATIONS
  // =======================

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

  // =======================
  // CARD COMPONENT
  // =======================
  const Card = ({ children }) => (
    <View style={styles.card}>{children}</View>
  );

  return (
    <ScrollView style={styles.container}>

      {/* ================= HEADER ================= */}
      <Text style={styles.title}>Budget and Savings</Text>

      {/* ================= BUDGET SECTION ================= */}
      <Text style={styles.sectionTitle}>Budget Tracking</Text>

      {budgetData.length > 0 ? (
        budgetData.map((b, i) => (
          <Card key={i}>

            <Text style={styles.cardTitle}>{b.category}</Text>

            <Text style={styles.amount}>
              ₱{b.spent} / ₱{b.limit}
            </Text>

            <Text style={styles.subText}>
              Remaining: ₱{b.remaining}
            </Text>

            <View style={styles.row}>
              <View
                style={[
                  styles.badge,
                  b.status === "exceeded" && styles.badgeDanger,
                  b.status === "warning" && styles.badgeWarning,
                  b.status === "safe" && styles.badgeSafe,
                ]}
              >
                <Text style={styles.badgeText}>
                  {b.status === "exceeded"
                    ? "Exceeded"
                    : b.status === "warning"
                    ? "Near Limit"
                    : "On Track"}
                </Text>
              </View>

              <Text style={styles.percent}>
                {Math.round(b.percent)}%
              </Text>
            </View>

          </Card>
        ))
      ) : (
        <Card>
          <Text style={styles.muted}>No budgets set</Text>
        </Card>
      )}

      {/* ================= SAVINGS SECTION ================= */}
      <Text style={styles.sectionTitle}>Savings Goals</Text>

      {savingsData.length > 0 ? (
        savingsData.map((s, i) => (
          <Card key={i}>

            <Text style={styles.cardTitle}>{s.name}</Text>

            <Text style={styles.amount}>
              ₱{s.saved} / ₱{s.target}
            </Text>

            <Text style={styles.subText}>
              Remaining: ₱{s.remaining}
            </Text>

            <Text style={styles.progress}>
              Progress: {Math.round(s.progress)}%
            </Text>

          </Card>
        ))
      ) : (
        <Card>
          <Text style={styles.muted}>No savings goals yet</Text>
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

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
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

  cardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#1f2a44",
  },

  amount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2a6fdb",
  },

  subText: {
    color: "#777",
    marginTop: 4,
  },

  progress: {
    marginTop: 6,
    fontWeight: "600",
    color: "#444",
  },

  muted: {
    color: "#999",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  percent: {
    fontWeight: "bold",
    color: "#1f2a44",
  },

  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },

  badgeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },

  badgeSafe: {
    backgroundColor: "#2ecc71",
  },

  badgeWarning: {
    backgroundColor: "#f39c12",
  },

  badgeDanger: {
    backgroundColor: "#e74c3c",
  },
});