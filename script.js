// Transaction class
class Transaction {
  constructor(type, amount) {
    this.type = type;
    this.amount = amount;
  }
}

// UI class
class UI {
  static displayTransactions() {
    const transactions = Store.getTransactions();

    transactions.forEach((transaction) => UI.addTransactionToList(transaction));
  }
  
  static addTransactionToList(transaction) {
    const list = document.querySelector('#transaction-list');
  
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <span class="type ${transaction.type}">${transaction.type}</span>
      <span class="amount">$${transaction.amount}</span>
      <button class="delete">Delete</button>
    `;
    list.appendChild(listItem);
  }
  

  
  static deleteTransaction(element) {
    if (element.classList.contains('delete')) {
      element.parentElement.remove();
    }
  }
  


  static updateBalance() {
    const transactions = Store.getTransactions();

    let balance = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === 'income') {
        balance += transaction.amount;
      } else {
        balance -= transaction.amount;
      }
    });

    const balanceAmount = document.querySelector('#balance-amount');
    balanceAmount.textContent = `$${balance.toFixed(2)}`;
  }

  static showAlert(message, className) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert ${className}`;
    alertDiv.appendChild(document.createTextNode(message));

    const container = document.querySelector('.container');
    const form = document.querySelector('.add-transaction');
    container.insertBefore(alertDiv, form);

    // Remove alert after 3 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector('#transaction-type').value = 'income';
    document.querySelector('#transaction-amount').value = '';
  }
}

// Store class
class Store {
  static getTransactions() {
    let transactions = localStorage.getItem('transactions');
    return transactions ? JSON.parse(transactions) : [];
  }

  static addTransaction(transaction) {
    let transactions = Store.getTransactions();
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }

  static removeTransaction(transaction) {
    let transactions = Store.getTransactions();
    transactions = transactions.filter(
      (t) => !(t.type === transaction.type && t.amount === transaction.amount)
    );
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }
}

// Event: Display transactions
document.addEventListener('DOMContentLoaded', UI.displayTransactions);

// Event: Add transaction
document.querySelector('#add-transaction-btn').addEventListener('click', (e) => {
  e.preventDefault();

  const type = document.querySelector('#transaction-type').value;
  const amount = parseFloat(document.querySelector('#transaction-amount').value);

  if (type === '' || isNaN(amount) || amount <= 0) {
    UI.showAlert('Please enter valid values', 'error');
  } else {
    const transaction = new Transaction(type, amount);
    UI.addTransactionToList(transaction);
    Store.addTransaction(transaction);
    UI.updateBalance();
    UI.showAlert('Transaction added', 'success');
    UI.clearFields();
  }
});

// Event: Delete transaction
document.querySelector('#transaction-list').addEventListener('click', (e) => {
  if (e.target.classList.contains('delete')) {
    const listItem = e.target.parentElement;
    const type = listItem.querySelector('.type').textContent;
    const amount = parseFloat(listItem.querySelector('.amount').textContent.replace('$', ''));
    const transaction = new Transaction(type, amount);
    listItem.remove();
    Store.removeTransaction(transaction);
    UI.updateBalance();
    UI.showAlert('Transaction removed', 'success');
  }
});

