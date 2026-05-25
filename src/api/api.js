import { auth } from '../../config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
// const BASE_URL = 'http://10.0.2.2:8080/api'; // Android emulator
// const BASE_URL = 'http://localhost:8080/api'; // iOS simulator
const BASE_URL = 'https://mobdev-final-project-production.up.railway.app/api'; // physical device / APK

const getToken = async () => {
  const user = auth.currentUser ?? await new Promise((resolve) => {
    let unsubscribe = () => {};
    const timeout = setTimeout(() => {
      unsubscribe();
      resolve(null);
    }, 5000);

    unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(timeout);
      unsubscribe();
      resolve(currentUser);
    });
  });

  if (!user) throw new Error('No user logged in');
  return user.getIdToken();
};

const safeJson = async (res, fallback, endpoint) => {
  if (!res.ok) {
    const message = await res.text().catch(() => '');
    console.log(`API request failed (${endpoint}): ${res.status} ${message}`);
    return fallback;
  }
  try {
    const data = await res.json();
    return data ?? fallback;
  } catch {
    return fallback;
  }
};

export const getTransactions = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/transactions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeJson(res, [], 'GET /transactions');
};

export const addTransaction = async (transaction) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  return res.text();
};

export const deleteTransaction = async (id) => {
  const token = await getToken();
  await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const getSummary = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/summary`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeJson(res, { income: 0, expenses: 0, balance: 0 }, 'GET /summary');
};

export const getBudgets = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/budgets`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeJson(res, [], 'GET /budgets');
};

export const addBudget = async (budget) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/budgets`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  });
  return res.text();
};

export const getSavingsGoals = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/savings`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return safeJson(res, [], 'GET /savings');
};

export const addSavingsGoal = async (goal) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/savings`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  });
  return res.text();
};

export const updateSavingsGoal = async (id, newSaved) => {
  const token = await getToken();
  await fetch(`${BASE_URL}/savings/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ saved: newSaved }),
  });
};
