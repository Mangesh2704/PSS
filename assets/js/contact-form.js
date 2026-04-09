document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("contactForm");

  // Success modal
  const modalHTML = `
    <div id="successModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; 
      background:rgba(0,0,0,0.5); z-index:1000; justify-content:center; align-items:center;">
      <div style="background:white; padding:30px; border-radius:10px; max-width:400px; width:90%; text-align:center; font-family: Arial, sans-serif;">
        <h3 style="color:#65b530;">Thank You!</h3>
        <p>Your request has been submitted successfully.</p>
        <button id="closeModal" style="padding:10px 20px; background:#65b530; color:white; border:none; border-radius:5px; cursor:pointer;">Close</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modal = document.getElementById("successModal");
  const closeModal = document.getElementById("closeModal");

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = new URLSearchParams();
    formData.forEach((value, key) => data.append(key, value));

    fetch("https://script.google.com/macros/s/AKfycbzFHoXt3ZL_C3LtslfP4L_NmuIUnNe9Tq5b9BTdnANdcPco_rUP3L32ZX_o73KVIciU/exec", {
      method: "POST",
      body: data
    })
    .then(res => res.json())
    .then(result => {
      if(result.status === "success") {
        modal.style.display = "flex"; // Show modal
        form.reset();
      } else {
        alert("Error: " + result.message);
      }
    })
    .catch(err => alert("Error: " + err.message));
  });

  closeModal.addEventListener("click", () => modal.style.display = "none");
  modal.addEventListener("click", (e) => { if(e.target === modal) modal.style.display = "none"; });
});