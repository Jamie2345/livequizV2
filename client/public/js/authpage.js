let showPass = false;
function togglePasswordVisibility() {
  showPass = !showPass;
  const passwordInput = document.getElementById('password-input');
  const revealIcon = document.getElementById('eye-icon');

  if (showPass) {
    passwordInput.type = 'text';
    revealIcon.classList.remove('ri-eye-fill')
    revealIcon.classList.add('ri-eye-off-fill');
  }
  else {
    passwordInput.type = 'password';
    revealIcon.classList.remove('ri-eye-off-fill')
    revealIcon.classList.add('ri-eye-fill');
  }
}

function loginSubmit() {
  const identifier = document.getElementById('identifier-input').value;
  const password = document.getElementById('password-input').value;

  // Construct the request object
  const data = {
      identifier: identifier,
      password: password
  };

  // Send a POST request to your backend API
  fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include' // include cookies
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response (e.g., get and use the access token)
      console.log(data);
      const accessToken = data.accessToken;
      if (accessToken) {
        console.log('success');
        console.log(accessToken);
        document.cookie = `accessToken=${accessToken}; path=/`;
        document.location.href = '/profile';
      }
      else {
        alert('Invalid credentials');
      }
  })
  .catch(error => {
      console.error('Error:', error);
  });
}

function registerSubmit() {
  const username = document.getElementById('username-input').value;
  const email = document.getElementById('email-input').value;
  const password = document.getElementById('password-input').value;
  const confirmPassword = document.getElementById('confirm-password-input').value;

  if (password !== confirmPassword) {
    alert('Passwords do not match.');
    return;
  }

  // Construct the request object
  const data = {
    username: username,
    email: email,
    password: password
  };

  // Send a POST request to your backend API (/api/register)
  fetch('/api/register', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
      credentials: 'include' // include cookies
  })
  .then(response => response.json())
  .then(data => {
      // Handle the response (e.g., show success message or redirect to login)
      console.log(data)
      if (data.message) {
        alert(data.message);
      }
      else {
        window.location.href = '/login'; // Redirect to login page
      }
  })
  .catch(error => {
      console.error('Error:', error);
      alert('Registration failed. Please try again.');
  });
}

const currentURL = window.location.href;

if (currentURL.includes('/login')) {
  const loginForm = document.getElementById('login-form');
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginSubmit();
  });
}

if (currentURL.includes('/register')) {
  const registerForm = document.getElementById('register-form');
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    registerSubmit();
  })
}
