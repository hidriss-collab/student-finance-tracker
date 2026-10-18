import { transactions, settings } from "./state.js";

import { saveData, loadData } from "./storage.js";

import {
    validateDescription,
    validateAmount,
    validateCategory,
    validateDate,
    validDuplicateWords
} from "./validators.js";

import { searchTransactions } from "./search.js";

import {
    displayTransactions,
    updateDashboard,
    drawSpendingChart
} from "./ui.js";

let editingTransactionId = null;
const settingsForm = document.getElementById("settings-form");

settingsForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const baseCurrency = document.getElementById("base-currency").value;
    const usdRate = Number(document.getElementById("usd-rate").value);
    const eurRate = Number(document.getElementById("eur-rate").value);
    const budget = Number(document.getElementById("monthly-budget").value);

    if (!Number.isFinite(usdRate) || usdRate <= 0 ||
        !Number.isFinite(eurRate) || eurRate <= 0 ||
        !Number.isFinite(budget) || budget <= 0) {
        alert("Exchange rates and budget must be greater than zero.");
        return;
    }

    settings.baseCurrency = baseCurrency;
    settings.usdRate = usdRate;
    settings.eurRate = eurRate;
    settings.budget = budget;

    saveData();
    refreshPage();

    alert("Settings saved successfully!");
});

const savedData = loadData();

if (savedData) {
    if (Array.isArray(savedData.transactions)) {
        transactions.push(...savedData.transactions);
    }

    if (savedData.settings && typeof savedData.settings === "object") {
        Object.assign(settings, savedData.settings);
    }
}
document.getElementById("monthly-budget").value = settings.budget;
document.getElementById("base-currency").value = settings.baseCurrency;
document.getElementById("usd-rate").value = settings.usdRate;
document.getElementById("eur-rate").value = settings.eurRate;

function refreshPage() {
    displayTransactions(transactions);
    updateDashboard(transactions);
    drawSpendingChart(transactions);
}

refreshPage();

const menuButton = document.getElementById("menu-toggle");
const sidebar = document.getElementById("sidebar");

menuButton.addEventListener("click", function () {
    sidebar.classList.toggle("is-open");

    menuButton.setAttribute(
        "aria-expanded",
        sidebar.classList.contains("is-open")
    );
});

const navLinks = document.querySelectorAll(".sidebar-nav a");

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        sidebar.classList.remove("is-open");
        menuButton.setAttribute("aria-expanded", "false");
    });
});

const transactionForm = document.getElementById("transaction-form");

transactionForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const description = document.getElementById("description").value.trim();
    const amount = document.getElementById("amount").value;
    const category = document.getElementById("category").value;
    const date = document.getElementById("transaction-date").value;

    if (!validateDescription(description)) {
        alert("Description must be 2–50 characters and contain only letters, numbers, spaces, apostrophes, or hyphens.");
        return;
    }
    if (!validDuplicateWords(description)) {
        alert("Please avoid repeating the same word twice in a row.");
        return;
    }

    if (!validateAmount(amount)) {
        alert("Please enter an amount greater than zero.");
        return;
    }

    if (!validateCategory(category)) {
        alert("Please select a valid category.");
        return;
    }

    if (!validateDate(date)) {
        alert("Please enter a valid date.");
        return;
    }

    if (editingTransactionId !== null) {
        const index = transactions.findIndex(function (transaction) {
            return transaction.id === editingTransactionId;
        });

        if (index === -1) {
            alert("Transaction not found.");
            editingTransactionId = null;
            return;
        }

        transactions[index] = {
            ...transactions[index],
            description: description,
            amount: Number(amount),
            category: category,
            date: date,
            updatedAt: new Date().toISOString()
        };
    } else {
        const transaction = {
            id: crypto.randomUUID(),
            description: description,
            amount: Number(amount),
            category: category,
            date: date,
            createdAt: new Date().toISOString()
        };

        transactions.push(transaction);
        saveData();
        refreshPage();
        transactionForm.reset();
        editingTransactionId = null;
        document.getElementById("search-input").value = "";
        alert("Transaction saved successfully!");
        return;
    }
});

