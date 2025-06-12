const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

function loginFunction(){
    loginForm.style.left = "50%";
    loginForm.style.opacity = 1;
    registerForm.style.left = "150%";
    registerForm.style.opacity = 0;
    wrapper.style.height = "450px";
    loginTitle.style.top = "50%";
    loginTitle.style.opacity = 1;
    registerTitle.style.top = "50px";
    registerTitle.style.opacity = 0;
}

function registerFunction(){
    loginForm.style.left = "-50%";
    loginForm.style.opacity = 0;
    registerForm.style.left = "50%";
    registerForm.style.opacity = 1;
    wrapper.style.height = "480px";
    loginTitle.style.top = "-60px";
    loginTitle.style.opacity = 0;
    registerTitle.style.top = "50%";
    registerTitle.style.opacity = 1;
}

function validatePassword() {
  const password = document.getElementById("reg-pass").value;

  const length = document.getElementById("length");
  const uppercase = document.getElementById("uppercase");
  const lowercase = document.getElementById("lowercase");
  const number = document.getElementById("number");
  const special = document.getElementById("special");

  // Helper function
  function updateItem(condition, element) {
    if (condition) {
      element.classList.add("valid");
      element.innerHTML = "✔ " + element.textContent.slice(2);
    } else {
      element.classList.remove("valid");
      element.innerHTML = "✖ " + element.textContent.slice(2);
    }
  }

  updateItem(password.length >= 8, length);
  updateItem(/[A-Z]/.test(password), uppercase);
  updateItem(/[a-z]/.test(password), lowercase);
  updateItem(/[0-9]/.test(password), number);
  updateItem(/[^A-Za-z0-9]/.test(password), special);
}

signUpBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const username = document.getElementById("reg-name").value;
    const password = document.getElementById("reg-pass").value;

    const criteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!criteria.test(password)) {
        alert("Please meet all the password requirements before signing up.");
        return;
    }

    // Send data to server
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert("Registration successful!");
            loginFunction(); // Switch to login view
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        console.error("Signup error:", error.message);
        alert("Signup failed: " + error.message);
    });
});

signInBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const username = document.getElementById("log-email").value;
    const password = document.getElementById("log-pass").value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (response.ok) {
            alert("Login successful!");
            window.location.href = "Penny-wise.html";  
        } else {
            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        console.error("Login error:", error.message);
        alert("Login failed: " + error.message);
    });
});

document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.style.cursor = "pointer";

    icon.addEventListener('click', () => {
        const targetId = icon.getAttribute('data-target');
        const passwordField = document.getElementById(targetId);

        if (passwordField.type === "password") {
            passwordField.type = "text";
            icon.classList.remove('bx-lock-alt');
            icon.classList.add('bx-lock-open-alt');
        } else {
            passwordField.type = "password";
            icon.classList.remove('bx-lock-open-alt');
            icon.classList.add('bx-lock-alt');
        }
    });
});