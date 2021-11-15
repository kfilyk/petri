window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 50/3)} // simulate calling code 60

window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back

var canvas2=document.getElementById('map');
var ctx2 = canvas2.getContext("2d");
var canvas3=document.getElementById('dashboard');
var ctx3 = canvas3.getContext("2d");
var canvas4=document.getElementById('dashboard2');
var ctx4 = canvas4.getContext("2d");

canvas2.width=window.innerWidth;
canvas2.height=1000; // set number of pixels
canvas3.width=600; //console
canvas3.height=1000;
canvas4.width=600;
canvas4.height=1000;

ctx2.font = "10px Arial";
ctx3.font = "10px Arial";
ctx4.font = "10px Arial";
var mouseX = 0;
var mouseY = 0;
var mOX=0;
var mOY=0;
var lastX;
var lastY;
var canvasScale=1;
var tempOffsetX=0;
var tempOffsetY=0;
var cDrag=false;
var dot_flag = false;
var mouseOverMap = false;
var mouseOverConsole = false;
var leftPressed = false;
var rightPressed = false;
var pause=false;
var recording=false;
var highlighted=null;
var display=0;
var regenTiles=1;
var consumption=2;
var scoreType=0;
var newest=null;
var TWOPI=6.283185;
var DEG_TO_RAD = 0.017453;
var FIELDX=1000;
var FIELDY=1000;
var DASHX=600;
var DASHY=1000;
var TILENUMBER=(FIELDX/25)*(FIELDY/25);
var POPCAP=1500;
var SCORESCAP=25;
var CYCLEPOP=SCORESCAP;
var HIGHESTINDEX=-1;
var LIVEPOP=0;
var STARTSIZE=5;
var SIZECAP=10;
var MUTCAP=10;
var ALPH="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var BRAIN_SIZE=120; //number of neurons
var BRAIN_INPUTS=29; // input neurons
var BRAIN_OUTPUTS=22; //also count as recursive inputs
var tiles=new Array(TILENUMBER);
var animals=new Array(POPCAP);
var graveyard=[];
var scores=new Array(SCORESCAP);
var request=0;
/* STATS */
var netParents=0; // Adds to total (if parent) at time of death
var netLifespan=0; //Total number of years all animals have lived (recorded upon death)
var globalNetNRG=0;
var time=0;
var aveFER=0;

var aveChildren=0; //Ratio of number of children per parent
var aveLifespan=0;
var aveAge=0;
var avePosNRG=0;

var maxAveChildren=1;
var maxAveLifespan=1;
var maxAvePosNRG=1;
var maxAveAge=1;
var maxPPG=1;
var maxBPG=1;
var maxPop=1;

var redAgar=0; // count total red, green, blue on the map
var blueAgar=0;
var greenAgar=0;
var maxRedAgar=0;
var maxBlueAgar=0;
var maxGreenAgar=0;
var minRedAgar=0;
var minBlueAgar=0;
var minGreenAgar=0;

var aveAgeHist=[];
var aveFERHist=[];
var aveChildrenHist=[];
var aveLifespanHist=[];
var avePosNRGHist=[];
var redAgarHist=[];
var greenAgarHist=[];
var blueAgarHist=[];
var popHist=[];
var PPG=[];
var FPG=[]; //FER: Food Energy Ratio
var liveFPG;
var BPG=[];

var statLogs=[];

var graphs=new Array(5);
graphs[0]=0;
graphs[1]=1;
graphs[2]=2;
graphs[3]=4;
graphs[4]=7;

var accelerate=0;
var text;

function init() {
	canvas4.addEventListener("mouseover", function (e) {
		findxy('over', e, canvas4, 1)
	}, false);
	canvas4.addEventListener("mousemove", function (e) {
		findxy('move', e, canvas4, 1)
	}, false);
	canvas4.addEventListener("mousedown", function (e) {
		findxy('down', e, canvas4, 1)
	}, false);
	canvas4.addEventListener("mouseup", function (e) {
		findxy('up', e, canvas4, 1)
	}, false);
	canvas4.addEventListener("mouseout", function (e) {
		findxy('out', e, canvas4, 1)
	}, false);

	canvas2.addEventListener("mouseover", function (e) {
		findxy('over', e, canvas2, 0)
	}, false);
	canvas2.addEventListener("mousemove", function (e) {
		findxy('move', e, canvas2, 0)
	}, false);
	canvas2.addEventListener("mousedown", function (e) {
		findxy('down', e, canvas2, 0)
	}, false);
	canvas2.addEventListener("mouseup", function (e) {
		findxy('up', e, canvas2, 0)
	}, false);
	canvas2.addEventListener("mouseout", function (e) {
		findxy('out', e, canvas2, 0)
	}, false);
  canvas2.addEventListener("mousewheel", function (e) {
    e.preventDefault();
    var scaleDelta=e.wheelDelta;
    if(scaleDelta>20){
      scaleDelta=20;
    } else if(scaleDelta<-20){
      scaleDelta=-20;
    }
    var tSca = 1+scaleDelta/1000;
    // temp position: say at 500,500: translate then zoom-> displace 500,500 to top left, zoomed in by x/y pixels, displace back by less than original amount.
    if(canvasScale>0.5 && canvasScale<3){
      mOX+=(mouseX-mouseX*tSca)*canvasScale;
      mOY+=(mouseY-mouseY*tSca)*canvasScale;
      ctx2.translate(mouseX,mouseY);
      ctx2.scale(tSca,tSca);
      ctx2.translate(-mouseX,-mouseY);
      var rect = canvas2.getBoundingClientRect();
      mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * canvas2.width;
      mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * canvas2.height;
      mouseX-=mOX;
      mouseY-=mOY;
      canvasScale*=tSca;
      //console.log("SCALE: "+canvasScale);
      mouseX/=canvasScale;
      mouseY/=canvasScale;
    } else if(canvasScale<=0.5 && scaleDelta>=0){
      mOX+=(mouseX-mouseX*tSca)*canvasScale;
      mOY+=(mouseY-mouseY*tSca)*canvasScale;
      ctx2.translate(mouseX,mouseY);
      ctx2.scale(tSca,tSca);
      ctx2.translate(-mouseX,-mouseY);
      var rect = canvas2.getBoundingClientRect();
      mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * canvas2.width;
      mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * canvas2.height;
      mouseX-=mOX;
      mouseY-=mOY;
      canvasScale*=tSca;
      //console.log("SCALE: "+canvasScale);
      mouseX/=canvasScale;
      mouseY/=canvasScale;
    } else if(canvasScale>=3 && scaleDelta<=0){
      mOX+=(mouseX-mouseX*tSca)*canvasScale;
      mOY+=(mouseY-mouseY*tSca)*canvasScale;
      ctx2.translate(mouseX,mouseY);
      ctx2.scale(tSca,tSca);
      ctx2.translate(-mouseX,-mouseY);

      var rect = canvas2.getBoundingClientRect();
      mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * canvas2.width;
      mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * canvas2.height;
      mouseX-=mOX;
      mouseY-=mOY;

      canvasScale*=tSca;
      //console.log("SCALE: "+canvasScale);
      mouseX/=canvasScale;
      mouseY/=canvasScale;
    }
    //console.log("M X/Y: "+round(mouseX)+", "+round(mouseY));
    //console.log("MO X/Y: "+round(mOX)+", "+round(mOY));

  });
  document.addEventListener("keydown", function (e) {
    e.preventDefault();
    console.log("Pressed");
    console.log(e.keyCode);
    if(pause==true) {
      pause=false;
    } else {
      pause=true;
    }
  });

	tileManager.generate();
	dashboard.setup();
  cycle();
	//requestAnimationFrame(cycle);
}

