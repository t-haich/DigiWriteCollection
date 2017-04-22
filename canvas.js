var soundStartTime;
var oscillator, audioContext;
try {
  audioContext = new AudioContext(); // Create audio container
} catch(e) {
  alert('Web Audio API is not supported in this browser');
}
function doAudio(when) {
  alert('inside do audio before sending signal');
  oscillator = audioContext.createOscillator(); // Create sound source
  oscillator.connect(audioContext.destination); // Connect sound to output
  alert('connected to' + audioContext.destination.toString());
  oscillator.start(0); // Play instantly
  if (when == 'start') soundStartTime = new Date().getTime();
  setTimeout(function() {
    oscillator.stop();
  }, 100);
}

function doFirebaseCanvas () {
  // === canvas stuff
  // most of this came from http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/#demo-simple
  var canvasDiv = document.getElementById('canvas');
  canvas = document.createElement('canvas');
  canvas.setAttribute('width', window.innerWidth-10);
  canvas.setAttribute('height', window.innerHeight-20-$('uk-navbar').height());
  canvas.setAttribute('id', 'canvas');
  canvasDiv.appendChild(canvas);
  if(typeof G_vmlCanvasManager != 'undefined') {
    canvas = G_vmlCanvasManager.initElement(canvas);
  }
  context = canvas.getContext("2d");

  var clickX;
  var clickY;
  var clickDrag;
  var clickState;
  var clickTimes;
  var paint;
  function clear() {
    clickX = new Array();
    clickY = new Array();
    clickDrag = new Array();
    clickState = new Array();
    clickTimes = new Array();
    
    redraw();
  }

  clear();

  var startTime;
  function addClick(x, y, dragging, state) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickState.push(state);
    clickTimes.push(new Date().getTime());
  }

  function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    
    context.strokeStyle = "#df4b26";
    context.lineJoin = "round";
    context.lineWidth = 5;
        
    for(var i=0; i < clickX.length; i++) {
      context.beginPath();
      if(clickDrag[i] && i) {
        context.moveTo(clickX[i-1], clickY[i-1]);
       }
       else {
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.stroke();
    }
  }

  $('#canvas').on('mousedown touchstart', function(e) {
    var eventX;
    var eventY;
    if(e.type == 'touchstart') {
      eventX = e.originalEvent.touches[0].pageX;
      eventY = e.originalEvent.touches[0].pageY;
    }
    else {
      eventX = e.pageX;
      eventY = e.pageY;
    }

    paint = true;
    addClick(eventX - this.offsetLeft, eventY - this.offsetTop, false, 'down');
    redraw();
  });

  $('#canvas').on('mousemove touchmove', function(e) {
    e.preventDefault();
    var eventX;
    var eventY;
    if(e.type == 'touchmove') {
      eventX = e.originalEvent.touches[0].pageX;
      eventY = e.originalEvent.touches[0].pageY;
    }
    else {
      eventX = e.pageX;
      eventY = e.pageY;
    }

    if(paint){
      addClick(eventX - this.offsetLeft, eventY - this.offsetTop, true, 'draw');
      redraw();
    }
  });

  $('#canvas').on('mouseup mouseleave touchend touchcancel', function(e) {
    if (clickState) clickState[clickState.length - 1] = 'up';
    paint = false;
  });

  // === button stuff
  var firebaseState = new Firebase("https://digiwrite.firebaseio.com/state");
  var firebaseData = new Firebase("https://digiwrite.firebaseio.com/data");
  $('#record-button').click(function() {
    if($('#record-button').text() == 'Start') {
      // alert('before calling do audio');
      doAudio('start');
      firebaseState.set('on');
      startTemplate($('#animate').prop('checked'));

      $('#record-button').text('Stop');
      $('#record-button').removeClass('uk-button-success');
      $('#record-button').addClass('uk-button-danger');
      clear();

      startTime = new Date().getTime();
    }
    else {
      firebaseState.set('off');
      doAudio('stop');
      var stopTime = new Date().getTime();
      stopTemplate();

      $('#record-button').text('Start');
      $('#record-button').removeClass('uk-button-danger');
      $('#record-button').addClass('uk-button-success');

      // prompt for session ID
      UIkit.modal.prompt("Session ID:", '', function(name){
        var data = {};
        data[soundStartTime] = 'start';
        for(var i = 0; i < clickX.length; i++) {
          var line = {};
          line['x'] = clickX[i];
          line['y'] = clickY[i];
          line['state'] = clickState[i];
          data[clickTimes[i]] = line;
        }
        data[stopTime] = 'stop';
        var label = new Date().getTime() + '-' + name;
        firebaseData.child(label).set(data);
        var url = firebaseData + '/' + label + '.json';
        UIkit.modal.alert('Written to: <a href="' + url + '">' + url + '</a>');

        clear();
      });
    }
  });
}