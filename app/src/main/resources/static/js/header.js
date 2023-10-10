document.addEventListener('DOMContentLoaded', function () {

    refreshHeader();
    document.body.addEventListener('click', function (event) {
        const isWithinDropdown = Boolean(event.target.closest('.dropdown'))
        if (!isWithinDropdown)
            closeAllDropdowns();
    });
});

function refreshHeader() {
    fetchMapping()
        .then(() => fetchUser())
        .then((userRole) => {

            switch (userRole) {
                case null:
                case "":
                    //logout
                    hideRequiredLoginComponents();
                    hideRequiredAdminComponents();
                    break;
                case "USER":
                    //login as user
                    hideRequiredLogoutComponents();
                    hideRequiredAdminComponents();
                    break;
                case "ADMIN":
                    //login as adm
                    hideRequiredLogoutComponents();
                    break;
            }

            updateCurrentUrls();
        });
}

function fetchMapping() {
    return fetch('/auth/getServicesMapping')
        .then((response) => response.json())
        .then((maps) => {//Map<String, MappingResponse>

            if (!maps || Object.keys(maps).length === 0) return;

            const servicesWrapper = document.getElementById("servicesWrapper");
            servicesWrapper.innerHTML = "";

            Object.entries(maps).forEach(([serviceName, serviceMapping]) => {

                const serviceDiv = document.createElement("div");
                serviceDiv.classList.add("dropdown");


                const serviceImage = document.createElement("img");
                serviceImage.alt = serviceName;
                serviceImage.src = serviceMapping.imageData;
                serviceImage.onclick = function () { toggleDropdown(serviceDiv); };

                serviceDiv.appendChild(serviceImage);

                if (serviceMapping.endpoints != null && serviceMapping.endpoints.length > 0) {
                    let numEndpoints = serviceMapping.endpoints.length;
                    let reqAdmin = 0, reqLogin = 0;

                    const serviceContent = document.createElement("div");
                    serviceContent.classList.add("dropdown-content");

                    serviceMapping.endpoints.forEach((endpoint) => {

                        const dropDownItem = document.createElement("div");
                        dropDownItem.classList.add("dropdown-item");

                        switch (endpoint.requiredRole) {
                            case "ADMIN":
                                dropDownItem.classList.add("req-admin");
                                reqAdmin++;
                                break;
                            case "USER":
                                dropDownItem.classList.add("req-login");
                                reqLogin++;
                                break;
                        }

                        const serviceLink = document.createElement("a");
                        const path = endpoint.path;
                        if (path.startsWith('/')) {
                            path = path.substring(1);
                        }
                        serviceLink.href = serviceMapping.bridgeAdress + "/" + path;

                        const parts = endpoint.path.split('/');
                        serviceLink.text = parts.length > 1 ? parts[parts.length - 1] : path;

                        dropDownItem.appendChild(serviceLink);
                        serviceContent.appendChild(dropDownItem);

                    });

                    if (numEndpoints == reqAdmin)
                        serviceContent.classList.add("req-admin");
                    else if (numEndpoints == reqLogin + reqAdmin)
                        serviceContent.classList.add("req-login");

                    serviceDiv.appendChild(serviceContent);
                }

                servicesWrapper.appendChild(serviceDiv);
            });
        })
        .catch((error) => {
            console.error("Error fetching mapps:", error);
        });
}

function fetchUser() {
    return fetch('/auth/getUserFromToken')
        .then((response) => response.json())
        .then((user) => {

            if (!user)
                return "";

            const userName = document.getElementById("userName");
            const userEmail = document.getElementById("userEmail");

            userName.textContent = user.username;
            userEmail.textContent = user.email;

            return !user.authorities.includes("ROLE_ADMIN") ? "USER" : "ADMIN";
        })
        .catch((error) => {
            console.error("Error fetching user from token: ", error);
            return "";
        });
}

function redirectWithToken(href) {
    return fetch('/auth/redirect?href=' + encodeURIComponent(href))
        .then(response => {
            if (response.status === 200) {
                // Handle the redirect manually
                window.location.href = response.headers.get('Location');
            } else {
                // Handle other responses or errors
                console.error("Error redirecting to " + href + ", status code: " + response.status);
            }
        })
        .catch((error) => {
            console.error("Error redirecting to " + href + " " + error);
        });
}

