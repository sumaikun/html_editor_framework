function init_relative_drag_and_drop()
{
    console.log("init relative_drag and drop");
    interact('.resize-drag')
      .draggable({
        onmove: dragMoveListener,
       
      })
      .resizable({
        // resize from all edges and corners
        edges: { left: true, right: true, bottom: true, top: true },

        // keep the edges inside the parent
        restrictEdges: {
          outer: 'parent',
          endOnly: true,
        },

        // minimum size
        restrictSize: {
          min: { width: 100, height: 50 },
        },

        inertia: true,
      })
      .on('resizemove', function (event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0),
            y = (parseFloat(target.getAttribute('data-y')) || 0);

        // update the element's style
        target.style.width  = event.rect.width + 'px';
        target.style.height = event.rect.height + 'px';

        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        vx = (100/document.documentElement.clientWidth)*x;
        vy = (100/document.documentElement.clientHeight)*y;

        // translate the element
        target.style.webkitTransform = target.style.transform
                               = 'translate(' + vx + 'vw, ' + vy + 'vh)';

        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
        //target.textContent = Math.round(event.rect.width) + '\u00D7' + Math.round(event.rect.height);
      });


}

function dragMoveListener (event) {
  //console.log(event.target);
  //console.log(document.documentElement.clientWidth);

  var target = event.target,

  // keep the dragged position in the data-x/data-y attributes
  x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
  y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

  vx = (100/document.documentElement.clientWidth)*x;
  vy = (100/document.documentElement.clientHeight)*y;

  // translate the element
  target.style.webkitTransform = target.style.transform
                               = 'translate(' + vx + 'vw, ' + vy + 'vh)';
  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

init_relative_drag_and_drop();