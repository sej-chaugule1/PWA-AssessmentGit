
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

// Function to update the budget based on user input
function updateBudget() {
    budget = parseFloat(document.getElementById('budget').value) || 0;
    checkBudgetWarning();
}