function cycle() {
	tileManager.update();
	animalManager.update();
  inputManager.update();
  if(!pause && time%100==0){ // COLLECT EVERY 100 FRAMES
    statManager.update();
  }
  dashboard.update();
  update();
  if(!pause){
    time++;
  }
	//request=requestAnimationFrame(cycle);
}

var update=function() {
  requestAnimationFrame(cycle);
}
var tileManager = {
  // store total amounts of all agar
	generate : function() {
    redAgar=0; // reset current global agar quantity
    blueAgar=0;
    greenAgar=0;
    maxRedAgar=0; // reset global max agar quantity
    maxBlueAgar=0;
    maxGreenAgar=0;
    minRedAgar=0; // reset global min agar quantity
    minBlueAgar=0;
    minGreenAgar=0;
    redAgarHist=[];
    blueAgarHist=[];
    greenAgarHist=[];

    // old generation method
    /*
		var pos=0;
		for(var i=0;i<FIELDY;i+=25) {
			for(var j=0;j<FIELDX;j+=25) {
				tiles[pos]=new Tile(j,i,pos);
				pos++;
			}
		}
    */

    let neighbors = [];
    var pos=0;
		for(var i=0;i<FIELDY;i+=25) {
			for(var j=0;j<FIELDX;j+=25) {

        /*
        if tile x is not boundary x has neighbors:
        left  = pos - 1
        right = pos + 1
        above = pos - 40
        below = pos + 40

        if x is on a boundary, then its: 
        pos < 40 (top bound)
        pos >= 1560 (bottom bound)
        pos is a multiple of 40 (left bound)
        pos+1 is a multiple of 40 (right bound)
        */
        // check if tile is boundary
        if(pos >= 40) { // if not top bound
          neighbors.push(pos-40);
        } 
        if (pos < 1560) { // not bottom 
          neighbors.push(pos+40);
        } 
        if (pos %40 != 0) { // not left
          neighbors.push(pos-1);
        } 
        if ((pos +1) % 40 != 0 ) { // not right bound
          neighbors.push(pos+1);
        } 

				tiles[pos]=new Tile(j,i,pos, neighbors);

				pos++; // set to next tile
        isBoundary = -1; // reset boundary check
        neighbors = []; // empty/reset array
        neighbors.length = 0;

			}
		}

    // used for computed smoothing of terrain
    var minR,minG,minB, maxR, maxG,maxB;
    var rangeR,rangeG,rangeB;
    var RMult, GMult, BMult;

    var standardRangeR = 100;
    var standardRangeG = 100;
    var standardRangeB = 75;
    var standardMinR = 50;
    var standardMinG = 100;
    var standardMinB = 25;

    // now go through all tiles and average out their vals
    for(var iter = 0; iter<8; iter++) { // number of iterations determines
      minR = 255;
      minG = 255;
      minB = 255;
      maxR = 0;
      maxG = 0;
      maxB = 0;

      for(var i=0; i< pos; i++) {
        var t = tiles[i]; // get tile
        var aveRedAgar = t.RCap;
        var aveGreenAgar = t.GCap;
        var aveBlueAgar = t.BCap;
        
        for(n=0; n<t.neighbors.length; n++){ // for every neighbor, add neighbor quantities
          //console.log(t.neighbors.length);
          aveRedAgar += tiles[t.neighbors[n]].RCap;
          aveGreenAgar += tiles[t.neighbors[n]].GCap;
          aveBlueAgar += tiles[t.neighbors[n]].BCap;
        }
        t.RCap = aveRedAgar/(t.neighbors.length+1);
        t.GCap = aveGreenAgar/(t.neighbors.length+1);
        t.BCap = aveBlueAgar/(t.neighbors.length+1);
        t.R = t.RCap; // set new value for agar (smoothed)
        t.G = t.GCap;
        t.B = t.BCap;

        // save mins
        if(t.RCap < minR) {
          minR = t.RCap;
        }
        if(t.GCap < minG) {
          minG = t.GCap;
        }
        if(t.BCap < minB) {
          minB = t.BCap;
        }

        // save maxes
        if(t.RCap > maxR) {
          maxR = t.RCap;
        }
        if(t.GCap > maxG) {
          maxG = t.GCap;
        }
        if(t.BCap > maxB) {
          maxB = t.BCap;
        }
      }

      rangeR = maxR-minR;
      rangeG = maxG-minG;
      rangeB = maxB-minB;

      RMult = standardRangeR/rangeR;
      GMult = standardRangeG/rangeG;
      BMult = standardRangeB/rangeB;

      /* now standardize all tiles between bounds:
      // 50 < red < 150
      // 100 < green < 200
      // 25 < blue < 100
      */
      for(var i =0; i < pos; i++) {
        var t = tiles[i]; // get tile
        t.RCap = (t.RCap-minR)*RMult+ standardMinR;
        t.GCap = (t.GCap-minG)*GMult+ standardMinG;
        t.BCap = (t.BCap-minB)*BMult+ standardMinB;
        t.R = t.RCap;
        t.G = t.GCap;
        t.B = t.BCap;
      }
    }
	},

	update : function() {
    ctx2.clearRect(-50,-50,1100,50); //top
    ctx2.clearRect(-50,FIELDY,1100,50);//bottom
    ctx2.clearRect(-50,0,50,1000); //left
    ctx2.clearRect(FIELDX,0,50,1000); //right

    redAgar=0; // reset global count 
    greenAgar=0;
    blueAgar=0;
		for(var i=0; i<TILENUMBER; i++) {
			tiles[i].draw();
			if(!pause && regenTiles==1) {
				tiles[i].regenerate();
			}
		}
	}
}

