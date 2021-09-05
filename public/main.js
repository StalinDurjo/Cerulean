$(document).ready(function(){
    setTimeout(function(){
        $('.alert').remove();
   }, 4000);
});

// window.addEventListener('DOMContentLoaded', function(){
//     fetch('http://localhost:3000/posts/api/5c212f929fe46f0bc81a0554')
//     .then(res => res.json())
//     .then(data => {
//         console.log(data);
//         console.log(data.data.post_image);
//         document.querySelector('#testFile').value = data.data.post_image;
//     })
//     .catch(err => {
//         console.log(err);
//     });
//     // setTimeout(function(){
//     //     document.querySelector('#testFile').textContent = 'test image';
//     // }, 2000);
//     document.querySelector('.navbar-brand').innerHTML = 'Hello';
// });
