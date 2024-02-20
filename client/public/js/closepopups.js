// handle closing the boxes
const popupCloseBtns = document.querySelectorAll('.popup-close');
const popupCancelBtns = document.querySelectorAll('.cancel-btn');
console.log('close btns')
console.log(popupCloseBtns)
const popupBoxes = document.querySelectorAll('.pop-up');

function closeAllPopups() {
  console.log('close popups')
  popupBoxes.forEach(popupBox => {
    popupBox.classList.remove('active');
  });
}

popupCloseBtns.forEach(btn => {
  btn.addEventListener('click', closeAllPopups);
});

popupCancelBtns.forEach(btn => {
  btn.addEventListener('click', closeAllPopups);
});