let isEditMode = false; // Track whether we're in edit mode
let editId = null; // Store the ID of the session being edited

function addExpenseLog(event) {
    event.preventDefault();

    const Category = document.getElementById('Category').value;
    const Amount = document.getElementById('Amount').value;
    const Date = document.getElementById('Date').value;

    // Ensure all fields are filled out
    if (Category && Amount && Date) {
        if (!isEditMode) { // Add only if not in edit mode
            fetch('http://localhost:3001/api/Expense', {
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
                expenseForm.reset(); // Clear the form fields
                switchToAddMode(); // Reset to add mode after adding
            })
            .catch(error => {
                console.error('Error:', error);
            });
        } else {
            updateExpenseLog(event); // If in edit mode, call update function
        }
    } else {
        alert('Please fill in all required fields.');
    }
}

// Function to switch to "Add" mode
function switchToAddMode() {
    isEditMode = false;
    editId = null;
    document.querySelector('button[type="submit"]').textContent = 'Add Expense log';
    expenseForm.reset(); // Clear form fields
}

// Function to switch to "Edit" mode
function switchToEditMode() {
    isEditMode = true;
    document.querySelector('button[type="submit"]').textContent = 'Update Expense log';
}

function loadExpenseLog() {
    fetch('http://localhost:3001/api/Expense')
        .then(response => response.json())
        .then(data => {
            expenseList.innerHTML = ''; // Clear the existing list
            data.forEach(log => {
                const expenseItem = document.createElement('div');
                expenseItem.className = 'expense-item';
                expenseItem.innerHTML = `
                    <h3>${log.Category}</h3>
                    <p>Date: ${log.Date}</p>
                    <p>Amount: ${log.Amount} minutes</p>
                    <button onclick="editExpenseLog(${log.id})">Edit</button>
                    <button onclick="deleteExpenseLog(${log.id})">Delete</button>
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
    fetch(`http://localhost:3001/api/Expense/${id}`)
        .then(response => response.json())
        .then(data => {
            // Populate the form with the existing data
            document.getElementById('Category').value = data.Category;
            document.getElementById('Amount').value = data.Amount;
            document.getElementById('Date').value = data.Date;

            // Set the form to update mode
            isEditMode = true;
            editId = id;
            switchToEditMode(); // Switch to edit mode
        })
        .catch(error => {
            console.error('Error fetching expense log:', error);
        });
}

function updateExpenseLog(event) {
    event.preventDefault();

    const Category = document.getElementById('Category').value;
    const Amount = document.getElementById('Amount').value;
    const Date = document.getElementById('Date').value;

    if (isEditMode && editId !== null) {
        // Send a PUT request to update the study session
        fetch(`http://localhost:3001/api/Expense/${editId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ Category, Date, Amount }),
        })
        .then(() => {
            console.log('Expense log updated');
            loadExpenseLog(); // Reload the list of study sessions
            switchToAddMode(); // Switch back to "Add" mode
        })
        .catch(error => {
            console.error('Error updating expense log:', error);
        });
    }
}

// Function to delete a study session
function deleteExpenseLog(id) {
    if (confirm('Are you sure you want to delete this expense log?')) {
        fetch(`http://localhost:3001/api/Expense/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            console.log('Expense log deleted');
            loadExpenseLog(); // Reload the list of study sessions
        })
        .catch(error => {
            console.error('Error deleting expense log:', error);
        });
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadExpenseLog(); // Load study sessions when the page loads
    expenseForm.onsubmit = addExpenseLog; // Set default form submission to add mode
});
