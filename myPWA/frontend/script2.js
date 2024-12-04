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
    let hasError = false;

    categories.forEach((category, index) => {
        const amount = amounts[index];
        const amountValue = parseFloat(amount.value);

        if (!category.value || !amount.value) {
            return; // Skip empty category or amount
        }

        if (isNaN(amountValue) || amountValue < 0) {
            // Show a validation message if input is invalid
            alert(`Invalid input detected for category "${category.value || 'Unknown'}". Please enter a positive number.`);
            hasError = true;
            return;
        }

        logs.push({
            date: date,
            category: category.value,
            amount: amountValue.toFixed(2),
        });
    });

    if (hasError) {
        // Prevent submission if there was an error
        return;
    }

    if (logs.length === 0) {
        alert('Please enter at least one valid expense.');
        return;
    }

    // Save logs to localStorage
    const storedLogs = JSON.parse(localStorage.getItem('logs')) || [];
    storedLogs.push(...logs);
    localStorage.setItem('logs', JSON.stringify(storedLogs));

    // Redirect to entries.html
    window.location.href = 'entries.html';
}


document.addEventListener('DOMContentLoaded', function () {
    const logContainer = document.getElementById('log-container');
    const logs = JSON.parse(localStorage.getItem('logs')) || [];

    // Clear the container before rendering
    logContainer.innerHTML = '';

    if (logs.length === 0) {
        // Display the "No entries made" message
        const noEntriesMessage = document.createElement('div');
        noEntriesMessage.classList.add('no-entries');
        noEntriesMessage.innerHTML = `<h2>No entries made</h2>`;
        logContainer.appendChild(noEntriesMessage);
    } else {
        // Group logs by date
        const groupedLogs = logs.reduce((acc, log) => {
            if (!acc[log.date]) {
                acc[log.date] = [];
            }
            acc[log.date].push(log);
            return acc;
        }, {});

        for (const date in groupedLogs) {
            const dateLogs = groupedLogs[date];
            const totalSpending = dateLogs.reduce((sum, log) => sum + parseFloat(log.amount), 0);

            const dateContainer = document.createElement('div');
            dateContainer.classList.add('date-container');
            dateContainer.innerHTML = `<h2>Date: ${date}</h2>`;

            const totalDiv = document.createElement('div');
            totalDiv.classList.add('total-spending');
            totalDiv.innerHTML = `<p>Total Spending: $${totalSpending.toFixed(2)}</p>`;
            dateContainer.appendChild(totalDiv);

            dateLogs.forEach((log, index) => {
                const logDiv = document.createElement('div');
                logDiv.classList.add('log-entry');
                logDiv.innerHTML = `
                    <div class="log">
                        <p>Category: ${log.category}</p>
                        <p>Amount: $${parseFloat(log.amount).toFixed(2)}</p>
                        <button onclick="deleteLog(${index}, '${log.date}')">Delete</button>
                        <button onclick="editLog(${index}, '${log.date}')">Edit</button>
                    </div>
                `;
                dateContainer.appendChild(logDiv);
            });

            logContainer.appendChild(dateContainer);
        }
    }
});

document.querySelectorAll('.expense-amount').forEach(input => {
    input.addEventListener('input', function () {
        const value = input.value;
        if (isNaN(value) || parseFloat(value) < 0) {
            // Show a real-time message to the user for invalid input
            input.setCustomValidity('Please enter a valid input.');
        } else {
            input.setCustomValidity(''); // Clear the message for valid input
        }
    });
});

function renderLogs() {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    const logsContainer = document.getElementById('logsContainer');
    logsContainer.innerHTML = logs.map((log, index) => `
        <div class="log-entry" data-index="${index}">
            <p>Category: ${log.category}</p>
            <p>Amount: $${log.amount}</p>
            <p>Date: ${log.date}</p>
            <button onclick="editLog(${index}, '${log.date}')" style = "background-color: rgb(254, 113, 113); border: none; border-radius: 5px; padding: 4px;">Edit</button>
            <button onclick="deleteLog(${index})" style = "margin-left: 105px; background-color: rgb(254, 113, 113); border: none; border-radius: 5px; padding: 4px;">Delete</button>
        </div>
    `).join('');
}

function editLog(index, date) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    const logToEdit = logs[index];

    if (!logToEdit) return;

    const logContainer = document.querySelector(`.log-entry[data-index="${index}"]`);

    if (!logContainer) return;

    logContainer.innerHTML = `
        <form id="editLogForm" onsubmit="saveLog(event, ${index}, '${date}')" style="display: flex; flex-direction: column; gap: 5px;">
            <label for="editCategory">Category:</label>
            <select id="editCategory" required>
                <option value="Groceries" ${logToEdit.category === 'Groceries' ? 'selected' : ''}>Groceries</option>
                <option value="Transportation" ${logToEdit.category === 'Transportation' ? 'selected' : ''}>Transportation</option>
                <option value="Entertainment" ${logToEdit.category === 'Entertainment' ? 'selected' : ''}>Entertainment</option>
                <option value="Utilities" ${logToEdit.category === 'Utilities' ? 'selected' : ''}>Utilities</option>
                <option value="Healthcare" ${logToEdit.category === 'Healthcare' ? 'selected' : ''}>Healthcare</option>
            </select>
            <label for="editAmount">Amount:</label>
            <input type="number" id="editAmount" value="${logToEdit.amount}" required />
            <label for="editDate">Date:</label>
            <input type="date" id="editDate" value="${logToEdit.date}" required />
            <button type="submit" style = "background-color: rgb(254, 113, 113); border: none; border-radius: 5px; padding: 4px; margin-top: 10px;">Save</button>
            <button type="button" onclick="cancelEdit(${index})" style = "background-color: rgb(254, 113, 113); border: none; border-radius: 5px; padding: 4px;">Cancel</button>
        </form>
    `;
}

function saveLog(event, index, date) {
    event.preventDefault();

    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    const editedCategory = document.getElementById('editCategory').value;
    const editedAmount = document.getElementById('editAmount').value;
    const editedDate = document.getElementById('editDate').value;

    logs[index] = { category: editedCategory, amount: editedAmount, date: editedDate };
    localStorage.setItem('logs', JSON.stringify(logs));

    renderLogs(); 
}

window.onload = renderLogs;

function saveLog(event, index, originalDate) {
    event.preventDefault();

    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    const editCategory = document.getElementById('editCategory').value;
    const editAmount = parseFloat(document.getElementById('editAmount').value).toFixed(2);
    const editDate = document.getElementById('editDate').value;

    logs[index] = { date: editDate, category: editCategory, amount: editAmount };

    localStorage.setItem('logs', JSON.stringify(logs));

    window.location.reload();
}

function cancelEdit() {
    window.location.reload();
}

function deleteLog(index) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    
    if (confirm("Are you sure you want to delete this log?")) {
        logs.splice(index, 1); 
        localStorage.setItem('logs', JSON.stringify(logs)); 
        renderLogs(); 
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    addLog(category, amount, date);
}
