async function login() {
  try {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const formData = new FormData(document.getElementById("addProductForm"));

    const response = await fetch("http://localhost:5001/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ formData }),
    });

    const data = await response.json();

    if (response.ok) {
      alert(data.message);
    } else {
      alert(data.message);
      // Handle failed login, display error message, etc.
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
} // Function to fetch products from the server
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5001/api/product"); // Update this URL
    const products = await response.json();

    // Display products, including images
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = `
        <tr>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.description}</td>
          <td>
          <img
            src="http://127.0.0.1:5501/server${product.image}"
            alt="${product.name}"
            style="max-width: 100px; max-height: 100px;"
          >
        </td>
                  <td>
            <a href="#editEmployeeModal" class="edit" data-toggle="modal">
              <i class="material-icons" onclick="editProduct('${product._id}')" data-toggle="tooltip" title="Edit">&#xE254;</i>
            </a>
            <a href="#deleteEmployeeModal" class="delete" data-toggle="modal">
              <i class="material-icons" onclick="deleteProduct('${product._id}')" data-toggle="tooltip" title="Delete">&#xE872;</i>
            </a>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Function to submit the product form
async function submitForm() {
  try {
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const category = document.getElementById("productCategory").value;
    const imageInput = document.getElementById("productImage");
    const image = imageInput.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    console.log(image);

    const response = await fetch("http://localhost:5001/api/product", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();

      if (response.ok) {
        console.log(data.message);
        fetchProducts(); // Refresh the product list after successful submission
      } else {
        console.log(data.message);
        // Handle failed submission, display error message, etc.
      }
    } else {
      // Handle non-JSON response (e.g., plain text, file, etc.)
      const textData = await response.text();
      console.log("Non-JSON response:", textData);
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Initial fetch of products when the page loads
fetchProducts();
