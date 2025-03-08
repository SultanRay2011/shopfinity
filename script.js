// Utility functions to manage user data
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem("currentUser", JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem("currentUser") || "null");
}

function clearCurrentUser() {
  localStorage.removeItem("currentUser");
}

// Function to update the navigation bar based on login status
function updateNav() {
  const user = getCurrentUser();
  const accountText = document.getElementById("accountText");
  const dropdown = document.getElementById("accountDropdown");
  if (user) {
    accountText.textContent = "Hello, " + user.first_name;
    dropdown.innerHTML = '<a href="#" id="logoutLink">Logout</a>';
    document.getElementById("logoutLink").addEventListener("click", function(e) {
      e.preventDefault();
      clearCurrentUser();
      location.reload();
    });
  }
}

// Login form submission handler (for login.html)
function handleLogin(event) {
  event.preventDefault();
  const credential = document.getElementById("credential").value.trim();
  const password = document.getElementById("password").value;
  let found = false;
  const users = getUsers();

  // If credential contains '@', assume it's an email.
  if (credential.includes("@")) {
    if (users[credential] && users[credential].password === password) {
      setCurrentUser(users[credential]);
      found = true;
    }
  } else {
    // Otherwise, assume credential is "FirstName LastName"
    const parts = credential.split(" ");
    if (parts.length >= 2) {
      const first_name = parts[0].toLowerCase();
      const last_name = parts[1].toLowerCase();
      for (const email in users) {
        const user = users[email];
        if (
          user.first_name.toLowerCase() === first_name &&
          user.last_name.toLowerCase() === last_name &&
          user.password === password
        ) {
          setCurrentUser(user);
          found = true;
          break;
        }
      }
    }
  }

  if (found) {
    alert("Logged in successfully!");
    window.location.href = "index.html";
  } else {
    alert("Invalid credentials");
  }
}

// Signup form submission handler (for signup.html)
function handleSignup(event) {
  event.preventDefault();
  const first_name = document.getElementById("first_name").value.trim();
  const last_name = document.getElementById("last_name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const address = document.getElementById("address").value.trim();
  
  // Validate that the password contains more than 6 words
  const words = password.trim().split(/\s+/);
  const passwordHint = document.getElementById("passwordHint");
  if (words.length <= 6) {
    passwordHint.textContent = "Password must contain more than 6 words.";
    return;
  } else {
    passwordHint.textContent = "";
  }
  
  const users = getUsers();

  if (users[email]) {
    alert("Email already exists");
    return;
  }
  // Create a new user object
  const newUser = { first_name, last_name, email, password, address };
  users[email] = newUser;
  saveUsers(users);
  alert("Account created successfully. Please log in.");
  window.location.href = "login.html";
}

// "Add to Cart" button handler
function handleAddToCart(event) {
  event.preventDefault();
  const user = getCurrentUser();
  if (!user) {
    alert("You are not logged in. Please log in or sign up to add items to your cart.");
    window.location.href = "login.html";
  } else {
    // Retrieve current cart count from localStorage (default to 0)
    let cartCount = parseInt(localStorage.getItem("cartCount") || "0", 10);
    cartCount++;
    localStorage.setItem("cartCount", cartCount);
    document.querySelector(".cart").innerText = "Cart (" + cartCount + ")";
    alert("Item added to cart!");
  }
}

// Modal functionality on index.html
function setupModal() {
  const modal = document.getElementById("loginModal");
  if (!modal) return;
  const modalLogin = document.getElementById("modalLogin");
  const modalSignup = document.getElementById("modalSignup");
  const modalCancel = document.getElementById("modalCancel");

  if (modalLogin) {
    modalLogin.addEventListener("click", function() {
      window.location.href = "login.html";
    });
  }
  if (modalSignup) {
    modalSignup.addEventListener("click", function() {
      window.location.href = "signup.html";
    });
  }
  if (modalCancel) {
    modalCancel.addEventListener("click", function() {
      modal.style.display = "none";
    });
  }
}

// Run different handlers based on which page we're on
document.addEventListener("DOMContentLoaded", () => {
  // If on index.html, update the navigation bar and show modal if not logged in
  if (document.getElementById("accountText")) {
    updateNav();
    if (!getCurrentUser()) {
      const modal = document.getElementById("loginModal");
      if (modal) {
        setTimeout(() => {
          modal.style.display = "block";
        }, 500);
      }
    }
  }
  
  // Attach form handlers for login page
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
  
  // Attach form handlers for signup page
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", handleSignup);
  }
  
  // Attach "Add to Cart" handlers for all buttons with the class "add-to-cart"
  const addToCartButtons = document.querySelectorAll(".add-to-cart");
  addToCartButtons.forEach(button => {
    button.addEventListener("click", handleAddToCart);
  });
  
  // Setup modal functionality if present
  setupModal();
});