var animalManager = {
	update : function() {
		for(var a,i=0; i<=HIGHESTINDEX; i++) {
      a = animals[i];
      if(a.alive==true) {
        a.draw(a.cols);
        if(pause==false) {
          a.sense();
          a.think(a.brain);
          a.eat();
          a.move();
          a.grow(); // adjust animal size/reproduction
          //a.learn(a.brain);
          a.grade();
          a.decay(); // check if animal dies
        }

        if(leftPressed && mouseOverMap) {
          if(abs(a.x-mouseX)<a.size && abs(a.y-mouseY)<a.size) {
            if(highlighted!=null) {
              if(display==2) {
                display=1;
              }
            }
            if(highlighted!= i) {
              highlighted=i;
              leftPressed=false;
            }
          }
        }
      }
		}
	}
}
var statManager = {
  update : function() {
    aveAge=aveAge/100;
    aveFER=aveFER/100;
    aveChildren=aveChildren/100;
    if(graveyard.length>0){
      aveLifespan=netLifespan/graveyard.length;
      avePosNRG=globalNetNRG/graveyard.length;
    }else {
      aveLifespan=0;
      avePosNRG=0;
    }
    aveFERHist.push(aveFER); //add up all the ratios and divide by the number of living creatures
    if(recording && time==10000){
      var l=new statLog(time, accelerate, redAgar, greenAgar, blueAgar, aveFER);
      statLogs.push(l);
    }
    liveFPG=null;
    liveFPG=new Array(PPG.length);
    for(var i=0;i<PPG.length; i++){
      liveFPG[i]=FPG[i];
    }
    for(var a, i=0; i<=HIGHESTINDEX; i++){
      a = animals[i];
      if(a.alive==true){
        liveFPG[a.gen]+=(a.posFood/a.netFood);
      }
    }

    aveChildrenHist.push(aveChildren);
    if(aveChildren>maxAveChildren){
      maxAveChildren=aveChildren;
    }
    aveChildren=0;

    aveLifespanHist.push(aveLifespan);
    avePosNRGHist.push(avePosNRG);

    redAgarHist.push(redAgar);
    blueAgarHist.push(blueAgar);
    greenAgarHist.push(greenAgar);

    aveAgeHist.push(aveAge);
    popHist.push(LIVEPOP);
    if(LIVEPOP>maxPop){
      maxPop=LIVEPOP;
    }
    if(aveAge>maxAveAge){
      maxAveAge=aveAge;
    }
    aveFER=0;
    aveAge=0;
    if(aveLifespan>maxAveLifespan){
      maxAveLifespan=aveLifespan;
    }
    if(avePosNRG>maxAvePosNRG){
      maxAvePosNRG=avePosNRG;
    }

    if(redAgar>maxRedAgar){
      maxRedAgar=redAgar;
    }
    if(greenAgar>maxGreenAgar){
      maxGreenAgar=greenAgar;
    }
    if(blueAgar>maxBlueAgar){
      maxBlueAgar=blueAgar;
    }
    if(redAgar<minRedAgar){
      minRedAgar=redAgar;
    }
    if(greenAgar<minGreenAgar){
      minGreenAgar=greenAgar;
    }
    if(blueAgar<minBlueAgar){
      minBlueAgar=blueAgar;
    }
  }
}
var dashboard = {
	setup : function() {
		ctx3.fillStyle=rgbToHex(50,50,50);
		ctx3.fillRect(0,0,DASHX,DASHY);
		ctx3.fillStyle="#FFFFFF";
		ctx3.strokeStyle="#FFFFFF";
		var posy=15;
		ctx3.fillText("PETRI 2.18", 10, posy);
		ctx3.fillText("LIVE: ", 10, posy+=10);
		ctx3.fillText("DEAD: ", 10, posy+=10);
		ctx3.fillText("HIND: ", 10, posy+=10);
		ctx3.fillText("NEW: ", 10, posy+=10);
    ctx3.fillText("TIME: ", 10, posy+=10);
		var posx2=440;
		posy=10;

    //menu
		ctx3.fillRect(posx2,posy,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
    ctx3.fillRect(posx2,posy+=20,150,12);
    ctx3.fillRect(posx2,posy+=20,150,12);

		ctx3.fillStyle= "#323232";
		posy=20;
		ctx3.fillText("CLEAR",posx2+5,posy);
		ctx3.fillText("GENERATE",posx2+5,posy+=20);
		ctx3.fillText("MUT HIGHSCORES",posx2+5,posy+=20);

		if(scoreType==0) {
			ctx3.fillText("SCORE CHILDREN",posx2+5,posy+=20);
		} else if(scoreType==1) {
			ctx3.fillText("SCORE AGE",posx2+5,posy+=20);
		} else {
      ctx3.fillText("SCORE ENERGY",posx2+5,posy+=20);
    }

    ctx3.fillText("CONSUMPTION x"+consumption,posx2+5,posy+=20);

    if(regenTiles==1) {
			ctx3.fillText("REGEN TILES ON",posx2+5,posy+=20);
		} else {
			ctx3.fillText("REGEN TILES OFF",posx2+5,posy+=20);
		}

    if(accelerate==0) {
      ctx3.fillText("ACCELERATE OFF",posx2+5,posy+=20);
    } else {
      ctx3.fillText("ACCELERATE "+accelerate,posx2+5,posy+=20);
    }
    ctx3.fillText("LOAD",posx2+5,posy+=20);

    posx2=280;
    posy=20;
	},
	update : function() {
    ctx4.clearRect(0, 0, DASHX, DASHY);
		if(display!=1 && display!=2) {

			var posx=50;
			var posy=15;
      ctx4.beginPath();
			ctx4.fillStyle="#FFFFFF";
      if(recording==false){
        ctx4.arc(380,16,6,0,TWOPI);
        ctx4.fill();
      } else {
        ctx4.fillStyle="#FF0000";
        ctx4.arc(380,16,6,0,TWOPI);
        ctx4.fill();
      }
      ctx4.fillStyle="#FFFFFF";
      
      // play/pause buttons
      if(pause==false){
        ctx4.fillRect(400,10,3,12);
        ctx4.fillRect(406,10,3,12);
      } else {
        ctx4.beginPath();
        ctx4.moveTo(400,10);
        ctx4.lineTo(400,22);
        ctx4.lineTo(410,16);
        ctx4.lineTo(400,10);
        ctx4.fill();
        ctx4.stroke();
      }

      // Shows living population
			ctx4.fillText(LIVEPOP, posx, posy+=10);
			ctx4.fillText(graveyard.length, posx, posy+=10);
      if(mouseOverConsole && leftPressed) {
        if(mouseX>10 && mouseX<120) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            if(graveyard.length!=0){ // If graveyard length = 1, then index ==0: send to highlighted as -(length)+1. 0-> -1, 1 -> -2, 2->-3
              highlighted=(-graveyard.length); // goes to index at graveyard.length, shows most recently deceased
            }
            leftPressed=false;
          }
        }
      }
      // Shows the highest index (for debugging)
			ctx4.fillText(HIGHESTINDEX, posx, posy+=10);
			if(mouseOverConsole && leftPressed) {
				if(mouseX>10 && mouseX<120) {
					if(mouseY>posy-5 && mouseY<posy+5) {
						highlighted=HIGHESTINDEX;
						leftPressed=false;
					}
				}
      }
      
      // Shows most recent animal birth
			if(newest!=null) {
				if(newest<0) {
					ctx4.fillText(graveyard[-(newest+1)].name+"-"+graveyard[-(newest+1)].gen+"D"+graveyard[-(newest+1)].children.length, posx, posy+=10);
				} else {
					ctx4.fillText(animals[newest].name+"-"+animals[newest].gen+"A"+animals[newest].children.length, posx, posy+=10);
				}
				if(mouseOverConsole && leftPressed) {
					if(mouseX>10 && mouseX<120) {
						if(mouseY>posy-5 && mouseY<posy+5) {
							highlighted=newest;
							leftPressed=false;
						}
					}
				}
			} else {
				posy+=10;
      }
      
      // Show time
      ctx4.fillText(time, posx, posy+=10);
			posx=10;
			posy=75;
			ctx4.fillStyle="#FFFFFF";
			ctx4.fillText("HIGHSCORES:",posx,posy);
			for(var i=0;i<SCORESCAP;i++) {
				if(scores[i]!=null) {
          if(scoreType==0){
            if(scores[i]<0){
              var a1=graveyard[-(scores[i]+1)];
              ctx4.fillText(a1.name+"-"+a1.gen+"D"+a1.children.length, posx, posy+=10);
            } else {
              var a1=animals[scores[i]];
              ctx4.fillText(a1.name+"-"+a1.gen+"A"+a1.children.length, posx, posy+=10);
            }
  					if(mouseOverConsole && leftPressed) {
  						if(mouseX>posx && mouseX<posx+90 && mouseY>posy-5 && mouseY<posy+5) {
  							if(display==2) {
  								display=1;
  							}
  							highlighted=scores[i]; // index stored in "scores" array
  						}
  					}
          } else {
            if(scores[i]<0){
              var a1=graveyard[-(scores[i]+1)];
              ctx4.fillText(a1.name+"-"+a1.gen+"D"+a1.children.length+": "+round(a1.score), posx, posy+=10);
            } else {
              var a1=animals[scores[i]];
              ctx4.fillText(a1.name+"-"+a1.gen+"A"+a1.children.length+": "+round(a1.score), posx, posy+=10);
            }
            if(mouseOverConsole && leftPressed) {
              if(mouseX>posx && mouseX<posx+90 && mouseY>posy-5 && mouseY<posy+5) {
                if(display==2) {
                  display=1;
                }
                highlighted=scores[i]; // index stored in "scores" array
              }
            }
          }
				} else {
					break;
				}
			}

      var buttonX=450;
      ctx4.fillStyle="#FFFFFF";
      for(var i=0;i<5; i++){
        ctx4.beginPath();
        ctx4.arc(buttonX,175,7,0,TWOPI);
        ctx4.fill();
        if(leftPressed){
          if(mouseOverConsole && abs(mouseX-buttonX)<6 && abs(mouseY-175)<6) {
            if(graphs[i]<8){
              graphs[i]++;
            } else {
              graphs[i]=-1;
            }
            leftPressed=false;
          }
        } else if(rightPressed){
          if(mouseOverConsole && abs(mouseX-buttonX)<6 && abs(mouseY-175)<6) {
            if(graphs[i]>-1){
              graphs[i]--;
            } else {
              graphs[i]=8;
            }
            rightPressed=false;
          }
        }
        buttonX+=32;
      }
      buttonX=450;
      ctx4.fillStyle="#323232";
      for(var i=0;i<5; i++){
        ctx4.fillText(graphs[i], buttonX-3, 178);
        buttonX+=32;
      }

      var lineX= DASHX/(~~(time/100));
      posy=600;
      ctx4.fillStyle="#FFFFFF";
      ctx4.strokeStyle="#FFFFFF";
      for(var i=0;i<5; i++){
        if(graphs[i]==0){
          graph(lineX, posy, aveFERHist, "FER: ", 1);
        } else if(graphs[i]==1){
          graph(lineX, posy, aveChildrenHist, "CHI: ", maxAveChildren);
        } else if(graphs[i]==2){
          graph(lineX, posy, aveLifespanHist, "LFSPN: ", maxAveLifespan);
        } else if(graphs[i]==3){
          graph(lineX, posy, avePosNRGHist, "POSNRG: ", maxAvePosNRG);
        } else if(graphs[i]==4){
          graph(lineX, posy, popHist, "POP: ", maxPop);

        } else if(graphs[i]==5){
          if(PPG.length>0){
            var iW=0;
            if(PPG.length>1){
              iW = DASHX/(PPG.length-1);
            }
            genGraph(iW, posy, liveFPG, "FPG: ", 1); // FER Per Gen
          }
        } else if(graphs[i]==6){
          if(PPG.length>0){
            var iW=0;
            if(PPG.length>1){
              iW = DASHX/(PPG.length-1);
            }
            genGraph(iW, posy, BPG, "BPG: ", maxBPG);
          }
        } else if(graphs[i]==7){
          if(PPG.length>0){
            var iW=0;
            if(PPG.length>1){
              iW = DASHX/(PPG.length-1);
            }
            popGenGraph(iW, posy, PPG, "PPG: ", maxPPG);
          }
        } else if(graphs[i]==8){
          var tR=-1;
          var tG=-1;
          var tB=-1;
          var showReso=0;
          var l =redAgarHist.length-1;
          var total =round(redAgarHist[l]+greenAgarHist[l]+blueAgarHist[l]);
          ctx4.strokeStyle="#FF0000";
          tR=resoGraph(lineX, posy, 80, redAgarHist, "R: ", minRedAgar, maxRedAgar);
          ctx4.strokeStyle="#00FF00";
          tG=resoGraph(lineX, posy, 70, greenAgarHist, "G: ", minGreenAgar, maxGreenAgar);
          ctx4.strokeStyle="#0000FF";
          tB=resoGraph(lineX, posy, 60, blueAgarHist, "B: ", minBlueAgar, maxBlueAgar);
          if(tR>-1){
            ctx4.fillText("TIME: "+tR, 10, posy-50);
            tR=round(tR/100);
            total =round(redAgarHist[tR]+greenAgarHist[tR]+blueAgarHist[tR]);
          } else if(tG>-1){
            ctx4.fillText("TIME: "+tG, 10, posy-50);
            tG=round(tG/100);
            total =round(redAgarHist[tR]+greenAgarHist[tR]+blueAgarHist[tR]);
          } else if(tB>-1){
            ctx4.fillText("TIME: "+tB, 10, posy-50);
            tB=round(tB/100);
            total =round(redAgarHist[tR]+greenAgarHist[tR]+blueAgarHist[tR]);
          }
          ctx4.strokeStyle="#FFFFFF";
          ctx4.fillText(total, 10, posy-90);

        }
        posy+=100;
      }
    }

		if(highlighted!=null) {
			if(highlighted<0) {
				graveyard[-(highlighted+1)].highlight();
			} else {
				animals[highlighted].highlight();
			}
		}
	}
}
function graph(lx, y, g, txt, max) {
  var initY;
  var endY;
  var show=0;
  var posx=0;
  ctx4.beginPath();
  for(var i=0; i<g.length-1; i++){ // Will begin once array has length of at least 2. Initial length==1. Wait until length 2
    initY = 100*g[i]/max;
    endY= 100*g[i+1]/max;
    ctx4.moveTo(posx,y-initY);
    ctx4.lineTo(posx+lx, y-endY);

    if(mouseOverConsole && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
      if(show==0) {
        ctx4.fillText(txt+(round(100*g[i])/100), 10, y-90);
        ctx4.fillText("TIME: "+(i*100), 10, y-80);
        show=1;
      }
    }
    posx+=lx;
    initY=endY;
  }
  if(show==0){
    ctx4.fillText(txt+round(100*g[g.length-1])/100, 10, y-90);
  }
  ctx4.stroke();
}

