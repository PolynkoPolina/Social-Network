const urls = document.querySelectorAll('.links a');
const path = window.location.pathname;


urls.forEach(url => {
  if (path == url.pathname){
    url.classList.add('chosen-page')
  }
});