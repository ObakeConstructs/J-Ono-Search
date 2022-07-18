
document.addEventListener("keyup", (e) => {
  if (e.key === "Escape" && document.getElementById('popup').style.display === "block") closePopup();
});

//=================================================================================

document.getElementById('blackOverlay').addEventListener("click", function(event) {
  if (event.target.closest(".popup")) return;
  closePopup();
});

//=================================================================================

function closePopup() {
  hideOverlay();
  document.getElementById('popup').style.display = 'none';
}

//=================================================================================

function showOverlay() {
  document.getElementById('blackOverlay').style.display = 'block';
}

//=================================================================================

function hideOverlay() {
  document.getElementById('blackOverlay').style.display = 'none';
}
