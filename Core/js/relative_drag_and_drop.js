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

        
        //console.log(event.rect.width);
        //console.log(event.rect.height);

        vwidth = (100/document.documentElement.clientWidth)*event.rect.width;
        vheight = (100/document.documentElement.clientHeight)*event.rect.height;

        simuheight = (100/document.documentElement.clientWidth)*event.rect.height;    

        //console.log(vwidth);
        //console.log(simuheight);
        //console.log(vheight);

        // update the element's style
        target.style.width  = vwidth + 'vw';
        //target.style.width  = event.rect.width + 'px';
        //target.style.height = event.rect.height + 'px';
        target.style.height = simuheight + 'vw';


        // translate when resizing from top or left edges
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        vx = (100/document.documentElement.clientWidth)*x;
        vy = (100/document.documentElement.clientWidth)*y;
        //vy = (100/document.documentElement.clientHeight)*y;

        // translate the element
        target.style.webkitTransform = target.style.transform
                               = 'translate(' + vx + 'vw, ' + vy + 'vw)';

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
  vy = (100/document.documentElement.clientWidth)*y;
  //vy = (100/document.documentElement.clientHeight)*y;

  // translate the element
  target.style.webkitTransform = target.style.transform
                               = 'translate(' + vx + 'vw, ' + vy + 'vw)';
  // update the posiion attributes
  target.setAttribute('data-x', x);
  target.setAttribute('data-y', y);
}

init_relative_drag_and_drop();

  /*if(event.rect.width.includes("vw"))
        {
            console.log("include vw");
            wx = event.rect.width/(100/document.documentElement.clientWidth); 
            wy =  event.rect.height/(100/document.documentElement.clientHeight);
        }
        else{
            wx = event.rect.width;
            wy = event.rect.height; 
        }
        

        vwidth = (100/document.documentElement.clientWidth)*wx;
        vheight = (100/document.documentElement.clientHeight)*wy;  */ 