export function validateDescription(description) {
    const pattern = /^[A-Za-z0-9\s'-]{2,50}$/;
    return pattern.test(description);
}

export function validateAmount(amount) {
    return Number.isFinite(Number(amount)) && Number(amount) > 0;
}

export function validateCategory(category) {
    const allowedCategories = [
        "food",
        "books",
        "transport",
        "entertainment",
        "fees",
        "other"
    ];

    return allowedCategories.includes(category);
}

export function validateDate(date) {
    const pattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!pattern.test(date)) {
        return false;
    }

    const parts = date.split("-").map(Number);

    const year = parts[0];
    const month = parts[1];
    const day = parts[2];

    const parsedDate = new Date(year, month - 1, day);

    return (
        parsedDate.getFullYear() === year &&
        parsedDate.getMonth() === month - 1 &&
        parsedDate.getDate() === day
    );
}