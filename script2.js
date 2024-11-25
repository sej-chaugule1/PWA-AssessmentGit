
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

