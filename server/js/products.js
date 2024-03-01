// Function to fetch products from the server
async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5001/api/product");
    const products = await response.json();

    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";

    products.forEach((product) => {
      const row = `
        <tr>
          <td>${product.name}</td>
          <td>${product.category}</td>
          <td>${product.subCategory}</td>

          <td style="white-space: normal;">${product.description}</td>
          <td>
            <img src="http://127.0.0.1:5501/server/${product.image}" alt="${product.name}"
                style="max-width: 100px; max-height: 100px;">
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
    // Handle the error, e.g., show an alert
  }
}
fetchProducts();

// Function to submit the product form
async function submitForm() {
  try {
    const name = document.getElementById("productName").value;
    const description = document.getElementById("productDescription").value;
    const category = document.getElementById("productCategory").value;
    const subCategory = document.getElementById("productSubcategory").value;

    const imageInput = document.getElementById("productImage");
    const image = imageInput.files[0];

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("subCategory", subCategory);
    formData.append("category", category);

    formData.append("image", image);

    const response = await fetch("http://localhost:5001/api/product", {
      method: "POST",
      body: formData,
    });

    const contentType = response.headers.get("content-type");
    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
    } else {
      console.log(data.message);
      // Handle failed submission, display error message, etc.
    }
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Function to delete a product with confirmation
async function deleteProduct(productId) {
  try {
    // Ask for confirmation before proceeding
    const isConfirmed = confirm(
      "Are you sure you want to delete this product?"
    );

    if (!isConfirmed) {
      return; // If not confirmed, exit the function
    }

    const response = await fetch(
      `http://localhost:5001/api/product/${productId}`,
      {
        method: "DELETE",
      }
    );

    const contentType = response.headers.get("content-type");
    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
      fetchProducts(); // Refresh the product list after successful deletion
    } else {
      console.log(data.message);
      // Handle failed deletion, display error message, etc.
      alert(`Failed to delete product: ${data.message}`);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
}
function editProduct(productId) {
  // Set the currentProductId before opening the modal
  currentProductId = productId;

  // Fetch the product details using the productId and populate the modal fields
  fetch(`http://localhost:5001/api/product/${productId}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          `Failed to fetch product details. Status: ${response.status}`
        );
      }
      return response.json();
    })
    .then((product) => {
      console.log(product);

      // Populate the modal fields with the product details
      document.getElementById("editProductName").value = product.name;
      document.getElementById("editProductDescription").value =
        product.description;
      document.getElementById("editProductCategory").value = product.category;

      // Set the image source
      const editProductImage = document.getElementById("editProductImage");

      if (editProductImage) {
        // Check if the product has an image
        if (product.image) {
          editProductImage.src = product.image;
        } else {
          // If no new image is selected, keep the previous image
          editProductImage.src = "path_to_previous_image.jpg";
        }
      } else {
        console.error("Image element not found.");
      }

      // Show the "Edit Product" modal
      $("#editEmployeeModal").modal("show");
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      // Handle the error, e.g., show an alert to the user
      alert("Error fetching product details. Please try again.");
    });
}
// Function to update a product
async function updateProduct() {
  try {
    const name = document.getElementById("editProductName").value;
    const description = document.getElementById("editProductDescription").value;
    const category = document.getElementById("editProductCategory").value;
    const imageInput = document.getElementById("editProductImage");
    const newImage = imageInput.files[0];

    // Create FormData to handle both JSON and file data
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", newImage);

    const response = await fetch(
      `http://localhost:5001/api/product/${currentProductId}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    const contentType = response.headers.get("content-type");
    const data = await response.json();

    if (response.ok) {
      console.log(data.message);
      fetchProducts(); // Refresh the product list after successful update
      // Hide the "Edit Product" modal after updating
      $("#editEmployeeModal").modal("hide");
    } else {
      console.log(data.message);
      // Handle failed update, display error message, etc.
      alert(`Failed to update product: ${data.message}`);
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Failed to fetch. Please check your network connection.");
  }
}

// Initial fetch of products when the page loads
fetchProducts();
