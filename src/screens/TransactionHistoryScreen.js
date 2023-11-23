import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import mobXStore from './MobXStore';


const TransactionHistoryScreen = () => {
  const transactions = mobXStore.transactionHistory;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Transaction History</Text>

      {/* Transaction history items */}
      {transactions.map((transaction) => (
        <View key={transaction.id} style={styles.transactionItem}>
          <Text style={styles.statusText}>Status: {transaction.status}</Text>
          <Text style={styles.amountText}>Amount: {transaction.amount}</Text>
          <Text style={styles.feeText}>Fee: {transaction.fee}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3498db',
  },
  transactionItem: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  statusText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2ecc71', // Green color for status
  },
  amountText: {
    fontSize: 14,
    marginBottom: 8,
  },
  feeText: {
    fontSize: 14,
    color: '#e74c3c', // Red color for fee
  },
});

export default TransactionHistoryScreen;
