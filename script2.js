
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
    const amountInput = selectElement.closest('.expenseitem').querySelector('.expense-amount');
    
    if (selectElement.value) {
        amountInput.disabled = false;
    } else {
        amountInput.disabled = true;
    }
}

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

function addlog() {
    // Get input values
    const dateInput = document.getElementById("dateInput").value;
    const budgetInput = parseFloat(document.getElementById("budgetInput").value || 0);
    const expenseItems = document.querySelectorAll(".expenseitem");
    
    // Prepare log data
    let totalSpending = 0;
    let expensesDetails = [];
    
    expenseItems.forEach(item => {
        const category = item.querySelector(".expensecategory").value;
        const amount = parseFloat(item.querySelector(".expense-amount").value || 0);
        if (category && amount) {
            expensesDetails.push(`${category}: $${amount.toFixed(2)}`);
            totalSpending += amount;
        }
    });

    if (!dateInput) {
        alert("Please select a date before submitting.");
        return;
    }

    if (expensesDetails.length === 0) {
        alert("Please enter at least one expense.");
        return;
    }

    // Create log object
    const log = {
        date: dateInput,
        budget: budgetInput,
        totalSpending: totalSpending,
        expensesDetails: expensesDetails
    };

    // Store the log in Local Storage
    let logs = JSON.parse(localStorage.getItem("logs")) || [];
    logs.push(log);
    localStorage.setItem("logs", JSON.stringify(logs));

    // Clear form inputs
    document.getElementById("budgetInput").value = "";
    document.getElementById("dateInput").value = "";
    expenseItems.forEach(item => {
        item.querySelector(".expensecategory").selectedIndex = 0;
        item.querySelector(".expense-amount").value = "";
        item.querySelector(".expense-amount").disabled = true;
    });

    alert("Log successfully added!");
}

