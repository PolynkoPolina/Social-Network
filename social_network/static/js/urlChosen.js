const urls = document.querySelectorAll('.links a');
const pageUrl = window.location.href;


urls.forEach(url => {
    urlName = url.href;
    if  (urlName == pageUrl){
        url.classList.add('chosen-page');
    }
});
if (pageUrl.split('/').filter(Boolean).pop() == 'albums'){
    urls[4].classList.add('chosen-page');
}