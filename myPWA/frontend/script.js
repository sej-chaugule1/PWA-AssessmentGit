const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");
const wrapper = document.querySelector(".wrapper");
const loginTitle = document.querySelector(".title-login");
const registerTitle = document.querySelector(".title-register");
const signUpBtn = document.querySelector("#SignUpBtn");
const signInBtn = document.querySelector("#SignInBtn");

//Toggle to login view
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

//Toggle to login view
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

// Input validation for password, ensuring it is secure
function validatePassword() {
  const password = document.getElementById("reg-pass").value;

  //Password criteria feedback elements
  const length = document.getElementById("length");
  const uppercase = document.getElementById("uppercase");
  const lowercase = document.getElementById("lowercase");
  const number = document.getElementById("number");
  const special = document.getElementById("special");

  //Updates user feedback regarding input validation for passwords
  function updateItem(condition, element) {
    if (condition) {
      element.classList.add("valid");
      element.innerHTML = "✔ " + element.textContent.slice(2);
    } else {
      element.classList.remove("valid");
      element.innerHTML = "✖ " + element.textContent.slice(2);
    }
  }

  //Validation checks
  updateItem(password.length >= 8, length);
  updateItem(/[A-Z]/.test(password), uppercase);
  updateItem(/[a-z]/.test(password), lowercase);
  updateItem(/[0-9]/.test(password), number);
  updateItem(/[!@#$%^&*]/.test(password), special); //Sanitisation: only allowing these special characters reduces the risk of SQL injections and XSS
}

//Registration form submission
signUpBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const username = document.getElementById("reg-name").value;
    const password = document.getElementById("reg-pass").value;

    //Input validation: ensuring password meets all requirements
    const criteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!criteria.test(password)) {
        alert("Please meet all the password requirements before signing up.");
        return; // Prevents submission if password does not meet requirements
    }

    // Send data to server
    fetch('http://localhost:3000/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password }) //Sanitisation: JSON.stringify escapes data
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

const LOCKOUT_DURATION = 5 * 60 * 1000;
let maxAttempts = 3;

const lockoutUntil = localStorage.getItem('lockoutUntil');
const now = new Date().getTime();

if (lockoutUntil && now < parseInt(lockoutUntil)) {
    disableLoginForm(); //Lockout in effect
} else {
    localStorage.removeItem('lockoutUntil');
    localStorage.setItem('attemptsLeft', 3);
}

if (localStorage.getItem('attemptsLeft') !== null) {
    maxAttempts = parseInt(localStorage.getItem('attemptsLeft'));
}

//Login form submission
signInBtn.addEventListener("click", function(event) {
    event.preventDefault();

    const now = new Date().getTime();
    const lockoutTime = localStorage.getItem('lockoutUntil');

    if (lockoutTime && now < parseInt(lockoutTime)) {
        alert("You're locked out. Please try again later.");
        disableLoginForm();
        return;
    }

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
            localStorage.setItem('username', username);
            localStorage.removeItem('attemptsLeft');
            localStorage.removeItem('lockoutUntil');
            window.location.href = "Penny-wise.html";
        } else {
            maxAttempts--;
            localStorage.setItem('attemptsLeft', maxAttempts);

            if (maxAttempts <= 0) {
                const lockoutEnd = new Date().getTime() + LOCKOUT_DURATION;
                localStorage.setItem('lockoutUntil', lockoutEnd);

                alert("Too many failed attempts. Locked out for 5 minutes.");
                disableLoginForm();
            } else {
                alert(`Login failed. You have ${maxAttempts} attempt(s) left.`);
            }

            return response.text().then(text => { throw new Error(text); });
        }
    })
    .catch(error => {
        console.error("Login error:", error.message);
    });
});

//Login form is disabled after 3 failed attempts
function disableLoginForm() {
    document.getElementById("log-email").value = "";
    document.getElementById("log-pass").value = "";
    document.getElementById("log-email").disabled = true;
    document.getElementById("log-pass").disabled = true;
    signInBtn.disabled = true;

    const countdown = document.createElement("p");
    countdown.id = "lockout-timer";
    document.querySelector(".login-form").appendChild(countdown);
    startCountdown();
}

//5 minute countdown displayed after 3 failed attempts
function startCountdown() {
    const timerDisplay = document.getElementById("lockout-timer");
    const lockoutEnd = parseInt(localStorage.getItem('lockoutUntil'));

    const interval = setInterval(() => {
        const now = new Date().getTime();
        const remaining = lockoutEnd - now;

        if (remaining <= 0) {
            clearInterval(interval);
            timerDisplay.textContent = "";
            enableLoginForm();
            return;
        }

        const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
        timerDisplay.textContent = `Try again in ${minutes}m ${seconds}s`;
    }, 1000);
}

//Enabling form after lockout
function enableLoginForm() {
    document.getElementById("log-email").disabled = false;
    document.getElementById("log-pass").disabled = false;
    signInBtn.disabled = false;
    localStorage.setItem('attemptsLeft', 3);
    localStorage.removeItem('lockoutUntil');
}

//Password visability toggle
document.querySelectorAll('.toggle-password').forEach(toggle => {
    toggle.addEventListener('click', () => {
        const inputId = toggle.getAttribute('data-target');
        const input = document.getElementById(inputId);

        if (input.type === 'password') {
            input.type = 'text';
            toggle.classList.remove('bx-hide');
            toggle.classList.add('bx-show');
        } else {
            input.type = 'password';
            toggle.classList.remove('bx-show');
            toggle.classList.add('bx-hide');
        }
    });
});

// Sanitation: Prevent spaces in username and password fields
const noSpaceInputs = ["reg-name", "reg-pass", "log-email", "log-pass"];

noSpaceInputs.forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener("keydown", function(event) {
        if (event.key === " ") {
            event.preventDefault(); // Prevents spaces from being inputted
        }
    });

    input.addEventListener("input", function() {
        this.value = this.value.replace(/\s/g, ""); // Remove pasted spaces
    });
});