const searchInput = document.getElementById("search-input");
const sortSelect = document.getElementById("sort-transactions");

function applyFilters() {
    let results = searchTransactions(
        transactions,
        searchInput.value
    );

    const sortOption = sortSelect.value;

    if (sortOption === "date-desc") {
        results.sort((a, b) => b.date.localeCompare(a.date));
    }
    else if (sortOption === "date-asc") {
        results.sort((a, b) => a.date.localeCompare(b.date));
    }
    else if (sortOption === "amount-desc") {
        results.sort((a, b) => Number(b.amount) - Number(a.amount));
    }
    else if (sortOption === "amount-asc") {
        results.sort((a, b) => Number(a.amount) - Number(b.amount));
    }
    else if (sortOption === "description-asc") {
        results.sort((a, b) =>
            a.description.toLowerCase().localeCompare(b.description.toLowerCase())
        );
    }

    displayTransactions(results);
}

searchInput.addEventListener("input", applyFilters);
sortSelect.addEventListener("change", applyFilters);

const tableBody = document.getElementById("transactions-table-body");

tableBody.addEventListener("click", function (event) {
    const button = event.target.closest("button");

    if (!button || !tableBody.contains(button)) {
        return;
    }

    const id = button.dataset.id;

    if (button.classList.contains("delete-button")) {
        const confirmed = confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) {
            return;
        }

        const index = transactions.findIndex(function (transaction) {
            return transaction.id === id;
        });

        if (index !== -1) {
            if (editingTransactionId === id) {
                editingTransactionId = null;
                transactionForm.reset();
            }

            transactions.splice(index, 1);

            saveData();
            refreshPage();

            alert("Transaction deleted successfully.");
        }
    }

    if (button.classList.contains("edit-button")) {
        const transaction = transactions.find(function (item) {
            return item.id === id;
        });

        if (!transaction) {
            return;
        }

        editingTransactionId = id;

        document.getElementById("description").value =
            transaction.description;

        document.getElementById("amount").value =
            transaction.amount;

        document.getElementById("category").value =
            transaction.category;

        document.getElementById("transaction-date").value =
            transaction.date;

        document.getElementById("add-transaction").scrollIntoView({
            behavior: "smooth"
        });

        document.getElementById("description").focus();
    }
});

const exportButton = document.getElementById("export-button");

exportButton.addEventListener("click", function () {
    const data = {
        transactions: transactions,
        settings: settings
    };

    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-finance-data.json";

    link.click();

    URL.revokeObjectURL(url);
});

const importButton = document.getElementById("import-button");
const importFile = document.getElementById("import-file");

importButton.addEventListener("click", function () {
    importFile.click();
});

importFile.addEventListener("change", async function () {
    const file = importFile.files[0];

    if (!file) {
        return;
    }

    try {
        const text = await file.text();
        const importedData = JSON.parse(text);

        if (!Array.isArray(importedData.transactions)) {
            throw new Error("The file must contain a transactions array.");
        }

        const validTransactions = importedData.transactions.every(function (t) {
            return t &&
                typeof t.id === "string" &&
                validateDescription(t.description) &&
                validateAmount(t.amount) &&
                validateCategory(t.category) &&
                validateDate(t.date);
        });

        if (!validTransactions) {
            throw new Error("The file contains invalid transactions.");
        }

        if (importedData.settings !== undefined) {
            const s = importedData.settings;

            if (
                !s ||
                !["RWF", "USD", "EUR"].includes(s.baseCurrency) ||
                !Number.isFinite(Number(s.usdRate)) ||
                Number(s.usdRate) <= 0 ||
                !Number.isFinite(Number(s.eurRate)) ||
                Number(s.eurRate) <= 0
            ) {
                throw new Error("The file contains invalid settings.");
            }
        }

        if (!confirm("Import this file and replace your current data?")) {
            return;
        }

        transactions.splice(0, transactions.length, ...importedData.transactions);

        if (importedData.settings) {
            Object.assign(settings, importedData.settings);
        }

        saveData();
        refreshPage();

        alert("Data imported successfully!");
    } catch (error) {
        alert("Import failed: " + error.message);
    } finally {
        importFile.value = "";
    }
});
