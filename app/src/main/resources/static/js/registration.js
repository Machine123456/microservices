
        function showRegistration() {
            const registrationForm = document.getElementById('registration-form');
            const loginForm = document.getElementById('login-form');
            loginForm.style.display = 'none';
            registrationForm.style.display = 'block';
            clearFeedback();
        }
        
        function register(event) {
            event.preventDefault();
            const username = document.getElementById('reg-username').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;
        
            // Validate password and username
            const isPasswordValid = updatePasswordValidationMsg(password);
            const isUsernameValid = updateUsernameValidationMsg(username);
            const isEmailValid = updateEmailValidationMsg(email);
           
            if (!isPasswordValid || !isUsernameValid || !isEmailValid) {
                document.getElementById('registration-feedback').textContent = "Invalid input field/s";
                return; // Abort registration if validation fails
            }
            // Create a new XMLHttpRequest object
            const xhr = new XMLHttpRequest();
        
            // Configure the request
            xhr.open('POST', '/auth/register', true);

            // Extract CSRF token from the HTML form
            //const csrfToken = document.querySelector('input[name="_csrf"]').value;

            xhr.setRequestHeader('Content-Type', 'application/json');
            //xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken);  // Include CSRF token in the request headers
        
            // Set up a callback function to handle the response
            xhr.onreadystatechange = function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    if(xhr.status == 200){
                        //const token = xhr.responseText;
                        window.location.href = '/home'; // Redirect to the /home page after successful login
                        document.getElementById('registration-feedback').textContent = "User Created Successfully";
                    }
                    else 
                        document.getElementById('registration-feedback').textContent = xhr.responseText;
                }
                //if (xhr.status === 200) 
                //    window.location.href = '/home'; // Redirect to the /home page after successful register
            };
        
            // Send the request with the JSON payload containing username, email, and password
            const data = JSON.stringify({ username: username, email: email, password: password });
            xhr.send(data);
        }
        
        function updateEmailValidationMsg(email) {
            const emailValidationMsg = document.getElementById('email-validation-msg');

            emailValidationMsg.textContent = ''; // Clear the validation message
            if(email == '') return true;
        
            // Validation: Check the format
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const hasInvalidFormat = !emailPattern.test(email);
        
            if (hasInvalidFormat)
                emailValidationMsg.innerHTML += '- Invalid email format. <br>'; // Show validation message if invalid
           
            if(emailValidationMsg.textContent != ''){
                emailValidationMsg.innerHTML += '<br>'
                return false;
            }
        
            return true;
        }
        function updateUsernameValidationMsg(username) {
        
            const usernameValidationMsg = document.getElementById('username-validation-msg');

            usernameValidationMsg.textContent = ''; // Clear the validation message
            if(username == '') return true;
        
            // Validation: Check the format
            const usernamePattern = /^[a-zA-Z0-9]+$/;
            const hasInvalidFormat = !usernamePattern.test(username);
        
            if (hasInvalidFormat)
                usernameValidationMsg.innerHTML += '- Username can be only made of letters and numbers. <br>'; // Show validation message if invalid
        
            if(usernameValidationMsg.textContent != ''){
                usernameValidationMsg.innerHTML += '<br>'   
                return false;
            }
        
            return true;
        }
        function updatePasswordValidationMsg(password) {
        
            const passwordValidationMsg = document.getElementById('password-validation-msg');
            passwordValidationMsg.textContent = ''; // Clear the validation message
            if(password == '') return true;
        
            const atLeast6CharsPattern = /.{6,}/;
            const atLeastOneCapitalLetterPattern = /[A-Z]/;
            const atLeastOneSymbolPattern = /[!@#$%^&*]/;
            const atLeastOneNumberPattern = /\d/;
        
            if (!atLeast6CharsPattern.test(password)) 
                passwordValidationMsg.innerHTML += '- Password must have at least 6 characters. <br>';
            if (!atLeastOneCapitalLetterPattern.test(password)) 
                passwordValidationMsg.innerHTML += '- Password must have at least one capital letter. <br>';
            if (!atLeastOneSymbolPattern.test(password)) 
                passwordValidationMsg.innerHTML += '- Password must have at least one symbol. <br>';
            if (!atLeastOneNumberPattern.test(password)) 
                passwordValidationMsg.innerHTML += '- Password must have at least one number. <br>';
              
            if(passwordValidationMsg.textContent != ''){
                passwordValidationMsg.innerHTML += '<br>';
                return false;
            }
        
            return true;
            
            
        }

        document.addEventListener('DOMContentLoaded', function() {
           
            const emailInput = document.getElementById('reg-email');
            const passwordInput = document.getElementById('reg-password');
            const usernameInput = document.getElementById('reg-username');

            emailInput.addEventListener('input', function() {
                const email = emailInput.value;
                updateEmailValidationMsg(email);
            });

            usernameInput.addEventListener('input', function() {
                const username = usernameInput.value;
                updateUsernameValidationMsg(username);
            });

            passwordInput.addEventListener('input', function() {   
                const password = passwordInput.value;
                updatePasswordValidationMsg(password);
            });
        });
