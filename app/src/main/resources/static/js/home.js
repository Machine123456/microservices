
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/products')
    .then((response) => response.json())
    .then((products) => {
        const productList = document.getElementById("productList");
        if (products.length === 0) {
            const emptyMessage = document.createElement("div");
            emptyMessage.classList.add("empty-message");
            emptyMessage.textContent = "No products found.";
            productList.appendChild(emptyMessage);
        } else {
            products.forEach((product) => {
                const productCard = document.createElement("div");
                productCard.classList.add("product-card");
                const productName = document.createElement("div");
                productCard.classList.add("product-name");
                productName.textContent = product.name; 
                const productPrice = document.createElement("div");
                productPrice.classList.add("product-price");
                productPrice.textContent = product.price; 
                
                productCard.appendChild(productName);
                productCard.appendChild(productPrice);
                productList.appendChild(productCard);
            });
        }
    })
    .catch((error) => {
        console.error("Error fetching products:", error);
        //const errorDisplay = document.getElementById("errorDisplay");
        //errorDisplay.textContent = "Error fetching products. Please try again later.";
    });
});

