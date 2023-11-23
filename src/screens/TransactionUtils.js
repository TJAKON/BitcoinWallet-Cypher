// TransactionUtils.js
export const fetchTransactionsFromReceipt = async (blockhash, blockNumber, from, to, gasUsed) => {
    // Parse and extract relevant information from the receipt
    const parsedReceipt = {
      blockHash: blockhash,
      blockNumber: blockNumber,
      from: from,
      to: to,
      gasUsed: gasUsed,
      // Add more fields as needed
    };
  
    return parsedReceipt;
  };
  