function resoGraph(lx, y, s, g, txt, min, max) {
  var initY;
  var endY;
  var show=0;
  var showTime=-1;
  var posx=0;
  var range=(max-min);
  ctx4.beginPath();
  for(var i=0; i<g.length-1; i++){ // Will begin once array has length of at least 2. Initial length==1. Wait until length 2
    initY=round(100*((g[i]-min)/range));
    endY=round(100*((g[i+1]-min)/range));
    ctx4.moveTo(posx,y-initY);
    ctx4.lineTo(posx+lx,y-endY);

    if(mouseOverConsole && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
      if(show==0) {
        ctx4.fillText(txt+round(g[i]), 10, y-s);
        showTime=i*100;
        show=1;
      }
    }
    posx+=lx;
    initY=endY;
  }
  if(show==0){
    ctx4.fillText(txt+round(g[g.length-1]), 10, y-s);
  }
  ctx4.stroke();
  return showTime;
}
function genGraph(lx, y, g, txt, max) {
  var initY;
  var endY;
  var show=0;
  var posx=0;
  ctx4.beginPath();
  for(var i=0; i<g.length-1; i++){
    initY= round(100*(g[i]/PPG[i])/max);
    endY=round(100*(g[i+1]/PPG[i+1])/max);
    ctx4.moveTo(posx,y-initY);
    ctx4.lineTo(posx+lx,y-endY);
    if(mouseOverConsole && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
      if(show==0) {
        ctx4.fillText(txt+round(100*(g[i]/PPG[i]))/100, 10, y-90);
        ctx4.fillText("GEN "+i, 10, y-80);
        show=1;
      }
    }
    posx+=lx;
  }
  if(show==0){
    ctx4.fillText(txt+round(100*g[g.length-1]/PPG[g.length-1])/100, 10, y-90);
    ctx4.fillText("GEN "+(g.length-1), 10, y-80);
  }
  ctx4.stroke();
}
function popGenGraph(lx, y, g, txt, max) {
  var initY;
  var endY;
  var show=0;
  var posx=0;
  ctx4.beginPath();
  for(var i=0; i<g.length-1; i++){ // Will begin once array has length of at least 2. Initial length==1. Wait until length 2
    initY= round(100*g[i]/max);
    endY=round(100*g[i+1]/max);
    ctx4.moveTo(posx,y-initY);
    ctx4.strokeRect((posx-1), (y-initY-1),2,2);
    ctx4.lineTo(posx+lx,y-endY);
    if(mouseOverConsole && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
      if(show==0) {
        ctx4.fillText(txt+round(100*g[i])/100, 10, y-90);
        ctx4.fillText("GEN "+i, 10, y-80);
        show=1;
      }
    }
    posx+=lx;
  }
  if(show==0){
    ctx4.fillText(txt+round(100*g[g.length-1])/100, 10, y-90);
    ctx4.fillText("GEN "+(g.length-1), 10, y-80);
  }
  ctx4.stroke();
}
function resetStats(){
  time=0;
  netLifespan=0;
  globalNetNRG=0;
  aveFER=0;

  aveChildren=0;
  aveLifespan=0;
  avePosNRG=0;

  maxAveChildren=1;
  maxAveLifespan=1;
  maxAvePosNRG=1;

  LIVEPOP=0;
  HIGHESTINDEX=0;
  for(var a, i=0; i<animals.length;i++){
    a=animals[i];
    if(a!=null && a.alive==true){
      LIVEPOP++;
      HIGHESTINDEX=i;
    }
  }

  aveChildrenHist=[];
  aveLifespanHist=[];
  avePosNRGHist=[];
  aveFERHist=[];
  PPG=[];
  FPG=[];
  BPG=[];
  maxPPG=0;
  maxBPG=0;
  for(var a, i=0; i<=HIGHESTINDEX;i++){
    a=animals[i];
    while(a.gen>=PPG.length){
      PPG.push(0);
      FPG.push(0);
      BPG.push(0);
    }
    if(a.alive==true) {
      PPG[a.gen]++;
      if(PPG[a.gen]>maxPPG){
        maxPPG=PPG[a.gen];
      }
      BPG[a.gen]+=a.brainCost;
      if(BPG[a.gen]/PPG[a.gen]>maxBPG){
        maxBPG=BPG[a.gen]/PPG[a.gen];
      }
    }
  }

  popHist=[];
  redAgar=0;
  blueAgar=0;
  greenAgar=0;
  maxRedAgar=0;
  maxBlueAgar=0;
  maxGreenAgar=0;
  minRedAgar=0;
  minBlueAgar=0;
  minGreenAgar=0;
  redAgarHist=[];
  blueAgarHist=[];
  greenAgarHist=[];
}

