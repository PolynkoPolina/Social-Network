const urls = document.querySelectorAll('.links a');


urls.forEach(url => {
  url.addEventListener('click', (e) => {
    url.classList.add('chosen-page');
  });
});