function updateCurrentUrls() {
    var links = document.getElementById("servicesWrapper").querySelectorAll("a");

    links.forEach(function (link) {

        var linkUrl = new URL(link.getAttribute("href"), window.location.href);

        if (!areHostnamesEqual(linkUrl.hostname, window.location.hostname)) {

            link.addEventListener("click", function (event) {
                event.preventDefault();
                redirectWithToken(event.target.href);
            });
        }
        else {
            if (linkUrl.port == window.location.port && linkUrl.pathname === window.location.pathname) {
                // Disable the link by preventing the default behavior
                link.addEventListener("click", function (event) {
                    event.preventDefault();
                });

                // Optionally, you can style the disabled link
                link.style.color = "gray";
                link.style.textDecoration = "none";
                link.style.cursor = "default";
            }
        }

        function areHostnamesEqual(hostname1, hostname2) {

            hostname1 = hostname1.toLowerCase();
            hostname2 = hostname2.toLowerCase();

            if (hostname1 === hostname2) return true;

            if ((hostname1 === "localhost" && hostname2 === "127.0.0.1") ||
                (hostname1 === "127.0.0.1" && hostname2 === "localhost")) {
                return true;
            }

            return false;
        }
    });
}

function hideRequiredLogoutComponents() {
    hideComponentsWith('.req-logout');
}

function hideRequiredLoginComponents() {
    hideComponentsWith('.req-login');
}

function hideRequiredAdminComponents() {
    hideComponentsWith('.req-admin');
}

function hideComponentsWith(selector) {
    var components = document.querySelectorAll(selector);
    components.forEach(function (component) {
        component.style.display = "none";
    });
}

function closeAllDropdowns() {
    var dropdowns = document.querySelectorAll('.dropdown');

    dropdowns.forEach(function (dropdown) {

        var dropdownContent = dropdown.querySelector(':scope > .dropdown-content');
        var image = dropdown.querySelector(':scope > img');

        if (dropdownContent != null && dropdownContent.classList.contains('active')) {
            dropdownContent.classList.remove('active');

            if (image == null)
                return;

            image.classList.remove('active');

            if (image.classList.contains('rotate')) {
                image.classList.remove("rotate");
                image.classList.add("inv-rotate");
            }
        }
    });
}


function toggleDropdown(toggleBtn) {

    var dropdown = toggleBtn.closest('.dropdown');

    var dropdownContent = dropdown.querySelector(':scope > .dropdown-content');
    var image = dropdown.querySelector(':scope > img');

    var toActive = dropdownContent != null && !dropdownContent.classList.contains('active');

    closeAllDropdowns();

    if (toActive) {
        dropdownContent.classList.add('active');

        if (image == null)
            return;

        image.classList.add('active');

        if (image.classList.contains('inv-rotate')) {
            image.classList.remove("inv-rotate");
            image.classList.add("rotate");
        }
    }
}

function logout() {

    fetch('/auth/logout')
        .then(response => {
            if (response.status === 200) {
                window.location.href = '/home';
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
        });
}

function login(event) {

    event.preventDefault();
    const loginForm = document.querySelector('.login-form');

    const username = loginForm.querySelector('.form-username');
    const password = loginForm.querySelector('.form-password');
    const feedback = loginForm.querySelector('.form-feedback');

    if (!username || !password)
        return displayFeedback("Error querying loginForm: null fields");

    //const csrfToken = document.querySelector('input[name="_csrf"]').value;

    fetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ username: username.value, email: username.value, password: password.value })
        , headers: {
            'Content-Type': 'application/json',
            // Add any other headers as needed, including the CSRF token if required
            // 'X-CSRF-TOKEN': csrfToken,
        }
    }
    )
        .then(response => {
            if (response.status === 200) {
                displayFeedback("Login Successfully");
                window.location.href = '/index';
            }
            else return response.text().then(errorMessage => displayFeedback(errorMessage));
        })
        .catch(error => {
            displayFeedback('Error during login, check logs for more info');
            console.error('Error during login:', error);
        });

    function displayFeedback(message) {

        if (!feedback) return;

        feedback.classList.add("active");
        feedback.textContent = message;
    }
}