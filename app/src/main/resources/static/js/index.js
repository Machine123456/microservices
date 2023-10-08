
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/users')
    .then((response) => response.json())
    .then((users) => {
        const userList = document.getElementById("userList");
        if (users.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.classList.add("empty-message");
            emptyMessage.textContent = "No users found.";
            userList.appendChild(emptyMessage);
        } else {
            users.forEach((user) => {
                const userCard = document.createElement("div");
                userCard.classList.add("user-card");
                const userName = document.createElement("div");
                userName.classList.add("user-name");
                userName.textContent = user.username; // Assuming user object has a 'username' field
                const userEmail = document.createElement("div");
                userEmail.classList.add("user-email");
                userEmail.textContent = user.email; // Assuming user object has an 'email' field
                userCard.appendChild(userName);
                userCard.appendChild(userEmail);
                userList.appendChild(userCard);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching users:", error);
        //const errorDisplay = document.getElementById("errorDisplay");
        //errorDisplay.textContent = "Error fetching users. Please try again later.";
    });
});