var ready = false;
var timeout;
function doTemplate() {
  var canvasDiv = document.getElementById('template');
  template = document.createElement('canvas');
  width = window.innerWidth-10;
  height = window.innerHeight-20-$('uk-navbar').height();
  template.setAttribute('width', width);
  template.setAttribute('height', height);
  template.setAttribute('id', 'template');
  canvasDiv.appendChild(template);
  if(typeof G_vmlCanvasManager != 'undefined') {
    template = G_vmlCanvasManager.initElement(template);
  }
  ctx = template.getContext('2d');
  ctx.clearRect(0, 0, template.width, template.height); // Clears the canvas
  ctx.strokeStyle = '#2980b9';
  ctx.lineWidth = 5;

  $.getJSON('template.json', function(data) {
    startTemplate = function(animate) {
      ready = true;
      ctx.closePath();
      ctx.clearRect(0, 0, template.width, template.height); // Clears the canvas
      ctx.strokeStyle = '#2980b9';
      ctx.lineWidth = 5;
      ctx.beginPath();
      if (animate) {
          timeout = setTimeout(function() {
            animateDraw(data, 0);
          }, data[0].time / 1000);
      } else {
        for (var i = 0; i < data.length; i++) {
          var point = data[i];
          draw(point.x, point.y, point.state, ctx);
        }
      }
    }
  });
}

var startTemplate;

function stopTemplate() {
  ready = false;

}

function animateDraw(data, i) {
  clearTimeout(timeout);
  if (!ready) return;
  if (i < data.length) {
    var point = data[i];
    draw(point.x, point.y, point.state, ctx, true);
    timeout = setTimeout(function() {
      animateDraw(data, i+1);
    }, point.time / 1000)
  }
}

function draw(x, y, state, ctx, animate) {
  if (state == 'down') {
    // ctx.beginPath();
    ctx.moveTo(x, y);
  } else if (state == 'draw') {
    ctx.lineTo(x, y);
    if (animate) ctx.stroke();
  } else if (state == 'up') {
    ctx.lineTo(x, y);
    // ctx.closePath();
    ctx.stroke();
  }
}