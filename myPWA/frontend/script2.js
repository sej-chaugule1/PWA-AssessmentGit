let isEditMode = false; // Track whether we're in edit mode
let editId = null; // Store the ID of the session being edited

// Get the category and amount elements
const categoryInput = document.getElementById('Category');
const amountInput = document.getElementById('Amount');

categoryInput.addEventListener('change', toggleAmountInput); // Listen for category changes

function toggleAmountInput() {
    if (categoryInput.value) {
        amountInput.disabled = false; 
    } else {
        amountInput.disabled = true; 
    }
}

function addExpenseLog(event) {
    event.preventDefault();

    const Category = categoryInput.value;
    const Amount = amountInput.value;
    const Date = document.getElementById('Date').value;

    if (Category && Amount && Date) {
        if (!isEditMode) { 
            fetch('http://localhost:3000/api/Expense', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Category, Date, Amount }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Expense log added:', data);
                loadExpenseLog(); 
                expenseForm.reset(); 
                switchToAddMode(); 
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            updateExpenseLog(event); 
        }
    } else {
        alert('Please fill in all required fields.');
    }
}

function switchToAddMode() {
    isEditMode = false;
    editId = null;
    document.querySelector('button[type="submit"]').textContent = 'Submit';
    expenseForm.reset();
    toggleAmountInput(); 
}

function switchToEditMode() {
    isEditMode = true;
    document.querySelector('button[type="submit"]').textContent = 'Update';
}

const sortSelect = document.getElementById('SortBy');

sortSelect.addEventListener('change', loadExpenseLog);

function loadExpenseLog() {
    const sortBy = sortSelect.value; // Get the selected sorting criterion

    fetch(`http://localhost:3000/api/Expense?sortBy=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            expenseList.innerHTML = ''; // Clear the existing list
            data.forEach(log => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    <h3>${log.Category}</h3>
                    <p>Date: ${log.Date}</p>
                    <p>Amount:  $${log.Amount}</p>
                    <button onclick="editExpenseLog(${log.id})" style="background-color: rgb(254, 113, 113); border: none; border-radius: 5px; padding: 4px;">Edit</button>
                    <button onclick="deleteExpenseLog(${log.id})" style="background-color: rgb(254, 113, 113); border: none; border-radius: 5px; padding: 4px; margin-top: 10px;">Delete</button>
                `;
                expenseList.appendChild(expenseItem);
            });
        })
        .catch(error => {
            console.error('Error fetching expense log:', error);
        });
}

function editExpenseLog(id) {
    // Retrieve the current session details
    fetch(`http://localhost:3000/api/Expense/${id}`)
        .then(response => response.json())
        .then(data => {
            // Populate the form with the existing data
            categoryInput.value = data.Category;
            amountInput.value = data.Amount;
            document.getElementById('Date').value = data.Date;

            // Set the form to update mode
            isEditMode = true;
            editId = id;
            switchToEditMode(); // Switch to edit mode
            toggleAmountInput(); // Ensure amount input is enabled
        })
        .catch(error => {
            console.error('Error fetching expense log:', error);
        });
}

function updateExpenseLog(event) {
    event.preventDefault();

    const Category = categoryInput.value;
    const Amount = amountInput.value;
    const Date = document.getElementById('Date').value;

    if (isEditMode && editId !== null) {
        // Send a PUT request to update the expense log
        fetch(`http://localhost:3000/api/Expense/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Category, Date, Amount }),
        })
        .then(() => {
            console.log('Expense log updated');
            loadExpenseLog(); // Reload the list of expense logs
            switchToAddMode(); // Switch back to "Add" mode
        })
        .catch(error => {
            console.error('Error updating expense log:', error);
        });
    }
}

// Function to delete an expense log
function deleteExpenseLog(id) {
    if (confirm('Are you sure you want to delete this expense log?')) {
        fetch(`http://localhost:3000/api/Expense/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            console.log('Expense log deleted');
            loadExpenseLog(); // Reload the list of expense logs
        })
        .catch(error => {
            console.error('Error deleting expense log:', error);
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadExpenseLog(); // Load expense logs when the page loads
    expenseForm.onsubmit = addExpenseLog; // Set default form submission to add mode
    toggleAmountInput(); // Ensure the amount input is initially disabled if no category is selected
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/myPWA/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}