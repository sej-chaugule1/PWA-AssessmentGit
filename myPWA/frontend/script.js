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
    wrapper.style.height = "500px";
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
    wrapper.style.height = "500px";
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

    const password = document.getElementById("reg-pass").value;
    const criteria = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

    if (!criteria.test(password)) {
        alert("Please meet all the password requirements before signing up.");
        return;
    }

    alert("Registration successful!");
});
