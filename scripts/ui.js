import { settings } from "./state.js";

function convertCurrency(amount) {
    if (settings.baseCurrency === "USD") {
        return amount / settings.usdRate;
    }

    if (settings.baseCurrency === "EUR") {
        return amount / settings.eurRate;
    }

    return amount;
}

export function displayTransactions(transactions) {
    const tableBody = document.getElementById("transactions-table-body");

    tableBody.innerHTML = "";

    if (transactions.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="5">No transactions found.</td>
            </tr>
        `;
        return;
    }

    transactions.forEach(function (transaction) {
        const row = document.createElement("tr");
        const convertedAmount = convertCurrency(Number(transaction.amount));

        row.innerHTML = `
            <td>${escapeHTML(transaction.description)}</td>
            <td>${convertedAmount.toFixed(2)} ${settings.baseCurrency}</td>
            <td>${escapeHTML(transaction.category)}</td>
            <td>${escapeHTML(transaction.date)}</td>
            <td>
                <button type="button" class="edit-button"
                    data-id="${escapeHTML(transaction.id)}">Edit</button>
                <button type="button" class="delete-button"
                    data-id="${escapeHTML(transaction.id)}">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

export function updateDashboard(transactions) {
    const totalTransactions = transactions.length;

    const totalSpendingRWF = transactions.reduce(function (total, transaction) {
        return total + Number(transaction.amount);
    }, 0);

    const totalSpending = convertCurrency(totalSpendingRWF);

    const categoryTotals = {};

    transactions.forEach(function (transaction) {
        const category = transaction.category;

        categoryTotals[category] =
            (categoryTotals[category] || 0) + Number(transaction.amount);
    });

    let topCategory = "None";
    let highestAmount = 0;

    for (const category in categoryTotals) {
        if (categoryTotals[category] > highestAmount) {
            highestAmount = categoryTotals[category];
            topCategory = category;
        }
    }

    document.getElementById("total-transactions").textContent =
        totalTransactions;

    document.getElementById("total-spending").textContent =
        totalSpending.toFixed(2) + " " + settings.baseCurrency;

    document.getElementById("top-category").textContent = topCategory;

    document.getElementById("budget-remaining").textContent =
        (Number(settings.budget) - totalSpending).toFixed(2) + " " +
        settings.baseCurrency;

    const budgetStatus = document.getElementById("budget-status");

    if (totalSpending >= Number(settings.budget)) {
        budgetStatus.textContent =
            "Warning: You have reached or exceeded your budget.";
    } else {
        budgetStatus.textContent = "Your budget is on track.";
    }
}

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];
    });
}

export function drawSpendingChart(transactions) {
    const canvas = document.getElementById("spending-chart");

    if (!canvas) return;

    const context = canvas.getContext("2d");
    const width = canvas.clientWidth || 500;
    const height = 220;

    canvas.width = width;
    canvas.height = height;

    context.clearRect(0, 0, width, height);

    const days = [];

    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const key =
            date.getFullYear() + "-" +
            String(date.getMonth() + 1).padStart(2, "0") + "-" +
            String(date.getDate()).padStart(2, "0");

        days.push({
            date: key,
            label: key.slice(5),
            total: 0
        });
    }

    transactions.forEach(function (transaction) {
        const day = days.find(item => item.date === transaction.date);

        if (day) {
            day.total += Number(transaction.amount);
        }
    });

   
    days.forEach(function (day) {
        day.total = convertCurrency(day.total);
    });

    const maximum = Math.max(...days.map(day => day.total), 1);
    const chartHeight = 150;
    const barWidth = Math.max(8, (width - 50) / 7 - 10);
    const gap = (width - 50 - barWidth * 7) / 6;

    context.font = "11px Arial";
    context.textAlign = "center";

    days.forEach(function (day, index) {
        const x = 30 + index * (barWidth + gap);
        const barHeight = (day.total / maximum) * chartHeight;
        const y = chartHeight - barHeight + 10;

        context.fillStyle = "#14532D";
        context.fillRect(x, y, barWidth, barHeight);

        context.fillStyle = "#202820";
        context.fillText(day.label, x + barWidth / 2, 185);
        context.fillText(
            day.total.toFixed(2),
            x + barWidth / 2,
            Math.max(10, y - 5)
        );
    });
}