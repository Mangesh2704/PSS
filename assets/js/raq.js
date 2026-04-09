document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contactForm");
  const modal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");

  form.addEventListener("submit", function(e) {
    e.preventDefault(); // Prevent default form submission

    const formData = new FormData(form);

    // Convert FormData to URL-encoded string
    const data = new URLSearchParams();
    formData.forEach((value, key) => data.append(key, value));

    fetch("https://script.google.com/macros/s/AKfycbyEL6h64wAd71YdewsnWFtxFobDg7G9JnGYigANvQ6yC3s3s8xuR03RWz1xKXJpLIImxQ/exec", {
      method: "POST",
      body: data
    })
    .then(response => response.json())
    .then(result => {
      if(result.status === "success") {
        // Show modal
        modal.style.display = "flex";
        form.reset(); // clear form fields
      } else {
        alert("Error submitting form: " + result.message);
      }
    })
    .catch(error => alert("Error: " + error.message));
  });

  // Close modal
  closeModal.addEventListener("click", function() {
    modal.style.display = "none";
  });

  // Close modal on clicking outside the box
  modal.addEventListener("click", function(e) {
    if(e.target === modal) modal.style.display = "none";
  });
});