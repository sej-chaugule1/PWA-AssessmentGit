function validateLogin() {
    const correctUsername = "Software";
    const correctPassword = "Engineering";
    
    const enteredUsername = document.getElementById("user").value;
    const enteredPassword = document.getElementById("pass").value;
    const errorMessage = document.getElementById("error-message");
    const emptyMessage = document.getElementById("empty-message");
    
    errorMessage.style.display = "none";
    emptyMessage.style.display = "none";

errorMessage.style.display = "none";
emptyMessage.style.display = "none";

if (enteredUsername === "" || enteredPassword === "") {
    emptyMessage.style.display = "block";
    return false; 
}

if (enteredUsername === correctUsername && enteredPassword === correctPassword) {
    window.location.href = "Penny-wise.html";
    return false; 
} else {
    errorMessage.style.display = "block"; 
    return false; 
}

}