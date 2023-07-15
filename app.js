// Get elements from the DOM
const expenseName = document.getElementById('expense-name');
const expenseAmount = document.getElementById('expense-amount');
const addExpenseButton = document.getElementById('add-expense');
const currentExpenseList = document.getElementById('current-expense-list');
const paidExpenseList = document.getElementById('paid-expense-list');

const incomeSource = document.getElementById('income-source');
const incomeAmount = document.getElementById('income-amount');
const addIncomeButton = document.getElementById('add-income');
const incomeList = document.getElementById('income-list');

const hourlyIncomeAmount = document.getElementById('hourly-income-amount');
const dailyIncomeAmount = document.getElementById('daily-income-amount');
const monthlyIncomeAmount = document.getElementById('monthly-income-amount');

let currentExpenses = [];
let paidExpenses = [];
let incomes = [];

// Load saved data from local storage
function loadSavedData() {
  const savedCurrentExpenses = localStorage.getItem('currentExpenses');
  const savedPaidExpenses = localStorage.getItem('paidExpenses');
  const savedIncomes = localStorage.getItem('incomes');

  if (savedCurrentExpenses) {
    currentExpenses = JSON.parse(savedCurrentExpenses);
  }

  if (savedPaidExpenses) {
    paidExpenses = JSON.parse(savedPaidExpenses);
  }

  if (savedIncomes) {
    incomes = JSON.parse(savedIncomes);
  }
}

// Save data to local storage
function saveData() {
  localStorage.setItem('currentExpenses', JSON.stringify(currentExpenses));
  localStorage.setItem('paidExpenses', JSON.stringify(paidExpenses));
  localStorage.setItem('incomes', JSON.stringify(incomes));
}

// Add expense
addExpenseButton.addEventListener('click', () => {
  const name = expenseName.value;
  const amount = parseFloat(expenseAmount.value);

  if (name === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid expense name and amount.');
    return;
  }

  const expense = {
    name,
    amount,
    paid: false,
  };

  currentExpenses.push(expense);
  updateExpenseList();
  updateRequiredIncome();
  saveData();

  expenseName.value = '';
  expenseAmount.value = '';
});

// Add income
addIncomeButton.addEventListener('click', () => {
  const source = incomeSource.value;
  const amount = parseFloat(incomeAmount.value);

  if (source === '' || isNaN(amount) || amount <= 0) {
    alert('Please enter a valid income source and amount.');
    return;
  }

  const income = {
    source,
    amount,
  };

  incomes.push(income);
  updateIncomeList();
  updateRequiredIncome();
  saveData();

  incomeSource.value = '';
  incomeAmount.value = '';
});

// Toggle expense status
function toggleExpenseStatus(index) {
  const expense = currentExpenses[index];
  expense.paid = !expense.paid;

  if (expense.paid) {
    paidExpenses.push(expense);
    currentExpenses.splice(index, 1);
  } else {
    currentExpenses.push(expense);
    paidExpenses.splice(index, 1);
  }

  updateExpenseList();
  updateRequiredIncome();
  saveData();
}

// Update expense list
function updateExpenseList() {
  currentExpenseList.innerHTML = '';
  paidExpenseList.innerHTML = '';

  currentExpenses.forEach((expense, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.name}: $${expense.amount.toFixed(2)}`;

    const paidButton = document.createElement('button');
    paidButton.textContent = expense.paid ? 'Paid' : 'Not Paid';
    paidButton.classList.add('paid-button');
    paidButton.addEventListener('click', () => toggleExpenseStatus(index));

    listItem.appendChild(paidButton);
    currentExpenseList.appendChild(listItem);
  });

  paidExpenses.forEach((expense) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${expense.name}: $${expense.amount.toFixed(2)}`;
    paidExpenseList.appendChild(listItem);
  });
}

// Update income list
function updateIncomeList() {
  incomeList.innerHTML = '';
  incomes.forEach((income) => {
    const listItem = document.createElement('li');
    listItem.textContent = `${income.source}: $${income.amount.toFixed(2)}`;
    incomeList.appendChild(listItem);
  });
}

// Update required income
function updateRequiredIncome() {
  const totalExpenses = currentExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const requiredMonthlyIncome = totalExpenses;
  const requiredDailyIncome = requiredMonthlyIncome / 30;
  const requiredHourlyIncome = requiredDailyIncome / 8;

  hourlyIncomeAmount.textContent = requiredHourlyIncome.toFixed(2);
  dailyIncomeAmount.textContent = requiredDailyIncome.toFixed(2);
  monthlyIncomeAmount.textContent = requiredMonthlyIncome.toFixed(2);
}

// Initialize
loadSavedData();
updateExpenseList();
updateIncomeList();
updateRequiredIncome();

// Get the save data button element
const saveDataButton = document.getElementById('save-data');

// Event listener for the save data button
saveDataButton.addEventListener('click', () => {
  exportDataToSheet();
  cleanLists();
});

// Function to export data to a sheet with the current month
function exportDataToSheet() {
  const currentDate = new Date();
  const month = currentDate.getMonth() + 1;
  const year = currentDate.getFullYear();
  const filename = `BudgetData_${month}_${year}.csv`;

  // Combine current and paid expenses
  const allExpenses = currentExpenses.concat(paidExpenses);

  // Calculate the total expenses
  const totalExpenses = allExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  // Calculate the remaining budget
  const remainingBudget = incomes.reduce((sum, income) => sum + income.amount, 0) - totalExpenses;

  // Prepare the data for export
  const data = [
    ...allExpenses.map(expense => ({ ...expense, status: expense.paid ? 'Paid' : 'Not Paid' })),
    { name: 'Total Expenses', amount: totalExpenses.toFixed(2), status: '' },
    { name: 'Remaining Budget', amount: remainingBudget.toFixed(2), status: '' }
  ];

  // Convert the data to CSV format
  const csvString = convertDataToCSV(data);

  const downloadLink = document.createElement('a');
  downloadLink.href = 'data:text/csv;charset=utf-8,' + encodeURI(csvString);
  downloadLink.download = filename;
  downloadLink.click();
}

// Function to convert data to CSV format
function convertDataToCSV(data) {
  const csvRows = [];

  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(','));

  for (const item of data) {
    const values = Object.values(item);
    const row = values.map(value => `"${value}"`);
    csvRows.push(row.join(','));
  }

  return csvRows.join('\n');
}

// Function to clean the expense and income lists
function cleanLists() {
  currentExpenses = [];
  paidExpenses = [];
  incomes = [];

  updateExpenseList();
  updateIncomeList();
  updateRequiredIncome();
  saveData();
}