function statLog(t, a, rA, gA, bA, fer) {
  this.time=t;
  this.acc=a;
  this.rAgar=rA;
  this.gAgar=gA;
  this.bAgar=bA;
  this.fer=fer;
}

var inputManager= {
	update: function() {
		if(mouseOverMap) { // mouse over map
			//gen 1 random
			if(rightPressed) {
				if(LIVEPOP<POPCAP) {
					var i=0;
					while(animals[i]!=null) {
						if(animals[i].top<SCORESCAP || animals[i].alive==true) {
							i++;
						} else {
							break;
						}
					}
					animals[i]=null;
					animals[i]=new Animal(round(mouseX),round(mouseY),i);
					LIVEPOP++;
					if(i>HIGHESTINDEX) {
						HIGHESTINDEX=i;
					}
				}
				rightPressed=false;
			} else if(leftPressed){
        ctx2.clearRect(-500,-500,2000,500); //top
        ctx2.clearRect(-500,FIELDY,2000,500);//bottom
        ctx2.clearRect(-500,0,500,1000); //left
        ctx2.clearRect(FIELDX,0,500,1000); //right
        if(!cDrag) {
          cDrag = true;
          lastX = mouseX; // init mx, my
          lastY = mouseY;
        } else {
          ctx2.translate(mouseX-lastX, mouseY-lastY);
          tempOffsetX+=(mouseX-lastX)*canvasScale;
          tempOffsetY+=(mouseY-lastY)*canvasScale;
          lastX = mouseX;
          lastY = mouseY;
        }
      } else if(cDrag){
        cDrag = false;
        mOX+=tempOffsetX;
        mOY+=tempOffsetY;
        tempOffsetX=0;
        tempOffsetY=0;
      }
		} else if(mouseOverConsole) { //dashboard mouse
			if(leftPressed) {

        //RECORD
				if(mouseX>374 && mouseX<386 && mouseY>10 && mouseY<22) {
          if(recording==false) {
						recording=true;
					} else {
            recording=false;
          }
          leftPressed=false;
				}
        //PAUSE
				if(mouseX>400 && mouseX<410 && mouseY>10 && mouseY<20) {
					if(pause==false) {
						pause=true;
					} else {
            pause=false;
          }
          leftPressed=false;
				}

        // dashboard MENU
        if((mouseX>440)&&(mouseX<590) && display!=1 && display!=2) {
					if((mouseY>10)&&(mouseY<20)) { // CLEAR
						highlighted=null;
						newest=null;
						scores=null;
						animals=null;
            graveyard=null;
						scores=new Array(SCORESCAP);
						animals=new Array(POPCAP);
            graveyard=[];

            resetStats();

						dashboard.setup();
						tileManager.generate();
						LIVEPOP=0;
						HIGHESTINDEX=-1;
						leftPressed=false;
					} else if((mouseY>30)&&(mouseY<40)) {  // GENERATE
						newSimulation();
					}else if((mouseY>50)&&(mouseY<60)) { // MUT 100 HIGHSCORES
						if(HIGHESTINDEX>=SCORESCAP) {
							genHS();
              resetStats();
						}
            leftPressed=false;
					}else if((mouseY>70)&&(mouseY<80)) { // SCORES TYPE
						if(scoreType==0){ // scoreType 0/1/2: Childs/Age/Energy
              scoreType=1;
            } else if(scoreType==1){
              scoreType=2;
            } else {
              scoreType=0;
            }
            resetScore();
            leftPressed=false;
					}else if((mouseY>90)&&(mouseY<100)) { // FOOD AVAILABLE
						consumption+=0.5;
						if(consumption>4) {
							consumption=0.5;
						}
						dashboard.setup();
						leftPressed=false;
					} else if((mouseY>110)&&(mouseY<120)) { // REGEN TILES
						if(regenTiles==0) {
							regenTiles=1;
						} else {
							regenTiles=0;
						}
						dashboard.setup();
						leftPressed=false;
					} else if((mouseY>130)&&(mouseY<140)) { // ACCELERATE MODE
            if(accelerate==12) {
              accelerate=0;
            } else {
              accelerate++;
            }
						dashboard.setup();
						leftPressed=false;
          }
        }

        if((mouseX>440)&&(mouseX<590) && display!=1 && display!=2) {
          if((mouseY>150)&&(mouseY<160)) { // LOAD
            highlighted=null;
            newest=null;
            scores=null;
            animals=null;
            scores=new Array(SCORESCAP);
            animals=new Array(POPCAP);
            loadPetri();
            resetStats();
            tileManager.update();
            dashboard.setup();
            leftPressed=false;
          }
				}
			}
		}
	}
}

