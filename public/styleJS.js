var coll = document.getElementsByClassName("collapsible");
    var i;

for (i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.display === "block") {
        content.style.display = "none";
        } else {
        content.style.display = "block";
        }
    });
}



// Check image status every 2 seconds
const intervalId = setInterval(() => {
    fetch('/image-status')
        .then(response => response.json())
        .then(data => {
        if (data.status === 'ready') {
            // Display the image
            const img = document.createElement('img');
            img.src = '/output.jpg';
            document.body.appendChild(img);
            clearInterval(intervalId);
        }
    });
}, 1000);
