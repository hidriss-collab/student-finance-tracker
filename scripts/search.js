export function searchTransactions(transactions, query, caseSensitive = false) {
    if (query.trim() === "") {
        return transactions;
    }

    try {
        const flags = caseSensitive ? "g" : "gi";
        const pattern = new RegExp(query, flags);

        return transactions.filter(function (transaction) {
            pattern.lastIndex = 0;

            return pattern.test(transaction.description) ||
                pattern.test(transaction.category) ||
                pattern.test(String(transaction.amount)) ||
                pattern.test(transaction.date);
        });
    } catch (error) {
        return [];
    }
}