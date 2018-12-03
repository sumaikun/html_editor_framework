	var cv; //canvas
	var ctx; //context
	var img1 = new Image(); //Image = img tag
	var img2 = new Image();
	
	var animTime = null;
	var counter = 0; //counter for anim to run
	
	
	var boyX = 0;
	var boyY = 150;//start from top left of boy image;
  var boyVelY = 0;
  var boyVelX = 10;
	var boyImg = img1;
  var boyDir = "right";
	var allImageLoaded = 0;
	var totalimages = 2;

  var gravity = 2;
  var boyMoving = false;
  var boyJumping = false;
  var groundY = 150;
  
	function run() {
		cv = document.getElementById("elaineboy");
		ctx = cv.getContext("2d");
		
		document.addEventListener("keydown", moveMe);
		document.addEventListener("keyup", stopMe);
		img1.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/160783/boy1.png";
		img1.onload = function() { //image to load			 
			allImageLoaded++
		} 
		img2.src = "https://s3-us-west-2.amazonaws.com/s.cdpn.io/160783/boy2.png";
		img2.onload = function() { 
			allImageLoaded++
		}
		animTime = setInterval(animBoy, 100);
			
	}

		function animBoy() {
			var xpos = counter*89;
			counter++;
			if(counter > 10){
				counter = 0;	
			}
      
			if (allImageLoaded == 2){
				ctx.clearRect(0,0, 550, 400);
        if (boyJumping == true){
          if( boyY + boyVelY <= groundY ){
             boyY += boyVelY;
             boyVelY += gravity;
          } else {
             boyVelY = 0;
             boyJumping = false;
          }
        }
        
        if ( animateBoy == true ){
          
          if(boyDir == "right"){
            boyVelX = 10;
            boyImg = img1;
            boyX += boyVelX;	
            if(boyX >= 550-89){
              boyX = 550-89;
            }
          } else {
            boyVelX = -10;
            boyImg = img2;
            boyX += boyVelX;	
            if(boyX <=0){
              boyX = 0;
            }
          }
          
          
        }
        if ( animateBoy == true ){
					ctx.drawImage(boyImg, xpos, 0, 89, 103, boyX, boyY, 89, 103); 
				} else {
					ctx.drawImage(boyImg, 0, 0, 89, 103, boyX, boyY, 89, 103); 
				}
			}	
      ctx.strokeStyle = "#ccc";
      ctx.lineWidth = 1;
      ctx.moveTo(0,251);
      ctx.lineTo(550,251);
      ctx.stroke();
		}
		
	var animateBoy = false;
	
	function stopMe(e){
    if(e.keyCode == 37 || e.keyCode == 39){
      animateBoy = false;	  
    }
		
  
	}
	function moveMe(e) {		
     
    if(e.keyCode == 32 && !boyJumping){
      boyJumping = true;
      boyVelY = -10;
    }
		if(e.keyCode == 39){	 //right
      
			boyDir = "right";
			
			animateBoy = true;
		}		
		if(e.keyCode == 37) { 	//left
			boyDir = "left";
			 
			animateBoy = true;
		}
	}
run();