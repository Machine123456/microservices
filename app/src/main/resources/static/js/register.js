

function register(event) {

    event.preventDefault();
    const regForm = document.querySelector('.reg-form');

    const invalidInputs = Array.from(regForm.querySelectorAll('.invalid > input'));

    if (invalidInputs.length > 0) {
        invalidInputs.forEach(
            (input) => {
                input.classList.remove("shake");

                requestAnimationFrame((time) => {
                    requestAnimationFrame((time) => {
                        input.classList.add("shake");
                    });
                });
            });
        return;
    }
    const username = regForm.querySelector('#reg-username > input');
    const email = regForm.querySelector('#reg-email > input');
    const password = regForm.querySelector('#reg-password > input');

    if (!username || !password || !email) {
        console.error('Error querying regForm: null fields');
        return;
    }


    //const csrfToken = document.querySelector('input[name="_csrf"]').value;

    fetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username: username.value, email: email.value, password: password.value })
        , headers: {
            'Content-Type': 'application/json',
            // Add any other headers as needed, including the CSRF token if required
            // 'X-CSRF-TOKEN': csrfToken,
        }
    }
    )
        .then(response => {


            if (response.status === 200) {
                displayRegFeedback("Register Successfully");
                window.location.href = '/index';
            }
            else return response.text().then(errorMessage => displayRegFeedback(errorMessage));
        })
        .catch(error => {
            console.error('Error during register:', error);
        });

    function displayRegFeedback(menssage) {
        const feedback = regForm.querySelector('#reg-feedback');
        if (feedback) {
            feedback.innerHTML = menssage;
        }
    }

}



document.addEventListener('DOMContentLoaded', function () {

    fetch('/auth/getUserRequirements')
        .then((response) => response.json())
        .then((userRequirements) => {

            if (!userRequirements)
                return;

            const regForm = document.querySelector('.reg-form');
            const fields = ["username", "password", "email"];

            Object.entries(userRequirements).forEach(([name, requirements]) => {
                if (fields.includes(name))
                    addFeedbackReaction(
                        regForm.querySelector('#reg-' + name),
                        requirements);
            });

        })
        .catch((error) => {
            console.error("Error adding feedback reactions: ", error);
        });



    function addFeedbackReaction(regField, requirements) {

        if (!regField || !requirements)
            return;

        const input = regField.querySelector('input');
        const feedback = regField.querySelector('.feedback');

        if (!input || !feedback)
            return;

        input.addEventListener('input', function () {

            const invalidPatterns = input.value != "" ? getValidationMsg(input.value, requirements) : "";

            feedback.innerHTML = invalidPatterns;

            invalidPatterns === "" ?
                regField.classList.remove("invalid") :
                regField.classList.add("invalid");
        });

        function getValidationMsg(input, validations) {

            var finalValidationMsg = "";

            Object.entries(validations).forEach(([regexString, errorMsg]) => {

                var regex = new RegExp(regexString);
                if (!regex.test(input))
                    finalValidationMsg += errorMsg + "<br>"
            });

            return finalValidationMsg;
        }
    }


});