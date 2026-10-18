# Student Finance Tracker

## 1. Project Overview

The Student Finance Tracker is a responsive web application that helps students manage their expenses, track spending, and monitor their monthly budgets.

The application allows users to record transactions, organize expenses into categories, search and sort records, and monitor financial activity through a dashboard.

## 2. Features

### Transaction Management
- Add, edit, and delete transactions.
- Validate descriptions, amounts, categories, and dates.
- Detect consecutive duplicate words using regular expressions.

### Search and Sorting
- Search transactions using regular expressions.
- Highlight matching search results.
- Support case-sensitive and case-insensitive searching.
- Sort transactions by date, description, and amount.
- Handle invalid regular expressions safely.

### Financial Dashboard
- Display the total number of transactions.
- Calculate total spending.
- Identify the top spending category.
- Display the remaining monthly budget.
- Visualize spending trends over the last seven days.
- Display budget warnings when spending exceeds the configured budget.

### Currency Conversion
- Support RWF, USD, and EUR.
- Configure exchange rates manually.
- Convert displayed amounts using the selected base currency.

### Data Management
- Automatically save transactions and settings in localStorage.
- Import transaction data from JSON files.
- Export transaction data as JSON.
- Include sample transaction records in `seed.json`.

### Accessibility and Responsive Design
- Use semantic HTML elements.
- Provide labels for form controls.
- Support keyboard navigation.
- Provide visible focus indicators.
- Use accessible status messages.
- Adapt the interface to different screen sizes.

## 3. Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- JavaScript ES Modules
- Regular Expressions
- Browser localStorage
- JSON
- HTML Canvas

## 4. Project Structure

```text
student-finance-tracker/
├── index.html
├── tests.html
├── seed.json
├── README.md
├── styles/
│   └── style.css
└── scripts/
    ├── app.js
    ├── state.js
    ├── storage.js
    ├── ui.js
    ├── validators.js
    └── search.js

File Descriptions
index.html: Contains the application structure and interface.
styles/style.css: Contains styling and responsive layouts.
scripts/app.js: Handles application events and coordinates functionality.
scripts/state.js: Stores application state and settings.
scripts/storage.js: Handles saving and loading data.
scripts/ui.js: Displays transactions, statistics, and the spending chart.
scripts/validators.js: Contains input validation functions.
scripts/search.js: Handles transaction searching.
tests.html: Provides automated JavaScript tests.
seed.json: Contains sample transaction data.
5. Transaction Data Model

Each transaction contains the following fields:

Field	Description
id	Unique transaction identifier
description	Transaction description
amount	Transaction amount
category	Transaction category
date	Transaction date
createdAt	Creation timestamp
updatedAt	Last modification timestamp

Application settings include the base currency, exchange rates, and monthly budget.

6. Regular Expression Catalog
6.1 Description Validation

Pattern:

/^[A-Za-z0-9\s'-]{2,50}$/

Purpose:

Allows letters, numbers, spaces, apostrophes, and hyphens.
Requires a description between 2 and 50 characters.

Examples:

Valid: Lunch at Cafe
Valid: Bus Ticket 25
Invalid: A
Invalid: Lunch@Cafe
6.2 Amount Validation

The application checks that the amount is a finite number greater than zero.

Examples:

Valid: 1500
Valid: 25.50
Invalid: 0
Invalid: -100
6.3 Category Validation

The application accepts these categories:

Food
Books
Transport
Entertainment
Fees
Other
6.4 Date Validation

Pattern:

/^\d{4}-\d{2}-\d{2}$/

Purpose:

Requires the YYYY-MM-DD format.
Additional checks verify that the date exists.

Examples:

Valid: 2026-10-18
Invalid: 2026-02-30
6.5 Consecutive Duplicate-Word Validation

Pattern:

/\b(\w+)\s+\1\b/i

Purpose:

Detects consecutive repeated words.
Uses a capturing group and a backreference.
The i flag makes matching case-insensitive.

Examples:

Invalid: Lunch Lunch
Invalid: Food food
Valid: Lunch at Cafe
6.6 Transaction Search

Regular expressions are used to search transaction descriptions, categories, amounts, and dates.

The search functionality supports:

Case-sensitive and case-insensitive matching.
Highlighting matching text.
Handling invalid regular expressions.
7. How to Run the Application
Open the project folder in Visual Studio Code.
Install the Live Server extension if necessary.
Open index.html.
Right-click inside the editor.
Select Open with Live Server.
The application will open in your browser.

The application uses JavaScript ES Modules, so it should be opened through an HTTP server rather than directly through a file:// URL.

8. Testing
Automated Tests
Start Live Server or another local HTTP server.
Open tests.html in your browser.
Review the test results.

The automated tests cover:

Description validation.
Amount validation.
Category validation.
Date validation.
Duplicate-word detection.

Eight automated tests have passed successfully.

Manual Testing

Test the following features:

Add a transaction.
Edit a transaction.
Delete a transaction.
Test invalid descriptions, amounts, categories, and dates.
Test regular-expression searching.
Test case-sensitive and case-insensitive searching.
Verify search-result highlighting.
Sort transactions by date, description, and amount.
Change the monthly budget.
Change the base currency and exchange rates.
Refresh the page and verify that transactions and settings remain saved.
Export transaction data to JSON.
Import valid JSON data.
Test invalid JSON imports.
Check the layout at different screen sizes.
Navigate using the keyboard.
9. Data Persistence and JSON
localStorage

The application stores transactions and settings in browser localStorage. Saved data remains available after refreshing the page in the same browser and website origin, provided the stored data is not cleared.

JSON Import and Export

Users can export transaction data as JSON and import transaction data from JSON files.

Sample Data

The seed.json file contains sample transaction records for testing. The file is separate from localStorage and does not automatically populate the application unless an import mechanism is used.

10. Keyboard Accessibility
Key	Function
Tab	Move to the next interactive element
Shift + Tab	Move to the previous interactive element
Enter	Activate links and buttons when supported
Space	Activate buttons and checkboxes when supported
Escape	Close dismissible interfaces when supported

Visible focus indicators and semantic HTML help users navigate the application.

11. Responsive Design

The application uses CSS Flexbox and media queries to adapt to different screen sizes.

Responsive design features include:

Sidebar navigation.
Flexible layouts.
Responsive forms and dashboard components.
Adaptations for mobile, tablet, and desktop screens.
12. Limitations
Exchange rates are entered manually.
The application does not automatically retrieve current exchange rates.
Transaction data is stored locally in the browser.
Data is not synchronized between different browsers or devices.
Clearing browser storage can remove saved data.
The application does not connect directly to bank accounts.
13. Project Links

GitHub Repository:

https://github.com/hidriss-collab/student-finance-tracker

Live Website:
https://hidriss-collab.github.io/student-finance-tracker

14. Project Summary

The Student Finance Tracker demonstrates responsive web design, semantic HTML, CSS layouts, JavaScript DOM manipulation, regular expressions, form validation, localStorage, JSON data handling, and accessibility.

The application provides students with a simple interface for recording expenses, organizing transactions, monitoring spending, and managing a monthly budget.
https://canva.link/nvca5jzrm5ygon1 this is the demo video