function newSimulation() {
  //pause=true;
  highlighted=null;
  newest=null;
  scores=null;
  animals=null;
  scores=new Array(SCORESCAP);
  animals=new Array(POPCAP);
  for(var i=0;i<100;i++) {
    animals[i]=new Animal(round(Math.random()*FIELDX),round(Math.random()*FIELDY), i);
  }
  resetStats();
  dashboard.setup();
  tileManager.generate();
  leftPressed=false;
  savePetri();
}

function savePetri() {
  var animalString = JSON.stringify(animals);
  var tileString = JSON.stringify(tiles);

  var f=null, createFile=function(text) {
    var data=new Blob([text], {type: 'application/javascript'});
    if(f!==null){
      window.URL.revokeObjectURL(f);
    }
    f = window.URL.createObjectURL(data);
    return f;
  };
  var link=document.getElementById('download');
  link.href=createFile("var savedAnimals= '"+animalString+"'; \n\n"+"var savedTiles= '"+tileString+"'; ");
  link.style.display='block';
}

function loadPetri() {
  var animalData = JSON.parse(savedAnimals);
  for(var i=0;i<animalData.length;i++){
  	if(animalData[i]!=null){
  		animals[i]=Object.assign(new Animal, animalData[i]);
      for(var j=0; j<animalData[i].brain.length;j++) {
          animals[i].brain[j]=Object.assign(new Neuron, animalData[i].brain[j]);
          var weights=new Float32Array(BRAIN_SIZE);
          for(var k=0;k<BRAIN_SIZE;k++){
            weights[k]=animalData[i].brain[j].weights[k];

          }
          animals[i].brain[j].weights=weights;
  		}
      animals[i].mouth=Object.assign(new Mouth, animalData[i].mouth);
      for(var j=0;j<5;j++){
        animals[i].eyes[j]=Object.assign(new Eye, animalData[i].eyes[j]);
      }
      var cols=new Uint8ClampedArray(15);
      for(var j=0;j<15;j++){
        cols[j]=animalData[i].cols[j];
      }
      animals[i].cols=cols;
  	}
  }

  var tileData = JSON.parse(savedTiles);
  for(var i=0;i<tileData.length;i++){
    tiles[i]=Object.assign(new Tile, tileData[i]);
  }
}

