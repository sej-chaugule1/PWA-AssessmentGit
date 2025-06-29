let isEditMode = false; 
let editId = null; 

const categoryInput = document.getElementById('Category');
const amountInput = document.getElementById('Amount');

categoryInput.addEventListener('change', toggleAmountInput); 

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
        if (Category && Amount && Date) {
            if (Amount < 0) {
                alert('Amount cannot be negative. Please enter a valid number.'); //Ensures only positive numbers are inputted for the amount section
                return;
            }
        }
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
        alert('Please fill in all required fields.'); //Ensures all fields are filled in, the entries will not be submitted with empty input fields
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
    const sortBy = sortSelect.value; 

    fetch(`http://localhost:3000/api/Expense?sortBy=${sortBy}`)
        .then(response => response.json())
        .then(data => {
            expenseList.innerHTML = '';
            data.forEach(log => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    <h3>${log.Category}</h3>
                    <p>Date: ${log.Date}</p>
                    <p>Amount:  $${log.Amount}</p>
                    <button onclick="editExpenseLog(${log.id})" style="background-color: #547954; border: none; border-radius: 5px; padding: 4px; font-family: 'Times New Roman', serif";>Edit</button>
                    <button onclick="deleteExpenseLog(${log.id})" style="background-color: #547954; border: none; border-radius: 5px; padding: 4px; margin-top: 10px; font-family: 'Times New Roman', serif";>Delete</button>
                `;
                expenseList.appendChild(expenseItem);
            });
        })
        .catch(error => {
            console.error('Error fetching expense log:', error);
        });
}

function editExpenseLog(id) {
    fetch(`http://localhost:3000/api/Expense/${id}`)
        .then(response => response.json())
        .then(data => {
            categoryInput.value = data.Category;
            amountInput.value = data.Amount;
            document.getElementById('Date').value = data.Date;

            isEditMode = true;
            editId = id;
            switchToEditMode(); 
            toggleAmountInput(); 
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

    if (Amount < 0) {
        alert('Amount cannot be negative. Please enter a valid number.');
        return;
    }

    if (isEditMode && editId !== null) {
        fetch(`http://localhost:3000/api/Expense/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Category, Date, Amount }),
        })
        .then(() => {
            console.log('Expense log updated');
            loadExpenseLog();
            switchToAddMode(); 
        })
        .catch(error => {
            console.error('Error updating expense log:', error);
        });
    }
}

function deleteExpenseLog(id) {
    if (confirm('Are you sure you want to delete this expense log?')) {
        fetch(`http://localhost:3000/api/Expense/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            console.log('Expense log deleted');
            loadExpenseLog(); 
        })
        .catch(error => {
            console.error('Error deleting expense log:', error);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    loadExpenseLog();
    expenseForm.onsubmit = addExpenseLog; 
    toggleAmountInput();
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