const urls = document.querySelectorAll('.links a');
const pageUrl = window.location.href;


urls.forEach(url => {
  url.addEventListener('click', () => {

    urls.forEach(i => i.classList.remove('active'));
    

    url.classList.add('active');
  });
});