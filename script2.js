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

        // Iterate through each date's logs
        for (const date in groupedLogs) {
            const dateLogs = groupedLogs[date];
            const totalSpending = dateLogs.reduce((sum, log) => sum + parseFloat(log.amount), 0);

            // Create a container for the date
            const dateContainer = document.createElement('div');
            dateContainer.classList.add('date-container');
            dateContainer.innerHTML = `<h2>Date: ${date}</h2>`;

            // Display total spending for the date
            const totalDiv = document.createElement('div');
            totalDiv.classList.add('total-spending');
            totalDiv.innerHTML = `<p>Total Spending: $${totalSpending.toFixed(2)}</p>`;
            dateContainer.appendChild(totalDiv);

            // Display each log for the date
            dateLogs.forEach((log, index) => {
                const logDiv = document.createElement('div');
                logDiv.classList.add('log-entry');
                logDiv.innerHTML = `
                    <div class="log">
                        <p>Category: ${log.category}</p>
                        <p>Amount: $${parseFloat(log.amount).toFixed(2)}</p>
                        <button onclick="deleteLog(${index}, '${log.date}')">Delete</button>
                    </div>
                `;
                dateContainer.appendChild(logDiv);
            });

            logContainer.appendChild(dateContainer);
        }
    }
});

function addLog(category, amount, date) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    localStorage.setItem('logs', JSON.stringify(logs));
    window.location.reload(); // Refresh the page to update the logs
}

function deleteLog(index, date) {
    const logs = JSON.parse(localStorage.getItem('logs')) || [];
    logs.splice(index, 1); // Remove the log at the specified index
    localStorage.setItem('logs', JSON.stringify(logs)); // Save the updated logs
    window.location.reload(); // Refresh the page to update the log list
}

// Example form submission handler
function handleFormSubmit(event) {
    event.preventDefault();
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const date = document.getElementById('date').value;
    addLog(category, amount, date);
}
