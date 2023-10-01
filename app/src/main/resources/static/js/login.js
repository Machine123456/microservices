function clearFeedback() {
    document.getElementById('login-feedback').textContent = '';
    document.getElementById('registration-feedback').textContent = '';
}
        
function showLogin() {
    const registrationForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');
    loginForm.style.display = 'block';
    registrationForm.style.display = 'none';
    clearFeedback();
}

function getUserFromToken(event) {
  event.preventDefault();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/api/getUserFromRequest', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
              const user = JSON.parse(xhr.responseText); // Parse the JSON response
              document.getElementById('auth-txt').textContent = 'User is Authenticated: ' + user.username;
              return;
          } 
          else document.getElementById('auth-txt').textContent = 'User is not Authenticated';
          
      }
  };

  xhr.send();
}
        
function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
        
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();
        
    // Configure the request
    xhr.open('POST', '/auth/login', true);

    // Extract CSRF token from the HTML form
    //const csrfToken = document.querySelector('input[name="_csrf"]').value;

    xhr.setRequestHeader('Content-Type', 'application/json');
    //xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken); // Include CSRF token in the request headers
        
    // Set up a callback function to handle the response
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if(xhr.status === 200) {
                //const token = xhr.responseText;
                window.location.href = '/home'; // Redirect to the /home page after successful login
                document.getElementById('login-feedback').textContent = "Login Successfully";
            }
            else document.getElementById('login-feedback').textContent = xhr.responseText;
        }
    };
        
    // Send the request with the JSON payload containing username and password
    const data = JSON.stringify({ username: username, email: username, password: password });
    xhr.send(data);
}


