import { useState, useCallback, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";
import { getDashboard } from '../../src/api/api';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig';
import { useTheme } from '../../context/ThemeContext';

const Dashboard = () => {
  const { isDarkMode, theme } = useTheme();
  const [summary, setSummary] = useState({ income: 0, expenses: 0, balance: 0 });
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savings, setSavings] = useState([]);
  const [userReady, setUserReady] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isFetching = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserReady(true);
    });
    return unsubscribe;
  }, []);

  const fetchData = useCallback(async () => {
    if (isFetching.current) return;

    isFetching.current = true;
    setIsRefreshing(true);
    try {
      const dashboardData = await getDashboard();
      setSummary(dashboardData.summary ?? { income: 0, expenses: 0, balance: 0 });
      setTransactions(Array.isArray(dashboardData.transactions) ? dashboardData.transactions : []);
      setBudgets(Array.isArray(dashboardData.budgets) ? dashboardData.budgets : []);
      setSavings(Array.isArray(dashboardData.savings) ? dashboardData.savings : []);
    } catch (error) {
      console.log('fetchData error:', error.message);
    } finally {
      isFetching.current = false;
      setIsRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (userReady) fetchData();
    }, [userReady, fetchData])
  );

  const recent = Array.isArray(transactions)
    ? [...transactions]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 5)
    : [];

  const getSpent = (category) =>
    Array.isArray(transactions)
      ? transactions
          .filter(t => t.type === "expense" && t.category === category)
          .reduce((sum, t) => sum + t.amount, 0)
      : 0;

  return (
    <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121824' : '#f4f7fb' }]}>

      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.text }]}>My Budget</Text>
        {isRefreshing && <Text style={[styles.refreshText, { color: theme.subText }]}>Refreshing...</Text>}
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceLabel}>Total Balance</Text>
        <Text style={styles.balanceAmount}>₱{(summary.balance || 0).toFixed(2)}</Text>
      </View>

      <View style={styles.row}>
        <View style={[styles.statCard, { borderLeftColor: "#2ecc71", backgroundColor: theme.cardBg }]}>
          <Text style={[styles.statLabel, { color: theme.subText }]}>Income</Text>
          <Text style={[styles.statAmount, { color: "#2ecc71" }]}>
            ₱{(summary.income || 0).toFixed(2)}
          </Text>
        </View>
        <View style={[styles.statCard, { borderLeftColor: "#2ecc71", backgroundColor: theme.cardBg }]}>
          <Text style={[styles.statLabel, { color: theme.subText }]}>Expenses</Text>
          <Text style={[styles.statAmount, { color: "#e74c3c" }]}>
            ₱{(summary.expenses || 0).toFixed(2)}
          </Text>
        </View>
      </View>

      {budgets.length > 0 && (
        <View style={[styles.card, { borderLeftColor: "#2ecc71", backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Budget Tracking</Text>
          {budgets.map((b, i) => {
            const spent = getSpent(b.category);
            const percent = Math.min((spent / b.limit) * 100, 100);
            const status = percent >= 100 ? "#e74c3c" : percent >= 80 ? "#f39c12" : "#2ecc71";
            return (
              <View key={i} style={styles.budgetRow}>
                <View style={styles.budgetTop}>
                  <Text style={[styles.budgetCategory, { color: theme.text }]}>{b.category}</Text>
                  <Text style={[styles.budgetAmount, { color: theme.subText }]}>
                    ₱{spent.toFixed(2)} / ₱{b.limit.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: status }]} />
                </View>
                <Text style={[styles.budgetStatus, { color: status }]}>
                  {percent >= 100 ? "Exceeded" : percent >= 80 ? "Near Limit" : "On Track"} • {Math.round(percent)}%
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {savings.length > 0 && (
        <View style={[styles.card, { borderLeftColor: "#2ecc71", backgroundColor: theme.cardBg }]}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Savings Goals</Text>
          {savings.map((s, i) => {
            const percent = Math.min((s.saved / s.target) * 100, 100);
            return (
              <View key={i} style={styles.budgetRow}>
                <View style={styles.budgetTop}>
                  <Text style={[styles.budgetCategory, { color: theme.text }]}>{s.name}</Text>
                  <Text style={[styles.budgetAmount, { color: theme.subText }]}>
                    ₱{s.saved.toFixed(2)} / ₱{s.target.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.barBackground}>
                  <View style={[styles.barFill, { width: `${percent}%`, backgroundColor: "#2a6fdb" }]} />
                </View>
                <Text style={[styles.budgetStatus, { color: "#2a6fdb" }]}>
                  {Math.round(percent)}% saved
                </Text>
              </View>
            );
          })}
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: theme.text }]}>Recent Transactions</Text>
      <View style={[styles.card, { borderLeftColor: "#2ecc71", backgroundColor: theme.cardBg }]}>
        {recent.length > 0 ? (
          recent.map((t, i) => (
            <View key={i} style={[styles.txRow, i < recent.length - 1 && styles.txBorder, { borderBottomColor: theme.border }]}>
              <View>
                <Text style={[styles.txCategory, { color: theme.text }]}>{t.category}</Text>
                <Text style={[styles.txDate, { color: theme.subText }]}>{t.date}</Text>
              </View>
              <Text style={t.type === "income" ? styles.income : styles.expense}>
                {t.type === "income" ? "+" : "-"}₱{t.amount.toFixed(2)}
              </Text>
            </View>
          ))
        ) : (
          <Text style={[styles.muted, { color: theme.subText }]}>No transactions yet</Text>
        )}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f7fb", padding: 16 },
  titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: "#1f2a44" },
  refreshText: { fontSize: 12, fontWeight: "600" },
  balanceCard: { backgroundColor: "#1f2a44", borderRadius: 16, padding: 24, marginBottom: 16, alignItems: "center" },
  balanceLabel: { fontSize: 13, color: "#aaa", marginBottom: 8 },
  balanceAmount: { fontSize: 36, fontWeight: "bold", color: "#fff" },
  row: { flexDirection: "row", gap: 12, marginBottom: 12 },
  statCard: { flex: 1, backgroundColor: "#fff", borderRadius: 12, padding: 16, borderLeftWidth: 4, elevation: 2 },
  statLabel: { fontSize: 12, color: "#888", marginBottom: 6 },
  statAmount: { fontSize: 18, fontWeight: "bold" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, elevation: 2, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", color: "#1f2a44", marginBottom: 12 },
  budgetRow: { marginBottom: 14 },
  budgetTop: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  budgetCategory: { fontSize: 13, fontWeight: "600", color: "#1f2a44", textTransform: "capitalize" },
  budgetAmount: { fontSize: 12, color: "#888" },
  barBackground: { height: 6, backgroundColor: "#f0f0f0", borderRadius: 3, overflow: "hidden", marginBottom: 4 },
  barFill: { height: 6, borderRadius: 3 },
  budgetStatus: { fontSize: 11, fontWeight: "600" },
  txRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  txBorder: { borderBottomWidth: 0.5, borderBottomColor: "#f0f0f0" },
  txCategory: { fontSize: 14, fontWeight: "600", color: "#1f2a44" },
  txDate: { fontSize: 11, color: "#aaa", marginTop: 2 },
  income: { fontSize: 14, fontWeight: "bold", color: "#2ecc71" },
  expense: { fontSize: 14, fontWeight: "bold", color: "#e74c3c" },
  muted: { color: "#999", fontSize: 13 },
});

export default Dashboard;
