function total() {
    const expenseInputs = document.querySelectorAll('.expense-amount');
    let total = 0;

    expenseInputs.forEach(input => {
        const value = parseFloat(input.value);
        if (!isNaN(value)) {
            total += value;
        }
    });

    document.getElementById('total-spending').innerText = `$${total.toFixed(2)}`;
}

let budget = 0;

function enableAmount(selectElement) {
    // Get the corresponding expense amount input field
    const expenseInput = selectElement.parentElement.querySelector('.expense-amount');
    
    // Enable the input if a category is selected, otherwise keep it disabled
    if (selectElement.value) {
        expenseInput.disabled = false; // Enable the input field
    } else {
        expenseInput.disabled = true;  // Disable the input field
        expenseInput.value = '';       // Clear any previously entered value
    }
}
// This must stay

function createBudget() {
    const budgetSection = document.getElementById('budget-section');
    const createButton = document.getElementById('create-budget-btn');
    budgetSection.style.display = 'block'; 
    createButton.style.display = 'none'; 
}

function updateBudget() {
    const budgetInput = document.getElementById('budgetInput');
    const displayBudget = document.getElementById('display-budget');
    displayBudget.textContent = `$${parseFloat(budgetInput.value).toFixed(2)}`;

    budgetInput.style.display = 'none';
    budgetInput.previousElementSibling.style.display = 'none'; 
}

function enableAmount(selectElement) {
    const expenseInput = selectElement.parentElement.querySelector('.expense-amount');
    if (selectElement.value) {
        expenseInput.disabled = false;
    } else {
        expenseInput.disabled = true;
        expenseInput.value = '';
    }
}

function SubmitLog() {
    const date = document.getElementById('dateInput').value;
    const categories = document.querySelectorAll('.expensecategory');
    const amounts = document.querySelectorAll('.expense-amount');
    
    if (!date) {
        alert('Please select a date.');
        return;
    }

    const logs = [];
    categories.forEach((category, index) => {
        const amount = amounts[index];
        if (category.value && amount.value) {
            logs.push({
                date: date,
                category: category.value,
                amount: parseFloat(amount.value).toFixed(2),
            });
        }
    });

    if (logs.length === 0) {
        alert('Please enter at least one expense.');
        return;
    }

    // Save logs to localStorage
    const storedLogs = JSON.parse(localStorage.getItem('logs')) || [];
    storedLogs.push(...logs);
    localStorage.setItem('logs', JSON.stringify(storedLogs));

    // Redirect to entries.html
    window.location.href = 'entries.html';
}

document.addEventListener('DOMContentLoaded', function() {
    const logContainer = document.getElementById('log-container');
    const logs = JSON.parse(localStorage.getItem('logs')) || [];

    if (logs.length === 0) {
        logContainer.innerHTML = '<p>No entries found.</p>';
        return;
    }

    logs.forEach((log, index) => {
        const logDiv = document.createElement('div');
        logDiv.classList.add('log-entry');
        logDiv.innerHTML = `
            <div>
                <h2>${log.date}</h2>
                <p>Category: ${log.category}</p>
                <p>Amount: $${log.amount}</p>
            </div>
            <button onclick="deleteLog(${index})">Delete</button>
        `;
        logContainer.appendChild(logDiv);
    });
});

function deleteLog(index) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.splice(index, 1); // Remove the log at the specified index
    localStorage.setItem('logs', JSON.stringify(logs)); // Save the updated logs
    window.location.reload(); // Refresh the page to update the log list
}
