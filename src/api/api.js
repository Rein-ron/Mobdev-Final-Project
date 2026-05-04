import app from '../../firebaseConfig';
import { auth } from '../../firebaseConfig';
 const BASE_URL = 'http://10.0.2.2:8080/api'; // Android emulator
// const BASE_URL = 'http://localhost:8080/api'; // iOS simulator
// const BASE_URL = 'http://192.168.1.8:8080/api'; // physical device

const getToken = async () => {
  try {
    if (!auth.currentUser) {
    throw new Error('No user logged in');
  }
    const token = await auth.currentUser.getIdToken();
    console.log('Token retrieved successfully');
    return token;
  } catch (error) {
    console.log('Token error:', error.message);
    throw error;
  }
};

export const getTransactions = async () => {
  try {
    const token = await getToken();
    console.log('Calling transactions endpoint...');
    const res = await fetch(`${BASE_URL}/transactions`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Transactions status:', res.status);
    return res.json();
  } catch (error) {
    console.log('Transactions error:', error.message);
    throw error;
  }
};

export const addTransaction = async (transaction) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/transactions`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(transaction)
  });
  return res.text();
};

export const deleteTransaction = async (id) => {
  const token = await getToken();
  await fetch(`${BASE_URL}/transactions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const getSummary = async () => {
  try {
    const token = await getToken();
    console.log('Calling summary endpoint...');
    const res = await fetch(`${BASE_URL}/summary`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Summary status:', res.status);
    return res.json();
  } catch (error) {
    console.log('Summary error:', error.message);
    throw error;
  }
};

export const updateSavingsGoal = async (id, newSaved) => {
  const token = await getToken();
  await fetch(`${BASE_URL}/savings/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ saved: newSaved })
  });
};

export const addBudget = async (budget) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/budgets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(budget)
  });
  return res.text();
};

export const addSavingsGoal = async (goal) => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/savings`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(goal)
  });
  return res.text();
};

export const getBudgets = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/budgets`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getSavingsGoals = async () => {
  const token = await getToken();
  const res = await fetch(`${BASE_URL}/savings`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