function resetScore() {
  for(var i=0;i<=HIGHESTINDEX;i++){
    if(animals[i].alive==true){
      if(scoreType==0){
        animals[i].score = animals[i].children.length;
      } else if(scoreType==1){
        animals[i].score = animals[i].age;
      } else {
        animals[i].score = animals[i].gain;
      }
    }
  }
  for(var l=0, dA=graveyard.length; l<dA; l++){
    var dead = graveyard[l];
    if(scoreType==0){
      dead.score = dead.children.length;
    } else if(scoreType==1){
      dead.score = dead.age;
    } else {
      dead.score = dead.gain;
    }
  }
  for(var l=0, dA=graveyard.length; l<dA; l++){
    var dead = graveyard[l];
    for(var i=0, sC=SCORESCAP;i<sC;i++) { //from #1 to bottom
			if(dead.top<=i) { // if position is higher than i (#1 already, no need to look at #25)
				break;
			} if(scores[i]==null){
				if(dead.top<sC) {
					scores[dead.top]=null;
				}
        scores[i]=dead.index; //If called from graveyard during resetScore, it should work... no bugs yet
				dead.top=i;
				break;
			}else {
        if(scores[i]<0){
          if(dead.score>graveyard[-(scores[i]+1)].score) {
            if(dead.top<sC) {
              scores[dead.top]=null;
            }
            var j;
            for(j=0;j<sC;j++) {
              if(scores[j]==null) {
                scores[j]=scores[i];
                graveyard[-(scores[j]+1)].top=j;
                break;
              }
            }
            if(j==sC) {
              graveyard[-(scores[i]+1)].top=sC;
            }
            scores[i]=dead.index;
            dead.top=i;
            break;
          }
        } else {
          if(dead.score>animals[scores[i]].score) {
    				if(dead.top<sC) {
    					scores[dead.top]=null;
    				}
    				var j;
    				for(j=0;j<sC;j++) {
    					if(scores[j]==null) {
    						scores[j]=scores[i];
    						animals[scores[j]].top=j;
    						break;
    					}
    				}
    				if(j==sC) {
    					animals[scores[i]].top=sC;
    				}
            scores[i]=dead.index;
    				dead.top=i;
    				break;
    			}
        }
      }
		}
  }
  dashboard.setup();
}
 
// Generate a new population pool based on animals with highest scores
function genHS() {
	display=0;
	highlighted=null;
	newest=null;
	var a2 =new Array(POPCAP);
	var it=0;
	for(var j=0, sC=SCORESCAP; j<sC; j++) {
		if(scores[j]!=null){
      var a = new Animal(500,500,it);
      var an = new Animal(500,500,it+1);
      var ani = new Animal(500,500,it+2);
      var anim = new Animal(500,500,it+3);
      if(scores[j]>=0){
        animals[scores[j]].x=round(Math.random()*FIELDX);
        animals[scores[j]].y=round(Math.random()*FIELDY);
        a2[it]=a;
        animals[scores[j]].mutate(a2[it]);
        a2[it].pidx=null;
        a2[it+1]=an;
        animals[scores[j]].mutate(a2[it+1]);
        a2[it+1].pidx=null;
        a2[it+2]=ani;
        animals[scores[j]].mutate(a2[it+2]);
        a2[it+2].pidx=null;
        a2[it+3]=anim;
        animals[scores[j]].mutate(a2[it+3]);
        a2[it+3].pidx=null;
        it+=4;
      } else {
        animals[-(scores[j]+1)].x=round(Math.random()*FIELDX);
        animals[-(scores[j]+1)].y=round(Math.random()*FIELDY);
        a2[it]=a;
        animals[-(scores[j]+1)].mutate(a2[it]);
        a2[it].pidx=null;
        a2[it+1]=an;
        animals[-(scores[j]+1)].mutate(a2[it+1]);
        a2[it+1].pidx=null;
        a2[it+2]=ani;
        animals[-(scores[j]+1)].mutate(a2[it+2]);
        a2[it+2].pidx=null;
        a2[it+3]=anim;
        animals[-(scores[j]+1)].mutate(a2[it+3]);
        a2[it+3].pidx=null;
        it+=4;
      }
    }
	}
	animals=null;
	animals=new Array(POPCAP);
	animals=a2;
	a2=null;
	scores=null;
	scores=new Array(SCORESCAP);
  resetStats();
	dashboard.setup();
	tileManager.generate();
}

function namer() {
	var n="";
	for(var i=0;i<4;i++) {
		n+=ALPH.charAt(round(Math.random()*25));
	}
	return n;
}

function findxy(res, e, canv, m) {
	if (res == 'down') {
    var rect = canv.getBoundingClientRect();
    mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * canv.width;
    mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * canv.height;
    if(m==0){
      mouseX-=mOX;
      mouseY-=mOY;
      mouseX/=canvasScale;
      mouseY/=canvasScale;
    }
		if(e.button === 0){
			leftPressed = true;
		} else if(e.button === 2){
			rightPressed = true;
		}
		dot_flag = true;
	}
	if (res == 'up' || res == "out") {
		if(e.button === 0){
			leftPressed = false;
		} else if(e.button === 2){
			rightPressed = false;
		}
	}
	if (res == 'move') {
    var rect = canv.getBoundingClientRect();
    mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * canv.width;
    mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * canv.height;
    if(m==0){
      mouseX-=mOX;
      mouseY-=mOY;
      mouseX/=canvasScale;
      mouseY/=canvasScale;
    }
	}
	if (res == 'over') {
    var rect = canv.getBoundingClientRect();
    mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * canv.width;
    mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * canv.height;
    if(m==0){
      mouseX-=mOX;
      mouseY-=mOY;
      mouseX/=canvasScale;
      mouseY/=canvasScale;
    }
	}
  if(m==0){
    mouseOverMap=true;
    mouseOverConsole=false;
  } else {
    mouseOverMap=false;
    mouseOverConsole=true;
  }
}

