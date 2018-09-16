
var process = document.querySelector('button'),
    input = document.querySelector('input'),
    count = document.getElementById('count'),
    results = document.querySelector('.results'),
    combinations = document.querySelector('.combinations');

    var total = 0;

var names = ['isaacasimov', 'iainmbanks', 'arthurclarke',
 'roalddahl', 'williamgibson', 'frankherbert', 'stephenking']

    // progress bar:
var progress=0;
var progressContainer = document.getElementById("progCon");
var progressBar = document.getElementById("progBar");
var progressText = document.querySelector(".prog-text");

function setProgress(newProgress) {
    contW = progressContainer.clientWidth;
    var pixelValue = (contW*newProgress/100);
    progressBar.style.width = pixelValue+"px";
    progressText.textContent = newProgress;
  }

input.addEventListener("keyup", function(event) {
    event.preventDefault();
    if(event.keyCode === 13) {
        process.click();
    }
});


process.onclick = function (event) {
    var letters = input.value;
    setProgress(0)
    total = 0;
    results.textContent = 'De-scrambling...';

    while (combinations.firstChild) {
        combinations.removeChild(combinations.firstChild);
    }

    console.log('Processing ' + letters + ':');
    var words = parseInt(count.value);

    var myJSON = {
        "type": "voldemot-request",
        "input": letters,
        "word-count": words
    };
    console.log(myJSON);

    // try {
        websocket = new WebSocket("ws://" + document.domain + ":9000/");
        websocket.onmessage = function (event) {
 
            data = JSON.parse(event.data);
            if (data['total-matches']) {
                if (data['value'] == 0){
                results.textContent = 'No combinations found';
                } else if (data['value'] == 1) {
                    results.textContent = '1 combination found';
                } else {
                    results.textContent = data['value'] + ' combinations found';
                }
                console.log("Total matches received: " + total);
            } else if (data['match']) {
                 var combo = document.createElement('div');
                combo.className = 'match';
                combo.textContent = data['value'].join(' ');
                combinations.appendChild(combo);
                total += 1;
            } else if (data['percent']) {
                console.log('percent done: ' + data['value']);
                setProgress(data['value'])
            }
        
        };
        
        websocket.onopen = function(evt) {
        websocket.send(JSON.stringify(myJSON));
        }
    // } catch (exception) {
        // console.error(exception);
    // }

    
};

input.focus();


input.value = names[Math.floor(Math.random() * names.length)];

// input.value = "albertcamus";

input.onchange = function (event) {
    console.log("New value: " + input.value)
}
