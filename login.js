function switchForm(formType) {
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (formType === "signup") {
    loginForm.classList.add("hidden");
    signupForm.classList.remove("hidden");
  } else {
    signupForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  }
}


function togglePassword(icon) {
  const input = icon.previousElementSibling;
  const type = input.getAttribute("type") === "password" ? "text" : "password";
  input.setAttribute("type", type);

  icon.classList.toggle("fa-eye");
  icon.classList.toggle("fa-eye-slash");
}


document.addEventListener("DOMContentLoaded", function () {
  const forms = document.querySelectorAll(".auth-form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const button = this.querySelector(".auth-btn.primary");
      const originalText = button.innerHTML;
      button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
      button.disabled = true;

      setTimeout(() => {
        button.innerHTML = originalText;
        button.disabled = false;
        alert(
          "Form submitted! (This would connect to Firebase in the actual app)"
        );
      }, 2000);
    });
  });



  const inputs = document.querySelectorAll("input");
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused");
      }
    });
  });
});












function openTermsModal() {
  document.getElementById("termsModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}


function closeTermsModal() {
  document.getElementById("termsModal").style.display = "none";
  document.body.style.overflow = "auto"; // Restore scrolling
}

function acceptTerms() {
  
  const termsCheckbox = document.querySelector(
    '#signupForm input[type="checkbox"]'
  );
  if (termsCheckbox) {
    termsCheckbox.checked = true;
  }
  closeTermsModal();
}


window.onclick = function (event) {
  const modal = document.getElementById("termsModal");
  if (event.target === modal) {
    closeTermsModal();
  }
};


document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    closeTermsModal();
  }
});
