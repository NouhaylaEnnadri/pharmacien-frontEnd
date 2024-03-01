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
  }