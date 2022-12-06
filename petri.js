window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 50/3)} // simulate calling code 60

window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back

// canvas 2 controls the map
var map=document.getElementById('map');
var ctx2 = map.getContext("2d");
var stats=document.getElementById('brain');
var ctx4 = stats.getContext("2d");

map.width=window.innerWidth;
map.height=1000; // set number of pixels
stats.width=1000;
stats.height=1000;

ctx2.font = "10px Arial";
ctx4.font = "10px Arial";
var mouseX = 0;
var mouseY = 0;
var mouseOriginalX=0;
var mouseOriginalY=0;
var prevMouseX;
var prevMouseY;
var canvasScale=1;
var dragOffsetX=0;
var dragOffsetY=0;
var cDrag=false;
var dot_flag = false;
var mouseOverMap = false;
var mouseOverConsole = false;
var leftPressed = false;
var rightPressed = false;
var pause=false; // whether simulation is paused
var recording=false;
var highlighted=null;
var display=0;
var regenTiles=1;
var consumption=2;
var scoreType=0;
var newest=null;
var TWOPI=6.283185;
var DEG_TO_RAD = 0.0174533;
var FIELDX=1000;
var FIELDY=1000;
var DASHX=600;
var DASHY=1000;
var TILENUMBER=(FIELDX/25)*(FIELDY/25);
var POPCAP=1000;
var SCORESCAP=3;
var CYCLEPOP=SCORESCAP;
var HIGHESTINDEX=-1;
var LIVEPOP=0;
var MUTCAP=10;
var ALPH="ABCDEFGHIJKLMNOPQRSTUVWXYZ";

var tiles=new Array(TILENUMBER);
var animals=new Array(POPCAP);
var graveyard=[];

var gold = null;
var silver = null;
var bronze = null;

var request=0;
/* STATS */
var netParents=0; // Adds to total (if parent) at time of death
var netLifespan=0; //Total number of years all animals have lived (recorded upon death)
var globalNetNRG=0;
var time=0;
var aveFER=0;

var aveChildren=0; //Ratio of number of children per parent
var aveLifespan=0;
var avePosNRG=0;

var maxAveChildren=1;
var maxAveLifespan=1;
var maxAvePosNRG=1;
var maxPPG=1;
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

var aveFERHist=[];
var aveChildrenHist=[];
var aveLifespanHist=[];
var avePosNRGHist=[];
var redAgarHist=[];
var greenAgarHist=[];
var blueAgarHist=[];
var popHist=[];
var PPG=[];

var statLogs=[];

var accelerate=0;

var text;

const currentKeysPressed = {};
var leftAccel = 0;
var rightAccel = 0;
var upAccel = 0;
var downAccel = 0;

function highlight_newest() {
  highlighted=newest;
}

function highlight_gold() {
  highlighted=gold;
}
function highlight_silver() {
  highlighted=silver;
}

function highlight_bronze() {
  highlighted=bronze;
}

function pauseSimulation() {
  if(pause==true) {
    pause=false;
    document.getElementById("play-button").src="icons/play.png"
  } else {
    pause=true;
    document.getElementById("play-button").src="icons/pause.png"
  }
}

