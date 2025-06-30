const tabs = document.querySelectorAll(".tab");
const sportTypeSelect = document.getElementById("sportType");

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));

    tab.classList.add("active");

    const sport = tab.getAttribute("data-sport");
    sportTypeSelect.value = sport;
  });
});

const createMatchForm = document.getElementById("createMatchForm");
createMatchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert(
    "Match created successfully! In a real application, this would be saved to a database."
  );
  createMatchForm.reset();
});

const joinButtons = document.querySelectorAll(".join-button");
joinButtons.forEach((button) => {
  button.addEventListener("click", () => {
    alert(
      "You have joined this match! In a real application, you would be added to the player list."
    );
  });
});



// Add event listener for logout button
document.getElementById('logoutBtn').addEventListener('click', handleLogout);