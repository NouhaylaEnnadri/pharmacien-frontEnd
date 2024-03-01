// fetchProducts.js

async function fetchProducts(categoryToFilter) {
    try {
        const response = await fetch("http://localhost:5001/api/product");
        const products = await response.json();

        const productContainer = document.getElementById("productContainer");
        productContainer.innerHTML = "";

        products.forEach((product) => {
            // Check if the product's category matches the desired category
            if (product.category === categoryToFilter) {
                const card = document.createElement("div");
                card.className = "col-sm-3";
                card.innerHTML = `
                    <div class="thumb-wrapper">
                        <a href="index.html">
                            <div class="img-box">
                                <img src="http://127.0.0.1:5501/server/${product.image}" class="img-fluid" alt="${product.name}" />
                            </div>
                            <div class="thumb-content">
                                <h4>${product.name}</h4>
                            </div>
                        </a>
                    </div>
                `;
                productContainer.appendChild(card);
            }
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        // Handle the error, e.g., show an alert
        alert("Error fetching products. Please try again.");
    }
}
