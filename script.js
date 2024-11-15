function validateLogin() {
    const correctUsername = "Software";
    const correctPassword = "Engineering";
    
    const enteredUsername = document.getElementById("user").value;
    const enteredPassword = document.getElementById("pass").value;
    const errorMessage = document.getElementById("error-message");
    const emptyMessage = document.getElementById("empty-message");
    
    errorMessage.style.display = "none";
    emptyMessage.style.display = "none";
}