function init() {

  stats.addEventListener("mouseover", function (e) {
		findxy('over', e)
    mouseOverConsole = true;
	}, false);
	stats.addEventListener("mousemove", function (e) {
		findxy('move', e)
	}, false);
	stats.addEventListener("mousedown", function (e) {
		findxy('down', e)
	}, false);
	stats.addEventListener("mouseup", function (e) {
		findxy('up', e)
	}, false);
	stats.addEventListener("mouseout", function (e) {
		findxy('out', e)
    mouseOverConsole = false;
	}, false);

	map.addEventListener("mouseover", function (e) {
		findxy('over', e)
    mouseOverMap = true;
	}, false);
	map.addEventListener("mousemove", function (e) {
		findxy('move', e)
	}, false);
	map.addEventListener("mousedown", function (e) {
		findxy('down', e)
	}, false);
	map.addEventListener("mouseup", function (e) {
		findxy('up', e)
	}, false);
	map.addEventListener("mouseout", function (e) {
		findxy('out', e)
    mouseOverMap = false;
	}, false);
  map.addEventListener("mousewheel", function (e) {
    e.preventDefault();
    var scaleDelta=e.wheelDelta;
    if(scaleDelta>20){
      scaleDelta=20;
    } else if(scaleDelta<-20){
      scaleDelta=-20;
    }
    var tSca = 1+scaleDelta/500;
    // temp position: say at 500,500: translate then zoom-> displace 500,500 to top left, zoomed in by x/y pixels, displace back by less than original amount.
    
    
    // Set canvas scaling
    mouseOriginalX+=(mouseX-mouseX*tSca)*canvasScale;
    mouseOriginalY+=(mouseY-mouseY*tSca)*canvasScale;
    ctx2.translate(mouseX,mouseY);
    ctx2.scale(tSca,tSca);
    ctx2.translate(-mouseX,-mouseY);
    var rect = map.getBoundingClientRect();
    mouseX=(e.clientX - rect.left) / (rect.right - rect.left) * map.width;
    mouseY=(e.clientY - rect.top) / (rect.bottom - rect.top) * map.height;
    mouseX-=mouseOriginalX;
    mouseY-=mouseOriginalY;
    canvasScale*=tSca;
    //console.log("SCALE: "+canvasScale);
    mouseX/=canvasScale;
    mouseY/=canvasScale;
    
    //console.log("M X/Y: "+round(mouseX)+", "+round(mouseY));
    //console.log("MO X/Y: "+round(mouseOriginalX)+", "+round(mouseOriginalY));

  });

  // if spacebar pressed  
  document.addEventListener("keydown", function (e) {
    e.preventDefault();
    currentKeysPressed[event.key] = true;

    if(e.keyCode == 32) {
      pauseSimulation();
    } 
  });



    
  document.addEventListener("keyup", function (e) {
    e.preventDefault();
    currentKeysPressed[e.key] = false;
    if(e.key == 'a' || e.key== 'ArrowLeft') { 
      leftAccel = 0;
    } else if(e.key == 'w' || e.key == 'ArrowUp') {
      upAccel = 0;
    } else if(e.key == 's' || e.key == 'ArrowDown') {
      downAccel = 0;
    } else if(e.key == 'd' || e.key == 'ArrowRight') {
      rightAccel = 0;
    } 
  });

	tileManager.generate();
	dashboard.setup();
  cycle();
	//requestAnimationFrame(cycle);
  // zoom in to canvas x3 upon init
  canvasScale = 3;
  ctx2.scale(3,3);
}