function rgbToHex(r,g,b) {
  return "#" + ((1 << 24)+(r << 16)+(g << 8)+b).toString(16).slice(1);
}
function round(x) {
  return Math.round(x);
	//return ~~(x + (x>0 ? .5:-.5));
}
function abs(x) {
	return (x>0 ? x:-x);
}

function Tile(x,y,num, neighbors) {
	this.x=x;
	this.y=y;
	this.num=num;
	this.regenRate=(Math.random()*0.1)+0.05;
	this.RCap = round(Math.random()*100)+50; // for this particular tile, red food caps at maximum of 150
	this.GCap = round(Math.random()*100)+100; // green food caps at 200
	this.BCap = round(Math.random()*75)+25; // blue food caps at 100
	this.R=this.RCap; // current r, g, b agar content
	this.G=this.GCap;
	this.B=this.BCap;
  this.neighbors = neighbors;
  redAgar+=this.R; // count towards global red Agar
  greenAgar+=this.G;
  blueAgar+=this.B;
}

Tile.prototype.draw=function() {
  ctx2.fillStyle=rgbToHex((this.R<50 ? 50:round(this.R)), (this.G<50 ? 50:round(this.G)), (this.B<50 ? 50:round(this.B)));
  ctx2.fillRect(this.x,this.y,25,25);
  if(mouseOverMap && mouseX>this.x-25 && mouseX<this.x+50 && mouseY>this.y-25 && mouseY<this.y+50) {
    if(!leftPressed) {
      ctx2.fillStyle=rgbToHex((this.R-30<0 ? 0:round(this.R)-30), (this.G-30<0 ? 0:round(this.G)-30), (this.B-30<0 ? 0:round(this.B)-30));
      ctx2.fillText(this.num,this.x,this.y+25);
    } else if(mouseX>this.x && mouseX<this.x+25 && mouseY>this.y && mouseY<this.y+25) {
      ctx2.fillStyle=rgbToHex((this.R-30<0 ? 0:round(this.R)-30), (this.G-30<0 ? 0:round(this.G)-30), (this.B-30<0 ? 0:round(this.B)-30));
      ctx2.fillText(round(this.R),this.x,this.y+8);
      ctx2.fillText(round(this.G),this.x,this.y+16);
      ctx2.fillText(round(this.B),this.x,this.y+25);
    }
  }
  redAgar+=this.R;
  greenAgar+=this.G;
  blueAgar+=this.B;
}

Tile.prototype.regenerate=function() {
  if(this.R<this.RCap) {
    this.R+=this.regenRate;
  }
  if(this.G<this.GCap) {
    this.G+=this.regenRate;
  }
  if(this.B<this.BCap) {
    this.B+=this.regenRate;
  }
}

function Neuron() {
  // upon new input, brain signals are initially weak and do not affect creature. Grow stronger over time.
  //why try to determine which input neurons are optimal to start with? Start from simple to complex; Do not attempt all at same time.
  // neural connections start
  this.weights=new Float32Array(BRAIN_SIZE);  // one connection for every other neuron in brain - including input and output neurons
	this.bias=0;
  this.in=0;
  /*
  this.i1=0; // for recursion...
  this.i2=0;
  this.i3=0;
  this.o1=0;
  this.o2=0;
  this.o3=0;
  */
  this.out=0;
	this.cost=0;
}
Neuron.prototype.initRandomWeights=function(x, y) { // if this.in>=0 return this.in*weights[0]
  for(var i=x;i<y;i++) {
    var c=2*Math.random()-1;
    this.weights[i]=c;
    this.cost+=abs(c); // add cost of weight to
	}
}

 // used by output neurons only?
Neuron.prototype.calc=function() { // calculates sum of inputs + bias to be used in synapse
  this.out = this.in+this.bias; // 
}


Neuron.prototype.synapse=function(idx) { // if this.in>=0 return this.in*weights[0]
  return this.out*this.weights[idx] + this.bias;
}

// Eye creature component
function Eye(x,y) {
	this.dis=0; //
  this.angle=0; // polar angle of eye
	this.x=x;
	this.y=y;
	this.tile=null;
  this.r=0;
  this.g=0;
  this.b=0;
	this.sense=0;
	this.sees=0;
}

Eye.prototype.setXY=function(o,x,y) {
  this.x=x+this.dis*(Math.cos(DEG_TO_RAD*(o+this.angle)));
  this.y=y+this.dis*(Math.sin(DEG_TO_RAD*(o+this.angle)));
  if(this.x>=0 && this.y>=0 && this.x<FIELDX && this.y<FIELDY) {
    this.tile=((~~(this.y/25)*40)+(~~(this.x/25)));
    if(this.tile<0 || this.tile>=TILENUMBER) {
      this.tile=null;
      this.r=0;
      this.g=0;
      this.b=0;
    }
  } else {
    this.tile=null;
    this.r=0;
    this.g=0;
    this.b=0;
  }
}

// Mouth creature component
function Mouth(x,y) {
  this.dis=0;
  this.angle=0;
	this.x=x;
	this.y=y;
	this.tile=null;
  this.r=0;
  this.g=0;
  this.b=0;
	this.sense=0;
	this.sees=0;
}

Mouth.prototype.setXY=function(o,x,y) {
  this.x=x+this.dis*(Math.cos(DEG_TO_RAD*(o+this.angle)));
  this.y=y+this.dis*(Math.sin(DEG_TO_RAD*(o+this.angle)));
  if(this.x>=0 && this.y>=0 && this.x<FIELDX && this.y<FIELDY) {
    this.tile=((~~(this.y/25)*40)+(~~(this.x/25)));
    if(this.tile<0 || this.tile>=TILENUMBER) {
      this.tile=null;
      this.r=0;
      this.g=0;
      this.b=0;
    }
  } else {
    this.tile=null;
    this.r=0;
    this.g=0;
    this.b=0;
  }
}
