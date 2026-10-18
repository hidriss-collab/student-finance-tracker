import { transactions, settings } from "./state.js";

const STORAGE_KEY = "studentFinanceTracker";

export function saveData() {
    const data = {
        transactions: transactions,
        settings: settings
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadData() {
    const savedData = localStorage.getItem(STORAGE_KEY);

    if (savedData === null) {
        return null;
    }

    try {
        return JSON.parse(savedData);
    } catch (error) {
        console.error("Could not load saved data:", error);
        return null;
    }
}