function cycle() {
	tileManager.update();
	animalManager.update();
  inputManager.update();
  if(!pause && time%100==0){ // COLLECT EVERY 100 FRAMES
    statManager.update();
  }
  dashboard.update(); // update dashboard parameters
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
    // reset certain stats pertaining to creature interaction
    if(pause==false) {
      gold = null;
      silver = null;
      bronze = null;

      // reset a number of interaction conditions
      for(var a, i=0; i<=HIGHESTINDEX; i++) {
        a = animals[i];
        if(a.alive==true) {
          a.decay(); // check if animal dies this round
          a.sense();

          if(gold == null || animals[i].descendants > animals[gold].descendants) {
            gold = i;
          } else if(silver == null || animals[i].descendants > animals[silver].descendants) {
            silver = i;
          } else if(bronze == null || animals[i].descendants > animals[bronze].descendants) {
            bronze = i;
          }

        }
      }
      
      if(gold != null) {document.getElementById("dash-gold").innerHTML = animals[gold].name+"-"+animals[gold].gen+"A"+animals[gold].children.length;}
      if(silver != null) {document.getElementById("dash-silver").innerHTML = animals[silver].name+"-"+animals[silver].gen+"A"+animals[silver].children.length;}
      if(bronze != null) {document.getElementById("dash-bronze").innerHTML = animals[bronze].name+"-"+animals[bronze].gen+"A"+animals[bronze].children.length;}
    }

		for(var a, i=0; i<=HIGHESTINDEX; i++) {
      a = animals[i];
      if(a.alive==true) {
        a.draw(a.cols);
        if(pause==false) {
          a.think();
          a.eat();
          a.move();
          //a.learn(a.brain);
          a.grow(); // adjust animal size/reproduction
        }

        // if mouse over creature, highlight creature
        if(leftPressed && mouseOverMap) {
          if(abs(a.x-mouseX)<= a.size+1 && abs(a.y-mouseY)<= a.size+1) {
            if(highlighted!=null) {
              if(display==2) {
                display=1;
              }
            }
            if(highlighted!= i) {
              highlighted=i;
              console.log(animals[i])
              document.getElementById("dash-highlighted").innerHTML = "HIGHLIGHTED: " + animals[highlighted].name +"-"+animals[highlighted].gen+"A"+animals[highlighted].children.length;
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

    popHist.push(LIVEPOP);
    if(LIVEPOP>maxPop){
      maxPop=LIVEPOP;
    }
    aveFER=0;
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

	},

	update : function() {
    // Shows living population
    if(newest!=null) {
      //console.log(newest)
      if(newest<0) {
        document.getElementById("dash-newest").innerHTML = "NEW: " + graveyard[-(newest+1)].name+"-"+graveyard[-(newest+1)].gen+"D"+graveyard[-(newest+1)].children.length;
      } else {
        document.getElementById("dash-newest").innerHTML = "NEW: " + animals[newest].name+"-"+animals[newest].gen+"A"+animals[newest].children.length;
      }
    }
    document.getElementById("dash-time").innerHTML = "TIME: " + time;

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
    if(mouseOverConsole && leftPressed) {
      if(mouseX>10 && mouseX<120) {
        if(mouseY>posy-5 && mouseY<posy+5) {
          highlighted=HIGHESTINDEX;
          leftPressed=false;
        }
      }
    }

    // check if highlighted creature has diedß
		if(highlighted!=null) {
			if(highlighted<0) {
				graveyard[-(highlighted+1)].highlight();
			} else {
				animals[highlighted].highlight();
			}
		}
	}
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
  maxPPG=0;
  for(var a, i=0; i<=HIGHESTINDEX;i++){
    a=animals[i];
    while(a.gen>=PPG.length){
      PPG.push(0);
    }
    if(a.alive==true) {
      PPG[a.gen]++;
      if(PPG[a.gen]>maxPPG){
        maxPPG=PPG[a.gen];
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
						if(animals[i].alive==true) {
							i++;
						} else {
							break;
						}
					}
					animals[i]=new Animal(round(mouseX),round(mouseY),i);
          newest = i;
					LIVEPOP++;
					if(i>HIGHESTINDEX) {
						HIGHESTINDEX=i;
					}
          document.getElementById("dash-live-info").innerHTML = "LIVE: " + LIVEPOP + "     DEAD: " + graveyard.length;
				}
				rightPressed=false;
			} else if(leftPressed){
        if(!cDrag) { // if not dragging
          cDrag = true;
        } else {
          ctx2.translate(mouseX-prevMouseX, mouseY-prevMouseY);
          dragOffsetX+=(mouseX-prevMouseX)*canvasScale;
          dragOffsetY+=(mouseY-prevMouseY)*canvasScale;

        }
        prevMouseX = mouseX; // init mx, my
        prevMouseY = mouseY;

      } else if(cDrag){ // when left no longer pressed
        console.log("CDRAG")
        cDrag = false;

        mouseOriginalX+=dragOffsetX;
        mouseOriginalY+=dragOffsetY;
        mouseX+=dragOffsetX;
        mouseY+=dragOffsetY;

        dragOffsetX=0;
        dragOffsetY=0;

      }

		} else if(mouseOverConsole) { //dashboard mouse
			if(leftPressed) {
        console.log("X,Y: "+ mouseX +", "+ mouseY)
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
					}else if((mouseY>50)&&(mouseY<60)) { // MUT 100 HIGHSCORES
						if(HIGHESTINDEX>=SCORESCAP) {
							genHS();
              resetStats();
						}
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
			}
		}

    for(k in currentKeysPressed) {
      if((k == 'a' || k== 'ArrowLeft') && currentKeysPressed[k] == true) { 
        leftAccel += 2;
        mouseX -= leftAccel;
        mouseOriginalX+=leftAccel*canvasScale;
        //mouseY-=mouseOriginalY;
        ctx2.translate(leftAccel, 0);
      } 
      
      if((k == 'w' || k == 'ArrowUp') && currentKeysPressed[k] == true) {
        upAccel += 2;
        mouseY -= upAccel;
        mouseOriginalY+=upAccel*canvasScale;
        ctx2.translate(0, upAccel);
      } 
      
      if((k == 's' || k == 'ArrowDown')  && currentKeysPressed[k] == true) {
        downAccel+=2;
        mouseY += downAccel;
        mouseOriginalY-=downAccel*canvasScale;
        ctx2.translate(0, -downAccel);
      } 
      
      if((k == 'd' || k == 'ArrowRight')  && currentKeysPressed[k] == true) {
        rightAccel+=2;
        mouseX += rightAccel;
        mouseOriginalX-=rightAccel*canvasScale;
        ctx2.translate(-rightAccel, 0);
      } 
    }
	}
}

function newSimulation() {
  //pause=true;
  highlighted=null;
  newest=null;
  scores=new Array(SCORESCAP);
  animals=new Array(POPCAP);
  for(var i=0;i<100;i++) {
    animals[i]=new Animal(round(Math.random()*FIELDX),round(Math.random()*FIELDY), i);
  }
  resetStats();
  dashboard.setup();
  tileManager.generate();
  document.getElementById("dash-live-info").innerHTML = "LIVE: " + LIVEPOP + "     DEAD: " + graveyard.length;
}

function save() {
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
  console.log("SAVING...")

  var link=document.getElementById('save-button');
  link.href=createFile("var animals= '"+animalString+"'; \n\n"+"var tiles= '"+tileString+"'; ");
  link.download = "save.p3" // set file donwload name
}


function load() {
  /*
  highlighted=null;
  newest=null;
  scores=null;
  scores=new Array(SCORESCAP);
  animals=new Array(POPCAP);

  var animalData = JSON.parse(savedAnimals);

  for(var i=0; i<animalData.length; i++){
  	if(animalData[i]!=null){
  		animals[i]=Object.assign(new Animal, animalData[i]);
  	}
  }


  var tileData = JSON.parse(savedTiles);
  for(var i=0;i<tileData.length;i++){
    tiles[i]=Object.assign(new Tile, tileData[i]);
  }

  resetStats();
  tileManager.update();
  dashboard.setup();
  */
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
	animals=new Array(POPCAP);
	animals=a2;
	a2=null;
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

function findxy(action, e) {
  // if action == move

  var rect = map.getBoundingClientRect();
  /*
  console.log(rect)
  console.log(map.width)
  console.log("MOUSE X: ", e.clientX)
  console.log("MOUSE Y: ", e.clientY)
  console.log("MAP WIDTH: ", map.width)
  console.log("MAP HEIGHT: ", map.height)
  console.log("RECT LEFT: ", rect.left)
  console.log("RECT RIGHT: ", rect.right)
  */
  mouseX= e.clientX / rect.right * map.width;
  mouseY= e.clientY / rect.bottom * map.height;
  mouseX-=mouseOriginalX;
  mouseY-=mouseOriginalY;
  mouseX/=canvasScale;
  mouseY/=canvasScale;

	if (action == 'down') {
		if(e.button === 0){
			leftPressed = true;
		} else if(e.button === 2){
			rightPressed = true;
		}
		dot_flag = true;
	}
  if (action == 'up' || action == "out") {
		if(e.button === 0){
			leftPressed = false;
		} else if(e.button === 2){
			rightPressed = false;
		}
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
