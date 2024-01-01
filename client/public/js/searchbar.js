const searchBar = document.querySelector('.search-bar');
const searchButton = document.querySelector('.search-btn');

console.log(searchBar, searchButton);

searchButton.addEventListener('click', () => {
  const searchText = searchBar.value;
  window.location.href = `/host?search=${searchText}`;
})

