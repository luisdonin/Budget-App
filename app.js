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
updateExpenseList();
updateIncomeList();
updateRequiredIncome();
