import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <SafeAreaView style={styles.container}>
      {/* Decorative Circles (Background) */}
      <View style={styles.circleTop} />

      <View style={styles.card}>
        {/* Toggle Header */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity onPress={() => setIsLogin(true)}>
            <Text style={[styles.toggleText, isLogin && styles.activeToggle]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsLogin(false)}>
            <Text style={[styles.toggleText, !isLogin && styles.activeToggle]}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <TextInput style={styles.input} placeholder="User Name" />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry />
        {!isLogin && <TextInput style={styles.input} placeholder="Email" />}

        {/* Action Button */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Register'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.circleBottom} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#eef6fc', justifyContent: 'center' },
  circleTop: { position: 'absolute', top: -50, right: -50, width: 300, height: 300, borderRadius: 150, backgroundColor: '#104d80' },
  circleBottom: { position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: '#104d80' },
  card: { padding: 20, marginHorizontal: 20, backgroundColor: '#fff', borderRadius: 15, elevation: 5 },
  toggleContainer: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 30 },
  toggleText: { fontSize: 16, color: '#888' },
  activeToggle: { color: '#104d80', fontWeight: 'bold', borderBottomWidth: 2, borderBottomColor: '#104d80' },
  input: { backgroundColor: '#f9f9f9', padding: 15, borderRadius: 10, marginBottom: 15, borderWidth: 1, borderColor: '#eee' },
  button: { backgroundColor: '#104d80', padding: 15, borderRadius: 25, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});

export default AuthScreen;
