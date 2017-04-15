window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){return setTimeout(f, 1000/60)} // simulate calling code 60

window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){clearTimeout(requestID)} //fall back

var canvas2=document.getElementById('animalLayer');
var ctx2 = canvas2.getContext("2d");
var canvas3=document.getElementById('consoleLayer');
var ctx3 = canvas3.getContext("2d");
var canvas4=document.getElementById('displayLayer');
var ctx4 = canvas4.getContext("2d");

ctx2.font = "10px Arial";
ctx3.font = "10px Arial";
ctx4.font = "10px Arial";
var w = canvas2.width;
var h = canvas2.height;
var prevX = 0;
var prevY = 0;
var mouseX = 0;
var mouseY = 0;
var dot_flag = false;
var terrainMouse = false;
var consoleMouse = false;
var leftPressed = false;
var rightPressed = false;
var pause=false;
var highlighted=null;
var display=0;
var regenTiles=1;
var foodAmount=1;
var scoreType=0;
var newest=null;
var TWOPI=6.283185;
var DEGTORAD = 0.017453;
var FIELDX=canvas2.width;
var FIELDY=canvas2.height;
var CONSOLEX=canvas3.width;
var CONSOLEY=canvas3.height;
var TILENUMBER=(FIELDX/25)*(FIELDY/25);
var POPCAP=1500;
var SCORESCAP=25;
var CYCLEPOP=SCORESCAP;
var HIGHESTINDEX=-1;
var LIVEPOP=0;
var EYECAP=5;
var BRAINSIZECAP=42;
var BRAINLAYERSCAP=8;
var MEMCAP=8;
var SIZECAP=30;
var MUTCAP=10;
var ALPH="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
var tiles=new Array(TILENUMBER);
var animals=new Array(POPCAP);
var deadanimals=[];
var scores=new Array(SCORESCAP);
var request=0;


/* STATS */
var netParents=0; // Adds to total (if parent) at time of death
var netLifespan=0; //Total number of years all animals have lived (recorded upon death)
var globalNetNRG=0;
var time=0;
var redResource=0;
var blueResource=0;
var greenResource=0;
var aveFER=0;

var aveChildren=0; //Ratio of number of children per parent
var aveLifespan=0;
var aveAge=0;
var avePosNRG=0;

var maxAveChildren=1;
var maxAveLifespan=1;
var maxAvePosNRG=1;
var maxAveAge=1;
var maxPopPerGen=1;
var maxChildPerGen=1;
var maxPop=1;

var maxRedResource=0;
var maxBlueResource=0;
var maxGreenResource=0;
var minRedResource=0;
var minBlueResource=0;
var minGreenResource=0;

var aveAgeHist=[];
var aveFERHist=[];
var aveChildrenHist=[];
var aveLifespanHist=[];
var avePosNRGHist=[];
var redResourceHist=[];
var greenResourceHist=[];
var blueResourceHist=[];
var popHist=[];
var popPerGen=[];
var FERPerGen=[]; //FER: Food Energy Ratio
var childPerGen=[];


var graphHolder=new Array(5);
graphHolder[0]=0;
graphHolder[1]=1;
graphHolder[2]=2;
graphHolder[3]=4;
graphHolder[4]=7;

var regressMode=0;
var propagateMode=0;

function init() {
	canvas4.addEventListener("mouseover", function (e) {
		findxy4('over', e)
	}, false);
	canvas4.addEventListener("mousemove", function (e) {
		findxy4('move', e)
	}, false);
	canvas4.addEventListener("mousedown", function (e) {
		findxy4('down', e)
	}, false);
	canvas4.addEventListener("mouseup", function (e) {
		findxy4('up', e)
	}, false);
	canvas4.addEventListener("mouseout", function (e) {
		findxy4('out', e)
	}, false);

	canvas2.addEventListener("mouseover", function (e) {
		findxy2('over', e)
	}, false);
	canvas2.addEventListener("mousemove", function (e) {
		findxy2('move', e)
	}, false);
	canvas2.addEventListener("mousedown", function (e) {
		findxy2('down', e)
	}, false);
	canvas2.addEventListener("mouseup", function (e) {
		findxy2('up', e)
	}, false);
	canvas2.addEventListener("mouseout", function (e) {
		findxy2('out', e)
	}, false);
	tileman.generate();
	console.setup();
	requestAnimationFrame(cycle);
}

function cycle() {
	input.update();
	tileman.update();
	animan.update();
  if(time%100==0){ // COLLECT EVERY 100 FRAMES
    statman.update();
  }
  console.update();
  if(!pause){
    time++;
  }
	request=requestAnimationFrame(cycle);
}
var tileman = {
	generate : function() {
    redResource=0;
    blueResource=0;
    greenResource=0;
    maxRedResource=0;
    maxBlueResource=0;
    maxGreenResource=0;
    minRedResource=0;
    minBlueResource=0;
    minGreenResource=0;
    redResourceHist=[];
    blueResourceHist=[];
    greenResourceHist=[];

		pos=0;
		for(var i=0;i<FIELDY;i+=25) {
			for(var j=0;j<FIELDX;j+=25) {
				tiles[pos]=new Tile(j,i,pos);
				pos++;
			}
		}
	},
	update : function() {
    redResource=0;
    blueResource=0;
    greenResource=0;
		for(var i=0; i<TILENUMBER; i++) {
			tiles[i].draw();
			if(!pause && regenTiles==1) {
				tiles[i].regenerate();
			}
		}
	}
}
var animan = {
	update : function() {
		for(var ai=0; ai<=HIGHESTINDEX; ai++) {
			if(animals[ai].alive) {
				animals[ai].draw();
				if(pause==false) {
          // Order important?
          animals[ai].think();
          animals[ai].move();
					animals[ai].interact();
					animals[ai].grow();
					animals[ai].decay();
					animals[ai].scores();
				}

				if(leftPressed && terrainMouse) {
					if(abs(animals[ai].x-mouseX)<animals[ai].size && abs(animals[ai].y-mouseY)<animals[ai].size) {
						if(highlighted!=null) {
							if(display==2) {
								display=1;
							}
						}
            if(highlighted!= ai) {
              highlighted=ai;
              leftPressed=false;
            }
					}
				}
			}
		}
	}
}
var statman = {
  update : function() {
    aveAge=aveAge/100;
    aveFER=aveFER/100;
    aveChildren=aveChildren/100;
    if(deadanimals.length>0){
      aveLifespan=netLifespan/deadanimals.length;
      avePosNRG=globalNetNRG/deadanimals.length;
    }else {
      aveLifespan=0;
      avePosNRG=0;
    }
    aveFERHist.push(aveFER); //add up all the ratios and divide by the number of living creatures
    aveFER=0;
    aveChildrenHist.push(aveChildren);
    if(aveChildren>maxAveChildren){
      maxAveChildren=aveChildren;
    }
    aveChildren=0;

    aveLifespanHist.push(aveLifespan);
    avePosNRGHist.push(avePosNRG);

    redResourceHist.push(redResource);
    blueResourceHist.push(blueResource);
    greenResourceHist.push(greenResource);

    aveAgeHist.push(aveAge);
    popHist.push(LIVEPOP);
    if(LIVEPOP>maxPop){
      maxPop=LIVEPOP;
    }
    if(aveAge>maxAveAge){
      maxAveAge=aveAge;
    }
    aveAge=0;
    if(aveLifespan>maxAveLifespan){
      maxAveLifespan=aveLifespan;
    }
    if(avePosNRG>maxAvePosNRG){
      maxAvePosNRG=avePosNRG;
    }

    if(redResource>maxRedResource){
      maxRedResource=redResource;
    }
    if(greenResource>maxGreenResource){
      maxGreenResource=greenResource;
    }
    if(blueResource>maxBlueResource){
      maxBlueResource=blueResource;
    }
    if(redResource<minRedResource){
      minRedResource=redResource;
    }
    if(greenResource<minGreenResource){
      minGreenResource=greenResource;
    }
    if(blueResource<minBlueResource){
      minBlueResource=blueResource;
    }
  }
}

var console = {
	setup : function() {
		ctx3.fillStyle=rgbToHex(50,50,50);
		ctx3.fillRect(0,0,CONSOLEX,CONSOLEY);
		ctx3.fillStyle="#FFFFFF";
		ctx3.strokeStyle="#FFFFFF";
		var posy=15;
		ctx3.fillText("PETRI 1.21", 10, posy);
		ctx3.fillText("LIVE: ", 10, posy+=10);
		ctx3.fillText("DEAD: ", 10, posy+=10);
		ctx3.fillText("HIND: ", 10, posy+=10);
		ctx3.fillText("NEW: ", 10, posy+=10);
    ctx3.fillText("TIME: ", 10, posy+=10);
		var posx2=440;
		posy=10;
		ctx3.fillRect(80,posy,2,12);
		ctx3.fillRect(86,posy,2,12);
		ctx3.fillRect(posx2,posy,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
		ctx3.fillRect(posx2,posy+=20,150,12);
    ctx3.fillRect(posx2,posy+=20,150,12);
    ctx3.fillRect(posx2,posy+=20,150,12);

		ctx3.beginPath();
		ctx3.moveTo(100,10);
		ctx3.lineTo(100,22);
		ctx3.lineTo(110,16);
		ctx3.lineTo(100,10);
		ctx3.fill();
		ctx3.stroke();
		ctx3.fillStyle= "#323232";
		posy=20;
		ctx3.fillText("RESET",posx2+5,posy);
		ctx3.fillText("NEW RANDOM 100",posx2+5,posy+=20);
		ctx3.fillText("MUT 100 HIGHSCORES",posx2+5,posy+=20);

		if(scoreType==0) {
			ctx3.fillText("SCORE CHILDREN",posx2+5,posy+=20);
		} else if(scoreType==1) {
			ctx3.fillText("SCORE AGE",posx2+5,posy+=20);
		} else {
      ctx3.fillText("SCORE ENERGY",posx2+5,posy+=20);
    }

    ctx3.fillText("FOOD x"+foodAmount,posx2+5,posy+=20);

    if(regenTiles==1) {
			ctx3.fillText("REGEN TILES ON",posx2+5,posy+=20);
		} else {
			ctx3.fillText("REGEN TILES OFF",posx2+5,posy+=20);
		}

    if(regressMode==0) {
      ctx3.fillText("REGRESS OFF",posx2+5,posy+=20);
    } else if(regressMode<4){
      ctx3.fillText("REGRESS <"+regressMode+" CHILDREN",posx2+5,posy+=20);
    } else {
      ctx3.fillText("REGRESS < CNO",posx2+5,posy+=20);
    }
    if(propagateMode==0) {
      ctx3.fillText("PROPAGATE OFF",posx2+5,posy+=20);
    } else if(propagateMode==1){
      ctx3.fillText("PROPAGATE FULL",posx2+5,posy+=20);
    } else if(propagateMode==1){
      ctx3.fillText("PROPAGATE DIRECT",posx2+5,posy+=20);
    }

    posx2=280;
    posy=20;
	},
	update : function() {
    ctx4.clearRect(0, 0, CONSOLEX, CONSOLEY);
		if(display!=1 && display!=2) {
			var posx=50;
			var posy=15;
			ctx4.fillStyle="#FFFFFF";
			ctx4.fillText(LIVEPOP, posx, posy+=10);
			ctx4.fillText(deadanimals.length, posx, posy+=10);
      if(consoleMouse && leftPressed) {
        if(mouseX>10 && mouseX<120) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            if(deadanimals.length>0){ // If deadanimals length = 1, then index ==0: send to highlighted as -(length)+1. 0-> -1, 1 -> -2, 2->-3
              highlighted=(-deadanimals.length); // goes to index at deadanimals.length, shows most recently deceased
            }
            leftPressed=false;
          }
        }
      }
			ctx4.fillText(HIGHESTINDEX, posx, posy+=10);
			if(consoleMouse && leftPressed) {
				if(mouseX>10 && mouseX<120) {
					if(mouseY>posy-5 && mouseY<posy+5) {
						highlighted=HIGHESTINDEX;
						leftPressed=false;
					}
				}
			}
			if(newest!=null) {
				if(newest<0) {
					ctx4.fillText(deadanimals[-(newest+1)].name+"-"+deadanimals[-(newest+1)].gen+"D"+deadanimals[-(newest+1)].children.length, posx, posy+=10);
				} else {
					ctx4.fillText(animals[newest].name+"-"+animals[newest].gen+"A"+animals[newest].children.length, posx, posy+=10);
				}
				if(consoleMouse && leftPressed) {
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
      ctx4.fillText(time, posx, posy+=10);
			posx=10;
			posy=75;
			ctx4.fillStyle="#FFFFFF";
			ctx4.fillText("HIGHSCORES:",posx,posy);
			for(var i=0;i<SCORESCAP;i++) {
				if(scores[i]!=null) {
          if(scoreType==0){
            if(scores[i]<0){
              var a1=deadanimals[-(scores[i]+1)];
              ctx4.fillText(a1.name+"-"+a1.gen+"D"+a1.children.length, posx, posy+=10);
            } else {
              var a1=animals[scores[i]];
              ctx4.fillText(a1.name+"-"+a1.gen+"A"+a1.children.length, posx, posy+=10);
            }
  					if(consoleMouse && leftPressed) {
  						if(mouseX>posx && mouseX<posx+90 && mouseY>posy-5 && mouseY<posy+5) {
  							if(display==2) {
  								display=1;
  							}
  							highlighted=scores[i]; // index stored in "scores" array
  						}
  					}
          } else {
            if(scores[i]<0){
              var a1=deadanimals[-(scores[i]+1)];
              ctx4.fillText(a1.name+"-"+a1.gen+"D"+a1.children.length+": "+round(a1.score), posx, posy+=10);
            } else {
              var a1=animals[scores[i]];
              ctx4.fillText(a1.name+"-"+a1.gen+"A"+a1.children.length+": "+round(a1.score), posx, posy+=10);
            }
            if(consoleMouse && leftPressed) {
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
      //GRAPHS

      var buttonX=450;
      ctx4.fillStyle="#FFFFFF";
      for(var i=0;i<5; i++){
        ctx4.beginPath();
        ctx4.arc(buttonX,175,7,0,TWOPI);
        ctx4.fill();
        if(leftPressed){
          if(consoleMouse && abs(mouseX-buttonX)<6 && abs(mouseY-175)<6) {
            if(graphHolder[i]<8){
              graphHolder[i]++;
            } else {
              graphHolder[i]=-1;
            }
            leftPressed=false;
          }
        } else if(rightPressed){
          if(consoleMouse && abs(mouseX-buttonX)<6 && abs(mouseY-175)<6) {
            if(graphHolder[i]>-1){
              graphHolder[i]--;
            } else {
              graphHolder[i]=8;
            }
            rightPressed=false;
          }
        }
        buttonX+=32;
      }
      buttonX=450;
      ctx4.fillStyle="#323232";
      for(var i=0;i<5; i++){
        ctx4.fillText(graphHolder[i], buttonX-3, 178);
        buttonX+=32;
      }

      var lineX= CONSOLEX/(~~(time/100));
      posy=600;
      ctx4.fillStyle="#FFFFFF";
      ctx4.strokeStyle="#FFFFFF";
      for(var i=0;i<5; i++){
        if(graphHolder[i]==0){
          graph(lineX, posy, aveFERHist, "FER/LIVE: ", 1);
        } else if(graphHolder[i]==1){
          graph(lineX, posy, aveChildrenHist, "CHILD/LIVE: ", maxAveChildren);
        } else if(graphHolder[i]==2){
          graph(lineX, posy, aveLifespanHist, "LIFESPAN/POP: ", maxAveLifespan);
        } else if(graphHolder[i]==3){
          graph(lineX, posy, avePosNRGHist, "POSNRG/POP: ", maxAvePosNRG);
        } else if(graphHolder[i]==4){
          graph(lineX, posy, popHist, "POP: ", maxPop);

        } else if(graphHolder[i]==5){
          if(popPerGen.length>0){
            var genX;
            if(popPerGen.length>1){
              genX = CONSOLEX/(popPerGen.length-1);
            } else {
              genX=0;
            }
            genGraph(genX, posy, FERPerGen, "FER/GEN: ", 1); //Food energy ratio per gen
          }
        } else if(graphHolder[i]==6){
          if(popPerGen.length>0){
            var genX;
            if(popPerGen.length>1){
              genX = CONSOLEX/(popPerGen.length-1);
            } else {
              genX=0;
            }
            genGraph(genX, posy, childPerGen, "CHILD/GEN: ", maxChildPerGen);
          }
        } else if(graphHolder[i]==7){
          if(popPerGen.length>0){
            var genX;
            if(popPerGen.length>1){
              genX = CONSOLEX/(popPerGen.length-1);
            } else {
              genX=0;
            }
            popGenGraph(genX, posy, popPerGen, "POP/GEN: ", maxPopPerGen);
          }
        } else if(graphHolder[i]==8){
          var showTime=-1;
          var showReso=0;
          ctx4.strokeStyle="#FF0000";
          resoGraph(lineX, posy, 90, redResourceHist, "RRESO: ", minRedResource, maxRedResource);
          ctx4.strokeStyle="#00FF00";
          resoGraph(lineX, posy, 80, greenResourceHist, "GRESO: ", minGreenResource, maxGreenResource);
          ctx4.strokeStyle="#0000FF";
          resoGraph(lineX, posy, 70, blueResourceHist, "BRESO: ", minBlueResource, maxBlueResource);
          if(showTime>-1){
            ctx4.fillText("TIME: "+showTime, 10, posy-60);
          }
          ctx4.strokeStyle="#FFFFFF";
        }
        posy+=100;
      }
    }

		if(highlighted!=null) {
			if(highlighted<0) {
				deadanimals[-(highlighted+1)].highlight();
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

    if(consoleMouse && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
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
  var posx=0;
  var range=(max-min);
  ctx4.beginPath();
  for(var i=0; i<g.length-1; i++){ // Will begin once array has length of at least 2. Initial length==1. Wait until length 2
    initY=round(100*((g[i]-min)/range));
    endY=round(100*((g[i+1]-min)/range));
    ctx4.moveTo(posx,y-initY);
    ctx4.lineTo(posx+lx,y-endY);

    if(consoleMouse && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
      if(show==0) {
        ctx4.fillText(txt+round(g[i]), 10, y-s);
        if(showTime=-1){
          showTime=i*100;
        }
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
}
function genGraph(lx, y, g, txt, max) {
  var initY;
  var endY;
  var show=0;
  var posx=0;
  ctx4.beginPath();
  for(var i=0; i<g.length-1; i++){ // Will begin once array has length of at least 2. Initial length==1. Wait until length 2
    initY= round(100*(g[i]/popPerGen[i])/max);
    endY=round(100*(g[i+1]/popPerGen[i+1])/max);
    ctx4.moveTo(posx,y-initY);
    ctx4.strokeRect((posx-1), (y-initY-1),2,2);
    ctx4.lineTo(posx+lx,y-endY);
    if(consoleMouse && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
      if(show==0) {
        ctx4.fillText(txt+round(100*(g[i]/popPerGen[i]))/100, 10, y-90);
        ctx4.fillText("GEN "+i, 10, y-80);
        show=1;
      }
    }
    posx+=lx;
  }
  if(show==0){
    ctx4.fillText(txt+round(100*g[g.length-1]/popPerGen[g.length-1])/100, 10, y-90);
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
    if(consoleMouse && abs(mouseX-posx)<10 && abs(mouseY-(y-initY))<10){
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
  maxChildPerGen=1;

  aveChildrenHist=[];
  aveLifespanHist=[];
  avePosNRGHist=[];
  aveFERHist=[];
  popPerGen=[];
  FERPerGen=[];
  childPerGen=[];
  popHist=[];
}

var input= {
	update: function() {
		if(terrainMouse) { // animal (environment) mouse
			//gen 1 random
			if(rightPressed==true) {
				if(LIVEPOP<POPCAP) {
					var i=0;
					while(animals[i]!=null) {
						if(animals[i].top<SCORESCAP || animals[i].alive) {
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
			}
		} else if(consoleMouse) { //console mouse
			if(leftPressed) {

        //PAUSE
				if(mouseX>80 && mouseX<90 && mouseY>10 && mouseY<20) {
					if(pause==false) {
						pause=true;
						leftPressed=false;
					}
				}

        //PLAY
				if((mouseX>100)&&(mouseX<110)) {
					if((mouseY>10)&&(mouseY<20)) {
						if(pause==true) {
							pause=false;
							leftPressed=false;
						}
					}
				}
        // CONSOLE MENU
        if((mouseX>440)&&(mouseX<590) && display!=1 && display!=2) {
					if((mouseY>10)&&(mouseY<20)) { // RESET
						highlighted=null;
						newest=null;
						scores=null;
						animals=null;
            deadanimals=null;
						scores=new Array(SCORESCAP);
						animals=new Array(POPCAP);
            deadanimals=[];

            resetStats();

						console.setup();
						tileman.generate();
						LIVEPOP=0;
						HIGHESTINDEX=-1;
						leftPressed=false;
					} else if((mouseY>30)&&(mouseY<40)) {  // NEW RANDOM 100
						highlighted=null;
						newest=null;
						scores=null;
						animals=null;
						scores=new Array(SCORESCAP);
						animals=new Array(POPCAP);

            resetStats();

						console.setup();
						tileman.generate();
						for(var i=0;i<100;i++) {
							animals[i]=new Animal(round(Math.random()*FIELDX),round(Math.random()*FIELDY), i);
						}
						LIVEPOP=100;
						HIGHESTINDEX=99;
						leftPressed=false;
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
						foodAmount++;
						if(foodAmount>4) {
							foodAmount=1;
						}
						console.setup();
						leftPressed=false;
					} else if((mouseY>110)&&(mouseY<120)) { // REGEN TILES
						if(regenTiles==0) {
							regenTiles=1;
						} else {
							regenTiles=0;
						}
						console.setup();
						leftPressed=false;
					} else if((mouseY>130)&&(mouseY<140)) { // BACKPROP MODE
            if(regressMode==4) {
              regressMode=0;
            } else {
              regressMode++;
            }
            resetAllGenes();
						console.setup();
						leftPressed=false;
					} else if((mouseY>150)&&(mouseY<160)) { // FORTHPROP MODE
						if(propagateMode==2) {
							propagateMode=0;
						} else {
              propagateMode++;
            }
						console.setup();
						leftPressed=false;
					}
				}
			}
		}
	}
}

function resetAllGenes() {
  for(var i=0;i<HIGHESTINDEX;i++){
    if(animals[i].alive){
      animals[i].resetGenes();
    }
  }
  for(var i=0, dA=deadanimals.length; i<dA; i++){
    deadanimals[i].resetGenes();
  }
}

function resetScore() {
  for(var i=0;i<=HIGHESTINDEX;i++){
    if(animals[i].alive){
      if(scoreType==0){
        animals[i].score = animals[i].children.length;
      } else if(scoreType==1){
        animals[i].score = animals[i].age;
      } else {
        animals[i].score = animals[i].netNRG;
      }
    }
  }
  for(var l=0, dA=deadanimals.length; l<dA; l++){
    var dead = deadanimals[l];
    if(scoreType==0){
      dead.score = dead.children.length;
    } else if(scoreType==1){
      dead.score = dead.age;
    } else {
      dead.score = dead.netNRG;
    }
  }
  for(var l=0, dA=deadanimals.length; l<dA; l++){
    var dead = deadanimals[l];
    for(var i=0, sC=SCORESCAP;i<sC;i++) { //from #1 to bottom
			if(dead.top<=i) { // if position is higher than i (#1 already, no need to look at #25)
				break;
			} if(scores[i]==null){
				if(dead.top<sC) {
					scores[dead.top]=null;
				}
        scores[i]=-(dead.index+1); //If called from deadanimals during resetScore, it should work... no bugs yet
				dead.top=i;
				break;
			}else {
        if(scores[i]<0){
          if(dead.score>deadanimals[-(scores[i]+1)].score) {
            if(dead.top<sC) {
              scores[dead.top]=null;
            }
            var j;
            for(j=0;j<sC;j++) {
              if(scores[j]==null) {
                scores[j]=scores[i];
                deadanimals[-(scores[j]+1)].top=j;
                break;
              }
            }
            if(j==sC) {
              deadanimals[-(scores[i]+1)].top=sC;
            }
            scores[i]=-(dead.index+1);
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
            scores[i]=-(dead.index+1);
    				dead.top=i;
    				break;
    			}
        }
      }
		}
  }
  console.setup();
}

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
        animals[scores[j]].mutator(2, a2[it]);
        a2[it+1]=an;
        animals[scores[j]].mutator(2, a2[it+1]);
        a2[it+2]=ani;
        animals[scores[j]].mutator(2, a2[it+2]);
        a2[it+3]=anim;
        animals[scores[j]].mutator(2, a2[it+3]);
        it+=4;
      } else {
        animals[-(scores[j]+1)].x=round(Math.random()*FIELDX);
        animals[-(scores[j]+1)].y=round(Math.random()*FIELDY);
        a2[it]=a;
        animals[-(scores[j]+1)].mutator(2, a2[it]);
        a2[it+1]=an;
        animals[-(scores[j]+1)].mutator(2, a2[it+1]);
        a2[it+2]=ani;
        animals[-(scores[j]+1)].mutator(2, a2[it+2]);
        a2[it+3]=anim;
        animals[-(scores[j]+1)].mutator(2, a2[it+3]);
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
	LIVEPOP=100;
	HIGHESTINDEX=99;
	console.setup();
	tileman.generate();
}

function namer() {
	var n="";
	for(var i=0;i<4;i++) {
		n+=ALPH.charAt(round(Math.random()*25));
	}
	return n;
}

function findxy2(res, e) {
	if (res == 'down') {
		prevX = mouseX;
		prevY = mouseY;
		mouseX = e.clientX - canvas2.offsetLeft;
		mouseY = e.clientY - canvas2.offsetTop;
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
		prevX = mouseX;
		prevY = mouseY;
		mouseX = e.clientX - canvas2.offsetLeft;
		mouseY = e.clientY - canvas2.offsetTop;
	}
	if (res == 'over') {
		prevX = mouseX;
		prevY = mouseY;
		mouseX = e.clientX - canvas2.offsetLeft;
		mouseY = e.clientY - canvas2.offsetTop;
	}
	terrainMouse=true;
	consoleMouse=false;
}
function findxy4(res, e) {
	if (res == 'down') {
		prevX = mouseX;
		prevY = mouseY;
		mouseX = e.clientX - canvas4.offsetLeft;
		mouseY = e.clientY - canvas4.offsetTop;
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
		prevX = mouseX;
		prevY = mouseY;
		mouseX = e.clientX - canvas4.offsetLeft;
		mouseY = e.clientY - canvas4.offsetTop;
	}
	if (res == 'over') {
		prevX = mouseX;
		prevY = mouseY;
		mouseX = e.clientX - canvas4.offsetLeft;
		mouseY = e.clientY - canvas4.offsetTop;
	}
	consoleMouse=true;
	terrainMouse=false;
}
function rgbToHex(r,g,b) {
    return "#" + ((1 << 24)+(r << 16)+(g << 8)+b).toString(16).slice(1);
}
function round(x) {
	return ~~(x + (x>0 ? .5:-.5));
}
function abs(x) {
	return (x>0 ? x:-x);
}

function randn_bm() { //random box-muller: generate normal distribution
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function randn_one() {
    return round((Math.random()*2)-1);
}

function Tile(x,y,num) {

	this.x=x;
	this.y=y;
	this.num=num;
	this.regenRate=(Math.random()*0.1)+0.05;
	this.RCap = round(Math.random()*100)+50;
	this.GCap = round(Math.random()*100)+100;
	this.BCap = round(Math.random()*75)+25;
	this.R=this.RCap;
	this.G=this.GCap;
	this.B=this.BCap;
  redResource+=this.R;
  greenResource+=this.G;
  blueResource+=this.B;
}
Tile.prototype.draw=function() {
  ctx2.fillStyle=rgbToHex((this.R<50 ? 50:round(this.R)), (this.G<50 ? 50:round(this.G)), (this.B<50 ? 50:round(this.B)));
  ctx2.fillRect(this.x,this.y,25,25);
  if(terrainMouse && mouseX>this.x-25 && mouseX<this.x+50 && mouseY>this.y-25 && mouseY<this.y+50) {
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
  redResource+=this.R;
  greenResource+=this.G;
  blueResource+=this.B;
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
	this.weights=new Float64Array(BRAINSIZECAP);
	this.bias=new Float64Array(BRAINSIZECAP);
	this.wGenes=new Array(BRAINSIZECAP);
	this.bGenes=new Array(BRAINSIZECAP);
  this.maxOut=0.5; // IN RELATION TO STARTING VALUES
  this.minOut=-0.5;

	this.is=0;
	this.cost=0;
	for(var i=0;i<BRAINSIZECAP;i++) {
		this.bias[i]=0;
		var c=round(5000*randn_bm())/10000; //Half range of norm. dist.
		this.weights[i]=c;
		this.cost+=abs(c);

    //Set mutation rates to 0;
		this.wGenes[i]=0;
		this.bGenes[i]=0;
	}
}
Neuron.prototype.outWeight=function(idx) { // if this.is>=0 return this.is*weights[0]
  return this.bias[idx]+this.softSign(this.is)*this.weights[idx];
}
Neuron.prototype.softSign=function(is) {
  return is/(1+(is>=0 ? is:-is));
}
Neuron.prototype.inSig=function(idx) {
  return this.bias[idx]+this.is*this.weights[idx];
}
Neuron.prototype.outSig=function() {
  return this.softSign(this.is);
}

function Eye(d,x,y) {
	this.dis=0;
  this.stray=round(Math.random()*360)-180;
  this.dir=d+this.stray;
  if(this.dir<0) {
    this.dir+=360;
  } else if(this.dir>359) {
    this.dir-=360;
  }
	this.dissen=0;
	this.dirsen=0;
	this.eX=x;
	this.eY=y;
	this.tile=null;
	this.col=0;
	this.sense=0;
	this.sees=0;
	this.mutrs = new Array(2);
	this.mutrs[0]=0;
	this.mutrs[1]=0;
}
Eye.prototype.setXY=function(x,y) {
  this.eX=x+round(this.dis*(Math.cos(DEGTORAD*this.dir)));
  this.eY=y+round(this.dis*(Math.sin(DEGTORAD*this.dir)));
  if(this.eX>=0 && this.eY>=0 && this.eX<FIELDX && this.eY<FIELDY) {
    this.tile=((~~(this.eY/25)*40)+(~~(this.eX/25)));
    if(this.tile<0 || this.tile>=TILENUMBER) {
      this.tile=null;
      this.col=0;
    }
  } else {
    this.tile=null;
    this.col=0;
  }
}

function Mouth(d,x,y) {
	this.dis=0;
	this.dissen=0;
	this.dirsen=0;
	this.mX=x;
	this.mY=y;
	this.tile=null;
  this.stray=round(Math.random()*360)-180;
  this.dir=d+this.stray;
  if(this.dir<0) {
    this.dir+=360;
  } else if(this.dir>359) {
    this.dir-=360;
  }
	this.col=0;
	this.sense=0;
	this.sense2=0;
	this.sees=0;
	this.eats=0;
	this.mutrs = new Array(2);
	this.mutrs[0]=0;
	this.mutrs[1]=0;
}
Mouth.prototype.setXY=function(x,y) {
  this.mX=x+round(this.dis*(Math.cos(DEGTORAD*this.dir)));
  this.mY=y+round(this.dis*(Math.sin(DEGTORAD*this.dir)));
  if(this.mX>=0 && this.mY>=0 && this.mX<FIELDX && this.mY<FIELDY) {
    this.tile=((~~(this.mY/25)*40)+(~~(this.mX/25)));
    if(this.tile<0 || this.tile>=TILENUMBER) {
      this.tile=null;
      this.col=0;
    }
  } else {
    this.tile=null;
    this.col=0;
  }
}

function Animal(x,y,index) {

	this.index=index;
	this.alive=true;
	this.x=x;
	this.y=y;
	this.tile=null;
	this.minSize=5;
	this.maxSize=10;
	this.size=this.minSize;
	this.midSize=(this.maxSize-this.minSize)/2;
	this.health=0;
	this.deterioration=0;
	this.muta=0;
	this.gen=0;
  this.age=0;
	this.parent = null;
	this.pidx=null;
	this.cno=null;

  this.parentAge=0;
  this.parentNetNRG=0;

	this.children=[];
  this.liveDesc=0;
  this.descendants=0;
  this.genePool=0;
	this.name=namer();
	this.colors=new Array(15);
	this.hexes=new Array(5);
	for(var c=0;c<15;c++) {
		if(c<3) {
			this.colors[c]=round((Math.random()*255));
		} else if(c<6) {
			this.colors[c]=(this.colors[c%3]-20);
		} else if (c<9) {
			this.colors[c]=(this.colors[c%3]+20);
		} else if (c<12) {
			this.colors[c]=(this.colors[c%3]-40);
		} else {
			this.colors[c]=(this.colors[c%3]+40);
		}
		if(this.colors[c]<0) {
			this.colors[c]=0;
		} else if(this.colors[c]>255) {
			this.colors[c]=255;
		}
	}
	for(var c=0;c<5;c++) {
		this.hexes[c]=rgbToHex(this.colors[c*3],this.colors[(c*3)+1],this.colors[(c*3)+2]);
	}
	this.domCol=null;
	if(this.colors[0]>this.colors[1] && this.colors[0]>this.colors[2]) {
		this.domCol=0; //R
	} else if(this.colors[0]<this.colors[2] && this.colors[2]<this.colors[1]) {
		this.domCol=1; //G
	} else {
		this.domCol=2; //B
	}

  this.vel=0;
  this.rot=0;
	this.dir=round(Math.random()*360);
  this.maxVel=1;
  this.minVel=-1;
  this.maxRot=1;
  this.minRot=-1;

	this.eyeNumber=EYECAP;
	this.eyes=new Array(EYECAP);
	for(var i=0;i<this.eyeNumber;i++) {
		this.eyes[i] = new Eye(this.dir, this.x, this.y);
	}
	this.mouth=new Mouth(this.dir, this.x, this.y);
	this.foodEnergy=0;

	this.maxFNRG=1;
	this.minFNRG=-1;

  this.posFNRG=0;
  this.netFNRG=0;

	this.attack=0;

	this.brain=new Array(BRAINLAYERSCAP);
	this.brainCost=0;
	for(var i=0; i<BRAINLAYERSCAP; i++) {
		this.brain[i]=new Array(BRAINSIZECAP);
		for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
			this.brain[i][j] = new Neuron();
			this.brainCost+=this.brain[i][j].cost;
      if(i==BRAINLAYERSCAP-1){
        for(var k=0, bS=BRAINSIZECAP; k<bS; k++) {
          this.brain[i][j].weights[k]=0;
        }
        this.brainCost-=this.brain[i][j].cost;
        this.brain[i][j].cost=0;
      }
		}
	}
	this.brainCost/=(BRAINSIZECAP*BRAINLAYERSCAP);

	this.memory=new Array(MEMCAP);
	for(var i=0;i<MEMCAP;i++) {
		this.memory[i]=0;
	}

	this.outputs=new Array(BRAINSIZECAP);
	for(var i=0;i<BRAINSIZECAP;i++) {
		this.outputs[i]=0;
	}
	this.energy=this.minSize*10000;
	this.maxEnergy=this.energy;
	this.eChange=0;

	this.maxECH=1;
	this.minECH=-1;

  this.netNRG=0;
	this.loss=0;
	this.dmgReceived=0;
	this.dmgCaused=0;
	this.score=0;
	this.top=SCORESCAP;
	this.velres=1;
	this.rotres=1;
  this.maxSizeGene=0;
  this.minSizeGene=0;
	this.senmuts=new Array(2);
	for(var i=0;i<2;i++) {
		this.senmuts[i]=0;
	}
}

Animal.prototype.draw=function(){
  ctx2.strokeStyle=this.hexes[2];
	ctx2.fillStyle=this.hexes[4];
	for(var i=0, eN=this.eyeNumber;i<eN;i++) {
    ctx2.beginPath();
    ctx2.arc(this.eyes[i].eX,this.eyes[i].eY, round(this.size/10), 0, TWOPI);
		ctx2.stroke();
		ctx2.fill();
	}

  ctx2.strokeStyle= this.hexes[1];
	ctx2.fillStyle= this.hexes[0];
	ctx2.beginPath();
	ctx2.arc(this.x, this.y, round(this.size/2), 0, TWOPI);
	ctx2.stroke();
	ctx2.fill();

	ctx2.strokeStyle=this.hexes[3];
	ctx2.fillStyle=this.hexes[1];
	ctx2.beginPath();
	ctx2.arc(this.mouth.mX,this.mouth.mY, round(this.size/4), 0, TWOPI);
	ctx2.stroke();
	ctx2.fill();


	if(terrainMouse && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50 && highlighted!=this.index) {
		ctx2.fillStyle= "#FFFFFF";
		ctx2.fillText(this.name+"-"+this.gen+(this.alive ? "A":"D")+this.children.length, this.x+(2*this.size), this.y-(2*this.size));
	}
}
Animal.prototype.think=function() {
  //INPUT LAYER
  var inp=0;
  if(this.vel>=0){
    this.brain[0][inp++].is=this.vel/this.maxVel;
  } else {
    this.brain[0][inp++].is=-this.vel/this.minVel;
  }
  if(this.rot>=0){
    this.brain[0][inp++].is=this.rot/this.maxRot;
  } else {
    this.brain[0][inp++].is=-this.rot/this.minRot;
  }

  if(this.eChange>=0) {
    this.brain[0][inp++].is=this.eChange/this.maxECH;
  } else {
    this.brain[0][inp++].is=-this.eChange/this.minECH;
  }
  if(this.foodEnergy>=0) {
    this.brain[0][inp++].is=this.foodEnergy/this.maxFNRG;
  } else {
    this.brain[0][inp++].is=-this.foodEnergy/this.minFNRG;
  }

  this.brain[0][inp++].is=this.outputs[3]; //eat colour
  this.brain[0][inp++].is=this.outputs[2]; //eat type

  this.brain[0][inp++].is=this.mouth.col;
  this.brain[0][inp++].is=this.mouth.sense;
  this.brain[0][inp++].is=this.mouth.sense2;
  this.brain[0][inp++].is=this.mouth.stray/180;
  this.brain[0][inp++].is=this.mouth.dis/(2*this.maxSize);
  this.brain[0][inp++].is=this.health;
  this.brain[0][inp++].is=((this.size-this.midSize)-this.minSize)/this.midSize;
  this.brain[0][inp++].is=this.attack;
  for(var i=0, mC=MEMCAP;i<mC;i++) {
    this.brain[0][inp++].is=this.memory[i];
  }
  for(var j=0, eN=this.eyeNumber; j<eN; j++) {
    this.brain[0][(4*j)+inp].is=this.eyes[j].col;
    this.brain[0][(4*j)+inp+1].is=this.eyes[j].sense;
    this.brain[0][(4*j)+inp+2].is=this.eyes[j].stray/180;
    this.brain[0][(4*j)+inp+3].is=this.eyes[j].dis/(10*this.maxSize);
  }
  inp+=(4*this.eyeNumber);

  //Input vals are already between (-1, 1): do not need to be squashed using softsign. Use inSig function on first layer -> second
  for(var i=0, temp=0, bS=BRAINSIZECAP; i<bS; i++) {
    for(var j=0; j<inp; j++) {
      temp+=this.brain[0][j].inSig(i);
    }
    this.brain[1][i].is=temp;
    temp=0;
  }
  for(var i=1, bL=BRAINLAYERSCAP-1; i<bL; i++) {
    for(var j=0, temp=0, b1=this.brain[i], bS=BRAINSIZECAP; j<bS; j++) {
      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        temp+=b1[k].outWeight(j);
      }
      this.brain[i+1][j].is=temp;
      temp=0;
    }
  }
  for(var i=0, bL=BRAINLAYERSCAP-1, bS=BRAINSIZECAP; i<bS; i++) {
    this.outputs[i]=this.brain[bL][i].outSig();
  }
}
Animal.prototype.move=function() {
  this.eChange=0;
  this.eChange-=this.loss;
  this.dmgReceived+=this.loss;
  this.vel/=1.41;
  this.rot/=1.41;
  this.vel+=this.outputs[0]*this.velres;

  if(this.vel>this.maxVel) {
    this.maxVel=this.vel;
  } else if(this.vel<this.minVel) {
    this.minVel=this.vel;
  }

  this.rot+=this.outputs[1]*this.rotres;
  if(this.rot>this.maxRot) {
    this.maxRot=this.rot;
  } else if(this.rot<this.minRot) {
    this.minRot=this.rot;
  }
  this.dir+=this.rot;
  if(this.dir<0) {
    this.dir+=360;
  } else if(this.dir>359) {
    this.dir-=360;
  }

  if(highlighted==this.index && leftPressed && terrainMouse && abs(this.x-mouseX)<20 && abs(this.y-mouseY)<20){
    this.x=mouseX;
    this.y=mouseY;
  } else {
    this.x+=round(this.vel*(Math.cos(this.dir*DEGTORAD))); //ROUNDED INTEGER
    this.y+=round(this.vel*(Math.sin(this.dir*DEGTORAD))); //ROUNDED INTEGER
  }

  if(this.x<0 || this.x>=FIELDX) {
    if(this.x<0) {
      this.x=0;
    } else {
      this.x=FIELDX-1;
    }
    this.vel=0;
  }
  if(this.y<0 || this.y>=FIELDY) {
    if(this.y<0) {
      this.y=0;
    } else {
      this.y=FIELDY-1;
    }
    this.vel=0;
  }

  //update current tile
  var ct=((~~(this.y/25)*40)+(~~(this.x/25)));
  if(ct>=1600) {
    this.tile=1599;
  } else if (ct<0) {
    this.tile= 0;
  }
  this.tile=ct;

  var s1=this.size;
  this.attack=this.outputs[5]; // (-1.00, 1.00)

  this.mouth.dis+=this.outputs[6]*this.mouth.dissen;
  if(this.mouth.dis>2*s1) {
    this.mouth.dis=2*s1;
  } else if(this.mouth.dis<-2*s1) {
    this.mouth.dis=-2*s1;
  }

  this.mouth.dir+=this.rot;
  this.mouth.dir+=this.outputs[7]*this.mouth.dirsen;
  this.mouth.stray+=this.outputs[7]*this.mouth.dirsen;
  if(this.mouth.stray>179) {
    this.mouth.stray-=360;
  } else if(this.mouth.stray<-180) {
    this.mouth.stray+=360;
  }
  if(this.mouth.dir<0) {
    this.mouth.dir+=360;
  } else if(this.mouth.dir>359) {
    this.mouth.dir-=360;
  }
  this.mouth.sense=this.outputs[26]; //recursive
  this.mouth.sense2=this.outputs[27];
  this.mouth.eats=0;
  this.mouth.sees=0;
  this.mouth.setXY(this.x, this.y);

  for(var i=0, eN=this.eyeNumber; i<eN; i++) {
    this.eyes[i].dir+=this.rot;                     // for some reason in js, <- 0; 360 ->; 270 v; 90 ^
    this.eyes[i].dir+=this.outputs[(i*2)+8]*this.eyes[i].dirsen;
    this.eyes[i].stray+=this.outputs[(i*2)+8]*this.eyes[i].dirsen;
    if(this.eyes[i].stray>179) {
      this.eyes[i].stray-=360;
    } else if(this.eyes[i].stray<-180) {
      this.eyes[i].stray+=360;
    }
    if(this.eyes[i].dir>359) {
      this.eyes[i].dir-=360;
    } else if(this.eyes[i].dir<0) {
      this.eyes[i].dir+=360;
    }

    this.eyes[i].dis+=this.outputs[(i*2)+9]*this.eyes[i].dissen;
    if(this.eyes[i].dis>s1*10) {
      this.eyes[i].dis=s1*10;
    } else if(this.eyes[i].dis<-s1*10) {
      this.eyes[i].dis=-s1*10;
    }
    this.eyes[i].setXY(this.x, this.y);

    this.eyes[i].sense=this.outputs[28+i];
    this.eyes[i].sees=0;
  }
  for(var i=0,mC=MEMCAP;i<mC;i++) { //MEM OUTPUTS START AT 18
    this.memory[i]=this.outputs[18+i];
  }
}
Animal.prototype.interact=function() {
  var s1=this.size;
  this.foodEnergy=0;

  if(this.mouth.tile!=null) { // SET CURR TILE
    if(this.outputs[3]<-0.33) {
      this.mouth.col=tiles[this.mouth.tile].R/150;
    } else if(this.outputs[3]>=0.33) {
      this.mouth.col=tiles[this.mouth.tile].G/200;
    } else {
      this.mouth.col=tiles[this.mouth.tile].B/100;
    }
  }

  for(var i=0, eN=this.eyeNumber; i<eN; i++) { // SET CURR TILE
    if(this.eyes[i].tile!=null) {
      if(this.outputs[3]<-0.33) {
        this.eyes[i].col=tiles[this.eyes[i].tile].R/150;
      } else if(this.outputs[3]>=0.33) {
        this.eyes[i].col=tiles[this.eyes[i].tile].G/200;
      } else {
        this.eyes[i].col=tiles[this.eyes[i].tile].B/100;
      }
    }
  }

  for(var j=0, a1=this.attack; j<=HIGHESTINDEX; j++) {
    if(animals[j].alive && j!=this.index) {
      if((this.mouth.sees==0 && abs(this.mouth.mX-animals[j].x)-(s1/4))<=animals[j].size/2 && (abs(this.mouth.mY-animals[j].y)-(s1/4))<=animals[j].size/2) {
        if(this.outputs[3]<-0.33) {
          this.mouth.col=(animals[j].colors[0]-127.5)/127.5;
        } else if(this.outputs[3]>=0.33) {
          this.mouth.col=(animals[j].colors[1]-127.5)/127.5;
        } else {
          this.mouth.col=(animals[j].colors[2]-127.5)/127.5;
        }
        this.mouth.sense=animals[j].attack*animals[j].size/SIZECAP;
        this.mouth.sense2=animals[j].health;
        this.mouth.sees=1;
      }
      if(this.mouth.eats==0 && (abs(this.mouth.mX-animals[j].x)-(s1/2))<=(animals[j].size/2) && (abs(this.mouth.mY-animals[j].y)-(s1/2))<=(animals[j].size/2)) {
        if(this.outputs[2]<0) { //if carnivore
          if((this.outputs[3]<-0.33 && animals[j].domCol==0) || (this.outputs[3]>=0.33 && animals[j].domCol==1) || (this.outputs[3]<0.33 && this.outputs[3]>=-0.33 && animals[j].domCol==2)) {
            var f=s1*s1*s1*a1*abs(this.outputs[2]);
            if(a1>0){
              this.foodEnergy+=f;
              animals[j].loss+=f;
              this.dmgCaused+=f;
            } else {
              this.eChange+=f;
              animals[j].loss+=f;
              this.dmgCaused+=f;
            }
          } else {
            var f=s1*s1*a1*abs(this.outputs[2]);
            if(a1>0) {
              this.foodEnergy+=f;
              animals[j].loss+=f;
              this.dmgCaused+=f;
            } else {
              this.eChange+=f;
              animals[j].loss+=f;
              this.dmgCaused+=f;
            }
          }
        }
        this.mouth.eats=1;
      }
      for(var i=0, eN=this.eyeNumber; i<eN; i++) {
        if(this.eyes[i].sees==0 && (abs(this.eyes[i].eX-animals[j].x)-(s1/4))<=animals[j].size/2 && (abs(this.eyes[i].eY-animals[j].y)-(s1/4))<=animals[j].size/2) {
          if(this.outputs[3]<-0.33) {
            this.eyes[i].col=(animals[j].colors[0]-127.5)/127.5;
          } else if(this.outputs[3]>=0.33){
            this.eyes[i].col=(animals[j].colors[1]-127.5)/127.5;
          } else {
            this.eyes[i].col=(animals[j].colors[2]-127.5)/127.5;
          }
          this.eyes[i].sense=animals[j].attack*animals[j].size/SIZECAP;
          this.eyes[i].sees=1;
        }
      }
    }
  }
  if(this.outputs[2]>=0) {
    if(this.mouth.tile!=null) {
      var t = this.mouth.tile;
      if(this.outputs[3]<-0.33) {
        tiles[t].update=true;
        this.foodEnergy+=s1*this.outputs[2]*tiles[t].R; // Gain food energy in proportion to abundance of tile resources
        tiles[t].R-=s1/foodAmount;
        if(tiles[t].R<-tiles[t].RCap) {
          tiles[t].R=-tiles[t].RCap;
        }
      } else if(this.outputs[3]>=0.33) {
        tiles[t].update=true;
        this.foodEnergy+=s1*this.outputs[2]*tiles[t].G;
        tiles[t].G-=s1/foodAmount;
        if(tiles[t].G<-tiles[t].GCap) {
          tiles[t].G=-tiles[t].GCap;
        }
      } else {
        tiles[t].update=true;
        this.foodEnergy+=s1*this.outputs[2]*tiles[t].B;
        tiles[t].B-=s1/foodAmount;
        if(tiles[t].B<-tiles[t].BCap) {
          tiles[t].B=-tiles[t].BCap;
        }
      }
    }
  }
}
Animal.prototype.scores=function() {
  for(var i=0, sC=SCORESCAP;i<sC;i++) {
    if(this.top<=i) {
      break;
    } else if(scores[i]==null){
      if(this.top<sC) {
        scores[this.top]=null;
      }
      scores[i]=this.index; //If called from deadanimals during resetScore, it should work... no bugs yet
      this.top=i;
      break;
    }else {
      if(scores[i]<0){
        if(this.score>deadanimals[-(scores[i]+1)].score) {
          if(this.top<sC) {
            scores[this.top]=null;
          }
          var j;
          for(j=0;j<sC;j++) {
            if(scores[j]==null) {
              scores[j]=scores[i];
              deadanimals[-(scores[j]+1)].top=j;
              break;
            }
          }
          if(j==sC) {
            deadanimals[-(scores[i]+1)].top=sC;
          }
          scores[i]=this.index;
          this.top=i;
          break;
        }
      } else {
        if(this.score>animals[scores[i]].score) {
          if(this.top<sC) {
            scores[this.top]=null;
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
          scores[i]=this.index;
          this.top=i;
          break;
        }
      }
    }
  }
}
Animal.prototype.grow=function() {
  if(this.outputs[4]>=0.33) {
    if(this.size>=2*this.minSize) {
      if(LIVEPOP<POPCAP) {
        var i=0;
        while (animals[i]!=null) {
          if(animals[i].top<SCORESCAP || animals[i].alive) {  //Alive clause effectively determines that animal isnt overwriting itself
            i++;
          } else {
            break;
          }
        }
        if(i>HIGHESTINDEX) {
          HIGHESTINDEX=i;
        }
        var mutant=new Animal(this.x,this.y,i);
        this.descendants++;
        this.liveDesc++;
        this.mutate(mutant);
        //dont add child to genepool. Only add childs' differences to genePool when child has a child.

        this.mouth.dis*=(this.size-this.minSize)/this.size;
        for(var j=0;j<this.eyeNumber;j++){
          this.eyes[j].dis*=(this.size-this.minSize)/this.size;
        }
        this.size-=this.minSize;
        this.size=round(10*this.size)/10;
        this.children.push(i);
        this.deterioration/=2;
        mutant.deterioration=this.deterioration;
        animals[i]=null;
        animals[i]=mutant;
        newest=i;
        LIVEPOP++;

        var ancestor=this.pidx;
        while(ancestor!=null) {
          if(ancestor>=0) {
            animals[ancestor].descendants++;
            animals[ancestor].liveDesc++;
            animals[ancestor].genePool++;
            ancestor=animals[ancestor].pidx;
          } else {
            deadanimals[-(ancestor+1)].descendants++;
            deadanimals[-(ancestor+1)].liveDesc++;
            deadanimals[-(ancestor+1)].genePool++;
            ancestor=deadanimals[-(ancestor+1)].pidx;
          }
        }

        /*
        For every child had by child c of parent p, c gains influence on parent mutation direction.
          Example: Parent has 3 children c1, c2, c3. When any of those children have children, the difference (c-p) for some mut rate m
          is added to the parents mut rate. Then the parents
        */
        if(scoreType==0){
          this.score=this.children.length;
        }
        if(propagateMode==1) {
          var ancestor=this.pidx;
          while(ancestor!=null) {
            if(ancestor>=0) {
              this.propagate(ancestor);
              ancestor=animals[ancestor].pidx;
            } else {
              this.propagate(ancestor);
              ancestor=deadanimals[-(ancestor+1)].pidx;
            }
          }
        } else if(propagateMode==2){
          var anc1=this.index;
          var anc2=this.pidx;
          while(anc2!=null){
            if(anc1>=0){
              if(anc2>=0) {
                animals[anc1].propagate(anc2);
                anc1=anc2;
                anc2=animals[anc2].pidx;
              } else {
                animals[anc1].propagate(anc2);
                anc1=anc2;
                anc2=deadanimals[-(anc2+1)].pidx;
              }
            } else {
              if(anc2>=0) {
                deadanimals[-(anc1+1)].propagate(anc2);
                anc1=anc2;
                anc2=animals[anc2].pidx;
              } else {
                deadanimals[-(anc1+1)].propagate(anc2);
                anc1=anc2;
                anc2=deadanimals[-(anc2+1)].pidx;
              }
            }
          }
        }
      }
    }
  } else if(this.outputs[4]>-0.33) {
    if(this.size<this.maxSize && this.energy/10000>(this.size+0.1)) {
      this.mouth.dis*=(this.size+0.1)/this.size;
      for(var i=0;i<this.eyeNumber;i++){
        this.eyes[i].dis*=(this.size+0.1)/this.size;
      }
      this.size+=0.1;
      this.size=round(10*this.size)/10;
      this.energy-=1000;
    }
  }
}
Animal.prototype.decay=function() {

	if(this.energy<=0) {
		this.alive=false;
		LIVEPOP--;

		var c= this.tile;
		tiles[c].R+=this.size;
		if(tiles[c].R>255) {
			tiles[c].R=255;
		}
		tiles[c].G+=this.size;
		if(tiles[c].G>255) {
			tiles[c].G=255;
		}
		tiles[c].B+=this.size;
		if(tiles[c].B>255) {
			tiles[c].B=255;
		}

		if(this.index==HIGHESTINDEX) {
			var i=this.index;
			while(i>-1 && !animals[i].alive) {
				i--;
			}
			HIGHESTINDEX=i;
		}
		var dead = new Animal(this.x, this.y, deadanimals.length); // set a index to pos in dead array...
		this.copy(dead);

		if(this.pidx!=null) { //animal needs to tell parent/children its dead... needs to know if parent is alive. If parent dead, pidx will be negative (-(pidx+1)).
			if(this.pidx<0) { //if parent is dead, no worries
				deadanimals[-(this.pidx+1)].children[this.cno]= -(dead.index+1);
			} else {
        animals[this.pidx].children[this.cno]=-(dead.index+1);
      }

      var anc = this.pidx;
      while(anc!=null){
        if(anc>=0){
          animals[anc].liveDesc--;
          anc = animals[anc].pidx;
        } else {
          deadanimals[-(anc+1)].liveDesc--;
          anc = deadanimals[-(anc+1)].pidx;
        }
      }
      anc=this.pidx;
      if(regressMode==4){  // CNO
        if(this.cno!=null){
          if(this.children.length<(this.cno+1)){
            if(anc!=null){
              if(anc>=0){
                this.regress(this.pidx, anc, 1);
                animals[anc].genePool++;
              } else {
                this.regress(this.pidx, anc, 1);
                deadanimals[-(anc+1)].genePool++;
              }
            }
          }
        }
      } else if(regressMode>0){
        if(this.children.length<regressMode){
          if(anc!=null){
            if(anc>=0){
              this.regress(this.pidx, anc, 1);
              animals[anc].genePool++;
            } else {
              this.regress(this.pidx, anc, 1);
              deadanimals[-(anc+1)].genePool++;
            }
          }
        }
      }


      /*
      if(regressMode==4){  // CNO
        if(this.cno!=null){
          if(this.children.length<(this.cno+1)){
            var ancestor = this.pidx;
            while(ancestor!=null){
              if(ancestor>=0){
                this.regress2(this.pidx, ancestor, 1);
                if(ancestor==this.pidx){
                  animals[ancestor].genePool++;
                }
                ancestor = animals[ancestor].pidx;
              } else {
                this.regress2(this.pidx, ancestor, 1);
                if(ancestor==this.pidx){
                  deadanimals[-(ancestor+1)].genePool++;
                }
                ancestor = deadanimals[-(ancestor+1)].pidx;
              }
            }
          }
        }
      } else if(regressMode>0){
        if(this.children.length<regressMode){
          ancestor = this.pidx;
          while(ancestor!=null){
            if(ancestor>=0){
              this.regress2(this.pidx, ancestor, 1);
              if(ancestor==this.pidx){ // If ancestor wasnt parent, concentrate the mutation direction by reducing the gene pool...
                animals[ancestor].genePool++;
              }
              ancestor = animals[ancestor].pidx;
            } else {
              this.regress2(this.pidx, ancestor, 1);
              if(ancestor==this.pidx){
                deadanimals[-(ancestor+1)].genePool++;
              }
              ancestor = deadanimals[-(ancestor+1)].pidx;
            }
          }
        }
      }
      */
		}
    globalNetNRG+=this.netNRG;
    netLifespan+=this.age;
    while(this.gen>=popPerGen.length){
      popPerGen.push(0);
      FERPerGen.push(0);
      childPerGen.push(0);
    }
    popPerGen[this.gen]++;
    if(popPerGen[this.gen]>maxPopPerGen){
      maxPopPerGen=popPerGen[this.gen];
    }
    FERPerGen[this.gen]+=(this.posFNRG/this.netFNRG);
    childPerGen[this.gen]+=this.children.length;
    if(childPerGen[this.gen]/popPerGen[this.gen]>maxChildPerGen){
      maxChildPerGen=childPerGen[this.gen]/popPerGen[this.gen];
    }


		deadanimals.push(dead);
		for(var i=0, cL=this.children.length; i<cL; i++) {
			if(this.children[i]<0) {
				deadanimals[-(this.children[i]+1)].pidx=-(dead.index+1);
			} else {
				animals[this.children[i]].pidx=-(dead.index+1);
			}

		}
		if(highlighted==this.index) {
			highlighted=-(dead.index+1);
			if(display!=1 && display!=2) {
				console.setup();
			}
		}
    if(this.index==newest){
      newest=-(dead.index+1);
    }
    if(this.top<SCORESCAP) {
      scores[this.top]=-(dead.index+1);
    }

	} else {
		this.eChange+=this.foodEnergy-(this.size*(abs(this.rot)+abs(this.vel))+this.brainCost+abs(this.attack)+this.deterioration);
		this.energy+=this.eChange;
    if(this.eChange>0) {
      this.netNRG+=this.eChange;
    }
		if(this.energy>this.maxEnergy) {
			this.maxEnergy=this.energy;
		}
		if(this.foodEnergy<0){
			this.deterioration+=(-this.foodEnergy)/(this.size*10000);
      this.netFNRG-=this.foodEnergy;
		} else {
      this.netFNRG+=this.foodEnergy;
      this.posFNRG+=this.foodEnergy;
    }
    if(this.netFNRG!=0){
      aveFER+=(this.posFNRG/this.netFNRG)/LIVEPOP; // Add living animals ratio of pos/net FNRG
    }
    aveAge+=this.age/LIVEPOP;
    aveChildren+=(this.children.length)/LIVEPOP;
		if(this.loss>0) {
			this.deterioration+=this.loss/10000;
		}
		if(this.deterioration<0) {
			this.deterioration=0;
		}
		this.loss=0;
		if(this.foodEnergy>this.maxFNRG) {
			this.maxFNRG=this.foodEnergy;
		} else if(this.foodEnergy<this.minFNRG) {
			this.minFNRG=this.foodEnergy;
		}
    this.age++;
		if(this.eChange>this.maxECH) {
			this.maxECH=this.eChange;
		} else if(this.eChange<this.minECH) {
			this.minECH=this.eChange;
		}
		this.health=(this.energy-(this.maxEnergy/2))/(this.maxEnergy/2);
    if(scoreType==1){
      this.score=this.age;
    } else if(scoreType==2){
      this.score=round(this.netNRG);
    }
	}
}
Animal.prototype.mutate=function(a) {
  a.alive=true;
  a.dir=this.dir;
  a.gen=this.gen+1;
  a.x=this.x;
  a.y=this.y;
  a.parent=this.name+"-"+this.gen;
  a.pidx=this.index;
  a.cno=this.children.length;
  a.parentAge=this.age;
  a.parentNetNRG=this.netNRG;
  a.name=this.name;
  a.muta=this.muta;

  var mux; //Starts at 1 to signify the current child
  if(propagateMode>0 && this.genePool>0){
    mux=this.genePool; // descendants DO NOT include animals own children: rather, counts GRANDCHILDREN (how successful each of its children have been at reproducing)
  }else {
    mux=1;
  }

  a.velres=this.velres;
  a.rotres=this.rotres;

  /*
  a.senmuts[0]=this.senmuts[0]/mux; //set child and parent mutation rates identical...
  a.senmuts[1]=this.senmuts[1]/mux;
  a.senmuts[0]=round(100*a.senmuts[0])/100;
  a.senmuts[1]=round(100*a.senmuts[1])/100;
  */

  a.velres+=((this.senmuts[0]/mux)+(randn_bm()/100)); // child genes displaced incrementally... PARENTS DONT CHANGE
  a.rotres+=((this.senmuts[1]/mux)+(randn_bm()/100));
  a.velres=round(100*a.velres)/100;
  a.rotres=round(100*a.rotres)/100;

  /*
  a.maxSizeGene=this.maxSizeGene/mux;
  a.minSizeGene=this.minSizeGene/mux;
  a.maxSizeGene=round(10*a.maxSizeGene)/10;
  a.minSizeGene=round(10*a.minSizeGene)/10;
  */

  a.maxSize=this.maxSize;
  a.minSize=this.minSize;
  a.maxSize+=((this.maxSizeGene/mux)+(randn_bm()/10));
  a.maxSize=round(10*a.maxSize)/10;
  if(a.maxSize>SIZECAP) {
    a.maxSize=SIZECAP;
  } else if(a.maxSize<round(20*a.minSize)/10) {
    a.maxSize=2*a.minSize;
  }
  a.maxSize=round(10*a.maxSize)/10;

  a.minSize+=((this.minSizeGene/mux)+(randn_bm()/10));
  a.minSize=round(10*a.minSize)/10;
  if(a.minSize>round(10*(a.maxSize-0.1)/2)/10) {
    a.minSize=round(10*(a.maxSize-0.1)/2)/10;
  }else if(a.minSize<5) {
    a.minSize=5;
  }
  a.minSize=round(10*a.minSize)/10;

  a.midSize=(a.maxSize-a.minSize)/2;
  a.size=a.minSize;

  a.energy=a.minSize*10000;
  a.maxEnergy=a.energy;
  a.vel=this.vel;
  a.rot=this.rot;
  a.attack=this.attack;

  var mA=a.muta;
  var cx=0;
  if(round(Math.random()*mA)==mA) {
    if(round(Math.random()*(mA+1))==mA) {
      if(round(Math.random()*(mA+2))==mA) {
        if(round(Math.random()*(mA+3))==mA) {
          a.name=ALPH.charAt(round(Math.random()*25))+a.name.charAt(1)+a.name.charAt(2)+a.name.charAt(3);
          cx=8;
        } else {
          a.name=a.name.charAt(0)+ALPH.charAt(round(Math.random()*25))+a.name.charAt(2)+a.name.charAt(3);
          cx=6;
        }
      } else {
        a.name=a.name.charAt(0)+a.name.charAt(1)+ALPH.charAt(round(Math.random()*25))+a.name.charAt(3);
        cx=4;
      }
    } else {
      a.name=a.name.charAt(0)+a.name.charAt(1)+a.name.charAt(2)+ALPH.charAt(round(Math.random()*25));
      cx=2;
    }
  }

  for(var c=0; c<15; c++) {
    if(c<3) {
      a.colors[c]=this.colors[c];
      a.colors[c]+=(round(Math.random()*2*cx*(10-mA))-(cx*(10-mA)));
      if(a.colors[c]>255) {
        a.colors[c]=255;
      } else if(a.colors[c]<0) {
        a.colors[c]=0;
      }
    } else if(c<6) {
      a.colors[c]=(a.colors[c%3]-20);
    } else if (c<9) {
      a.colors[c]=(a.colors[c%3]+20);
    } else if (c<12) {
      a.colors[c]=(a.colors[c%3]-40);
    } else {
      a.colors[c]=(a.colors[c%3]+40);
    }
    if(a.colors[c]<0) {
      a.colors[c]=0;
    } else if(a.colors[c]>255) {
      a.colors[c]=255;
    }
  }
  for(var c=0; c<5; c++) {
    a.hexes[c]=rgbToHex(a.colors[c*3],a.colors[(c*3)+1],a.colors[(c*3)+2]);
  }
  if(a.colors[0]>a.colors[2] && a.colors[0]>a.colors[1]) {
    a.domCol=0;
  } else if(a.colors[0]<a.colors[2] && a.colors[2]<a.colors[1]) {
    a.domCol=1;
  } else {
    a.domCol=2;
  }

  a.mouth = new Mouth(a.dir, a.x, a.y);
  a.mouth.dir=this.mouth.dir;
  a.mouth.stray=this.mouth.stray;
  a.mouth.dissen=this.mouth.dissen;
  a.mouth.dirsen=this.mouth.dirsen;
  a.mouth.col=this.mouth.col;
  a.mouth.sense=this.mouth.sense;
  a.mouth.sense2=this.mouth.sense2;

  /*
  a.mouth.mutrs[0]=this.mouth.mutrs[0]/mux;
  a.mouth.mutrs[1]=this.mouth.mutrs[1]/mux;
  a.mouth.mutrs[0]=round(10000*a.mouth.mutrs[0])/10000;
  a.mouth.mutrs[1]=round(10000*a.mouth.mutrs[1])/10000;
  */

  a.mouth.dissen+=((this.mouth.mutrs[0]/mux)+(randn_bm()/1000));
  a.mouth.dirsen+=((this.mouth.mutrs[1]/mux)+(randn_bm()/1000));
  a.mouth.dissen=round(10000*a.mouth.dissen)/10000;
  a.mouth.dirsen=round(10000*a.mouth.dirsen)/10000;

  for(var i=0;i<MEMCAP;i++) {
    a.memory[i]=this.memory[i];
  }

  a.brainCost=0;
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      a.brain[i][j].cost=0;
      a.brain[i][j].is=this.brain[i][j].is;

      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        a.brain[i][j].weights[k]=this.brain[i][j].weights[k];
        a.brain[i][j].bias[k]=this.brain[i][j].bias[k];

        /*
        a.brain[i][j].wGenes[k]=this.brain[i][j].wGenes[k]/mux;
        a.brain[i][j].bGenes[k]=this.brain[i][j].bGenes[k]/mux;
        a.brain[i][j].wGenes[k]=round(10000*a.brain[i][j].wGenes[k])/10000;
        a.brain[i][j].bGenes[k]=round(10000*a.brain[i][j].bGenes[k])/10000;
        */

        a.brain[i][j].weights[k]+=((this.brain[i][j].wGenes[k]/mux)+(randn_bm()/1000));
        a.brain[i][j].bias[k]+=((this.brain[i][j].bGenes[k]/mux)+(randn_bm()/1000));

        a.brain[i][j].weights[k]=round(10000*a.brain[i][j].weights[k])/10000;
        a.brain[i][j].bias[k]=round(10000*a.brain[i][j].bias[k])/10000;
        a.brain[i][j].cost+=(abs(a.brain[i][j].weights[k])+abs(a.brain[i][j].bias[k]));
      }
      a.brainCost+=a.brain[i][j].cost;
    }
  }
  a.brainCost/=(BRAINSIZECAP*BRAINLAYERSCAP);
  a.eyeNumber=this.eyeNumber;
  for(var i=0;i<BRAINSIZECAP;i++) {
    a.outputs[i]=this.outputs[i];
  }

  for(var i=0, eC=EYECAP; i<eC; i++) {
    if(i<a.eyeNumber && this.eyes[i]!=null) {
      a.eyes[i]=new Eye(a.dir,a.x,a.y);
      a.eyes[i].dir=this.eyes[i].dir;
      a.eyes[i].stray=this.eyes[i].stray;
      a.eyes[i].dissen=this.eyes[i].dissen;
      a.eyes[i].dirsen=this.eyes[i].dirsen;
      a.eyes[i].col=this.eyes[i].col;
      a.eyes[i].sense=this.eyes[i].sense;

      /*
      a.eyes[i].mutrs[0]=this.eyes[i].mutrs[0]/mux;
      a.eyes[i].mutrs[1]=this.eyes[i].mutrs[1]/mux;
      a.eyes[i].mutrs[0]=round(10000*a.eyes[i].mutrs[0])/10000;
      a.eyes[i].mutrs[1]=round(10000*a.eyes[i].mutrs[1])/10000;
      */

      a.eyes[i].dissen+=((this.eyes[i].mutrs[0]/mux)+(randn_bm()/1000));
      a.eyes[i].dirsen+=((this.eyes[i].mutrs[1]/mux)+(randn_bm()/1000));
      a.eyes[i].dissen=round(10000*a.eyes[i].dissen)/10000;
      a.eyes[i].dirsen=round(10000*a.eyes[i].dirsen)/10000;
    }
  }

  if(round(Math.random()*mA)==mA) {
    a.muta+=(round(Math.random()*2)-1);
  }
  if(a.muta>MUTCAP) {
    a.muta=MUTCAP;
  } else if (a.muta<0){
    a.muta=0;
  }
}
Animal.prototype.copy=function(a) {
  a.alive=false;
  a.gen=this.gen;
  a.x=this.x;
  a.y=this.y;
  a.parent=this.parent;
  a.pidx=this.pidx;
  a.cno=this.cno;
  a.parentAge=this.parentAge;
  a.parentNetNRG=this.parentNetNRG;
  a.name=this.name;
  a.attack=this.attack;
  a.tile=this.tile;
  a.muta=this.muta;
  a.maxSize=this.maxSize;
  a.minSize=this.minSize;
  a.midSize=this.midSize;
  a.size=this.size;
  a.energy=this.energy;
  a.maxEnergy=this.maxEnergy;
  a.vel=this.vel;
  a.rot=this.rot;
  a.dir=this.dir;
  a.velres=this.velres;
  a.rotres=this.rotres;
  a.maxSizeGene=this.maxSizeGene;
  a.minSizeGene=this.minSizeGene;
  a.score=this.score;
  a.age=this.age;

  for(var i=0;i<2;i++) {
    a.senmuts[i]=this.senmuts[i];
  }

  for(var i=0;i<this.children.length;i++) {
    a.children.push(this.children[i]);
  }
  a.descendants=this.descendants;
  a.liveDesc=this.liveDesc;
  a.genePool=this.genePool;
  a.dmgCaused=this.dmgCaused;
  a.dmgReceived=this.dmgReceived;
  a.health=this.health;
  a.deterioration=this.deterioration;
  a.netFNRG=this.netFNRG;
  a.posFNRG=this.posFNRG;

  a.foodEnergy=this.foodEnergy;
  a.eChange=this.eChange;
  a.netNRG= this.netNRG;

  for(var c=0; c<15; c++) {
    a.colors[c]=this.colors[c];
  }
  for(var c=0; c<5; c++) {
    a.hexes[c]=this.hexes[c];
  }
  a.domCol=this.domCol;

  a.eyeNumber=this.eyeNumber;
  for(var i=0; i<a.eyeNumber; i++) {
    a.eyes[i]=new Eye(a.dir,a.x,a.y);
    a.eyes[i].dissen=this.eyes[i].dissen;
    a.eyes[i].dirsen=this.eyes[i].dirsen;
    a.eyes[i].dir=this.eyes[i].dir;
    a.eyes[i].stray=this.eyes[i].stray;
    a.eyes[i].dis=this.eyes[i].dis;
    a.eyes[i].eX=this.eyes[i].eX;
    a.eyes[i].eY=this.eyes[i].eY;
    a.eyes[i].col=this.eyes[i].col;
    a.eyes[i].sense=this.eyes[i].sense;
    for(var j=0;j<2;j++) {
      a.eyes[i].mutrs[j]=this.eyes[i].mutrs[j];
    }
  }

  a.mouth.dissen=this.mouth.dissen;
  a.mouth.dirsen=this.mouth.dirsen;
  a.mouth.dir=this.mouth.dir;
  a.mouth.stray=this.mouth.stray;
  a.mouth.dis=this.mouth.dis;
  a.mouth.mX=this.mouth.mX;
  a.mouth.mY=this.mouth.mY;
  a.mouth.tile=this.mouth.tile;
  a.mouth.col=this.mouth.col;
  a.mouth.sense=this.mouth.sense;
  a.mouth.sense2=this.mouth.sense2;
  for(var i=0;i<2;i++) {
    a.mouth.mutrs[i]=this.mouth.mutrs[i];
  }

  for(var i=0;i<MEMCAP;i++) {
    a.memory[i]=this.memory[i];
  }

  for(var i=0; i<BRAINLAYERSCAP; i++) {
    for(var j=0;j<BRAINSIZECAP;j++) {
      a.brain[i][j].cost=this.brain[i][j].cost;
      a.brain[i][j].is=this.brain[i][j].is;
      for(var k=0;k<BRAINSIZECAP;k++) {
        a.brain[i][j].weights[k]=this.brain[i][j].weights[k];
        a.brain[i][j].bias[k]=this.brain[i][j].bias[k];
        a.brain[i][j].wGenes[k]=this.brain[i][j].wGenes[k];
        a.brain[i][j].bGenes[k]=this.brain[i][j].bGenes[k];
        a.brain[i][j].maxOut=this.brain[i][j].maxOut;
        a.brain[i][j].minOut=this.brain[i][j].minOut;
      }
    }
  }
  a.brainCost=this.brainCost;
  for(var i=0;i<BRAINSIZECAP;i++) {
    a.outputs[i]=this.outputs[i];
  }
}
Animal.prototype.clone=function(a) {
  var mux;
  if(propagateMode>0 && this.genePool>0){
    mux=this.genePool;
  }else {
    mux=1;
  }

  a.alive=true;
  a.gen=this.gen+1;
  a.x=this.x;
  a.y=this.y;
  a.parent=this.name+"-"+this.gen;
  a.pidx=-(this.index+1);
  a.cno=this.children.length;
  a.parentAge=this.parentAge;
  a.parentNetNRG=this.parentNetNRG;
  a.name=this.name;
  a.attack=this.attack;
  a.tile=this.tile;
  a.muta=this.muta;

  a.maxSize=this.maxSize;
  a.minSize=this.minSize;
  a.maxSize+=(this.maxSizeGene/mux);
  a.maxSize=round(10*a.maxSize)/10;
  if(a.maxSize>SIZECAP) {
    a.maxSize=SIZECAP;
  } else if(a.maxSize<round(20*a.minSize)/10) {
    a.maxSize=2*a.minSize;
  }
  a.maxSize=round(10*a.maxSize)/10;

  a.minSize+=(this.minSizeGene/mux);
  a.minSize=round(10*a.minSize)/10;
  if(a.minSize>round(10*(a.maxSize-0.1)/2)/10) {
    a.minSize=round(10*(a.maxSize-0.1)/2)/10;
  }else if(a.minSize<5) {
    a.minSize=5;
  }
  a.minSize=round(10*a.minSize)/10;

  a.midSize=(a.maxSize-a.minSize)/2;
  a.size=a.minSize;

  /*
  a.maxSizeGene=this.maxSizeGene/mux;
  a.minSizeGene=this.minSizeGene/mux;
  a.maxSizeGene=round(10*a.maxSizeGene)/10;
  a.minSizeGene=round(10*a.minSizeGene)/10;
  */

  a.energy=this.minSize*10000;
  a.maxEnergy=this.energy;
  a.vel=this.vel;
  a.rot=this.rot;
  a.dir=this.dir;
  a.velres=this.velres;
  a.rotres=this.rotres;
  a.velres+=(this.senmuts[0]/mux); // child genes displaced incrementally... PARENTS DONT CHANGE
  a.rotres+=(this.senmuts[1]/mux);
  a.velres=round(100*a.velres)/100;
  a.rotres=round(100*a.rotres)/100;

  /*
  for(var i=0;i<2;i++) {
    a.senmuts[i]=this.senmuts[i]/mux;
  }
  a.senmuts[0]=round(100*a.senmuts[0])/100;
  a.senmuts[1]=round(100*a.senmuts[1])/100;
  */

  a.health=this.health;
  a.foodEnergy=this.foodEnergy;
  a.eChange=this.eChange;

  for(var c=0; c<15; c++) {
    a.colors[c]=this.colors[c];
  }
  for(var c=0; c<5; c++) {
    a.hexes[c]=this.hexes[c];
  }
  a.domCol=this.domCol;

  a.eyeNumber=this.eyeNumber;
  for(var i=0; i<a.eyeNumber; i++) {
    a.eyes[i]=new Eye(a.dir,a.x,a.y);

    a.eyes[i].dissen=this.eyes[i].dissen;
    a.eyes[i].dirsen=this.eyes[i].dirsen;

    a.eyes[i].dissen+=(this.eyes[i].mutrs[0]/mux);
    a.eyes[i].dirsen+=(this.eyes[i].mutrs[1]/mux);
    a.eyes[i].dissen=round(10000*a.eyes[i].dissen)/10000;
    a.eyes[i].dirsen=round(10000*a.eyes[i].dirsen)/10000;

    a.eyes[i].dir=this.eyes[i].dir;
    a.eyes[i].stray=this.eyes[i].stray;
    a.eyes[i].dis=this.eyes[i].dis;
    a.eyes[i].eX=this.eyes[i].eX;
    a.eyes[i].eY=this.eyes[i].eY;
    a.eyes[i].col=this.eyes[i].col;
    a.eyes[i].sense=this.eyes[i].sense;
    /*
    for(var j=0;j<2;j++) {
      a.eyes[i].mutrs[j]=this.eyes[i].mutrs[j]/mux;
    }
    a.eyes[i].mutrs[0]=round(10000*a.eyes[i].mutrs[0])/10000;
    a.eyes[i].mutrs[1]=round(10000*a.eyes[i].mutrs[1])/10000;
    */
  }

  a.mouth.dissen=this.mouth.dissen;
  a.mouth.dirsen=this.mouth.dirsen;

  a.mouth.dissen+=(this.mouth.mutrs[0]/mux);
  a.mouth.dirsen+=(this.mouth.mutrs[1]/mux);
  a.mouth.dissen=round(10000*a.mouth.dissen)/10000;
  a.mouth.dirsen=round(10000*a.mouth.dirsen)/10000;

  a.mouth.dir=this.mouth.dir;
  a.mouth.stray=this.mouth.stray;
  a.mouth.dis=this.mouth.dis;
  a.mouth.mX=this.mouth.mX;
  a.mouth.mY=this.mouth.mY;
  a.mouth.tile=this.mouth.tile;
  a.mouth.col=this.mouth.col;
  a.mouth.sense=this.mouth.sense;
  a.mouth.sense2=this.mouth.sense2;
  /*
  for(var i=0;i<2;i++) {
    a.mouth.mutrs[i]=this.mouth.mutrs[i]/mux;
  }
  a.mouth.mutrs[0]=round(10000*a.mouth.mutrs[0])/10000;
  a.mouth.mutrs[1]=round(10000*a.mouth.mutrs[1])/10000;
  */
  for(var i=0;i<MEMCAP;i++) {
    a.memory[i]=this.memory[i];
  }
  a.brainCost=0;
  for(var i=0; i<BRAINLAYERSCAP; i++) {
    for(var j=0;j<BRAINSIZECAP;j++) {
      a.brain[i][j].cost=0;
      a.brain[i][j].is=this.brain[i][j].is;
      for(var k=0;k<BRAINSIZECAP;k++) {

        a.brain[i][j].weights[k]=this.brain[i][j].weights[k];
        a.brain[i][j].bias[k]=this.brain[i][j].bias[k];

        a.brain[i][j].weights[k]+=(this.brain[i][j].wGenes[k]/mux);
        a.brain[i][j].bias[k]+=(this.brain[i][j].bGenes[k]/mux);
        a.brain[i][j].weights[k]=round(10000*a.brain[i][j].weights[k])/10000;
        a.brain[i][j].bias[k]=round(10000*a.brain[i][j].bias[k])/10000;
        a.brain[i][j].cost+=abs(a.brain[i][j].weights[k])+abs(a.brain[i][j].bias[k]);
        /*
        a.brain[i][j].wGenes[k]=this.brain[i][j].wGenes[k]/mux;
        a.brain[i][j].bGenes[k]=this.brain[i][j].bGenes[k]/mux;
        a.brain[i][j].wGenes[k]=round(10000*a.brain[i][j].wGenes[k])/10000;
        a.brain[i][j].bGenes[k]=round(10000*a.brain[i][j].bGenes[k])/10000;
        */
        a.brain[i][j].maxOut=this.brain[i][j].maxOut;
        a.brain[i][j].minOut=this.brain[i][j].minOut;
      }
      a.brainCost+=a.brain[i][j].cost;
    }
  }
  a.brainCost/=(BRAINSIZECAP*BRAINLAYERSCAP);
  for(var i=0;i<BRAINSIZECAP;i++) {
    a.outputs[i]=this.outputs[i];
  }
}
Animal.prototype.kill=function() {
  if(this.alive){
    this.energy=-1;
  }
}
Animal.prototype.reincarnate=function() {
  if(!this.alive){
    if(LIVEPOP<POPCAP) {
      var i=0;
      while (animals[i]!=null) {
        if(animals[i].top<SCORESCAP || animals[i].alive) {  //Alive clause effectively determines that animal isnt overwriting itself
          i++;
        } else {
          break;
        }
      }
      if(i>HIGHESTINDEX) {
        HIGHESTINDEX=i;
      }

      var rein=new Animal(this.x,this.y,i);
      this.clone(rein);
      this.descendants++;
      this.liveDesc++;
      this.children.push(i);

      animals[i]=null;
      animals[i]=rein;

      newest=i;
      LIVEPOP++;
      var ancestor=this.pidx;
      while(ancestor!=null) {
        if(ancestor>=0) {
          animals[ancestor].descendants++;
          animals[ancestor].liveDesc++;
          animals[ancestor].genePool++;
          ancestor=animals[ancestor].pidx;
        } else {
          deadanimals[-(ancestor+1)].descendants++;
          deadanimals[-(ancestor+1)].liveDesc++;
          deadanimals[-(ancestor+1)].genePool++;
          ancestor=deadanimals[-(ancestor+1)].pidx;
        }
      }
      highlighted= rein.index;
    }
  }
}
Animal.prototype.highlight=function() {
  if(this.alive==false) {
    this.draw();
  }
  var s = this.size;
  ctx2.beginPath();
  ctx2.fillStyle="#FFFFFF";
  ctx2.strokeStyle="#FFFFFF";
  ctx2.strokeRect(this.x-(2*s), this.y-(2*s), s*4, s*4);
  var navX=this.x+(this.vel*this.size*Math.cos(this.dir*DEGTORAD));
  var navY=this.y+(this.vel*this.size*Math.sin(this.dir*DEGTORAD));
  ctx2.moveTo(this.x,this.y);
  ctx2.lineTo(navX, navY);
  ctx2.lineTo(navX+(this.rot*this.size*Math.cos((this.dir+90)*DEGTORAD)),navY+(this.rot*this.size*Math.sin((this.dir+90)*DEGTORAD)));
  ctx2.stroke();
  if(terrainMouse && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50) {
    for(var i=0;i<this.eyeNumber;i++) {
      ctx2.beginPath();
      ctx2.arc(this.eyes[i].eX,this.eyes[i].eY, round(this.size/5), 0, TWOPI);
      ctx2.fillText("E"+(i+1), this.eyes[i].eX+(s/2), this.eyes[i].eY-(s/2));
      ctx2.stroke();
    }
  }
  ctx2.fillText(this.name+"-"+this.gen+(this.alive ? "A":"D")+this.children.length,this.x+(2*s), this.y-(2*s));

  if(display==0) { // STAT DISPLAY

    ctx4.beginPath();
    ctx4.fillStyle=this.hexes[0];
    ctx4.fillRect(200,200,400,200);

    var posx=210;
    var posy=210;
    ctx4.fillStyle= "#FFFFFF";
    if(this.colors[0]>127 || this.colors[1]>127 || this.colors[2]>127) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    ctx4.fillText("IDX: "+this.index,posx,posy+=10);

    if(this.parent!=null) {
      if(this.pidx<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+deadanimals[(-(this.pidx+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.pidx].children.length,posx, posy+=10);
      }
      if(consoleMouse && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.pidx;
            leftPressed=false;
          }
        }
      }
    }
    if(this.cno!=null){
      ctx4.fillText("CNO: "+(this.cno+1),posx,posy+=10);
    }
    ctx4.fillText("DESC: "+this.liveDesc+"/"+this.descendants,posx,posy+=10);
    ctx4.fillText("GENE: "+this.genePool,posx,posy+=10);


    posy+=10;
    ctx4.fillText("NRG: "+round(this.energy),posx,posy+=10);
    ctx4.fillText("NETNRG: "+round(this.netNRG),posx,posy+=10);
    ctx4.fillText("TOP: "+round(this.top),posx, posy+=10);
    ctx4.fillText("B$: "+(round(10000*this.brainCost)/10000),posx,posy+=10);
    posy+=10;
    ctx4.fillText("POS: "+this.x+", "+this.y,posx,posy+=10);
    ctx4.fillText("DIR: "+round(this.dir*10)/10,posx, posy+=10);
    ctx4.fillText("VEL: "+round(this.vel*10)/10,posx, posy+=10);
    ctx4.fillText("ROT: "+round(this.rot*10)/10,posx, posy+=10);
    ctx4.fillText("HLTH: "+round(100*this.health)/100, posx,posy+=10);
    ctx4.fillText("AGE: "+this.age, posx,posy+=10);

    posx+=100;
    posy=210;
    ctx4.fillText("SMAX: "+this.maxSize, posx, posy+=10);
    ctx4.fillText("SIZE: "+(round(10*s)/10), posx, posy+=10);
    ctx4.fillText("SMIN: "+this.minSize, posx, posy+=10);
    posy+=10;
    if(this.attack<-0.75) {
      ctx4.fillText("ATK---",posx,posy+=10);
    } else if(this.attack<-0.5) {
      ctx4.fillText("ATK--",posx,posy+=10);
    } else if(this.attack<-0.25) {
      ctx4.fillText("ATK-",posx,posy+=10);
    } else if(this.attack>=0.75) {
      ctx4.fillText("ATK+++",posx,posy+=10);
    } else if(this.attack>=0.50) {
      ctx4.fillText("ATK++",posx,posy+=10);
    } else if(this.attack>=0.25) {
      ctx4.fillText("ATK+",posx,posy+=10);
    } else {
      posy+=10;
    }
    ctx4.fillText(">>DMG: "+round(this.dmgReceived*100)/100,posx,posy+=10);
    ctx4.fillText("DMG>>: "+round(this.dmgCaused*100)/100,posx,posy+=10);
    ctx4.fillText("DTRI: "+round(10000*this.deterioration)/10000, posx,posy+=10);
    posy+=10;
    if(this.outputs[2]<-0.75) {
      ctx4.fillText("CARN++",posx,posy+=10);
    } else if(this.outputs[2]<-0.5) {
      ctx4.fillText("CARN+",posx,posy+=10);
    } else if(this.outputs[2]<-0.25) {
      ctx4.fillText("CARN",posx,posy+=10);
    } else if(this.outputs[2]>=0.75) {
      ctx4.fillText("HERB++",posx,posy+=10);
    } else if(this.outputs[2]>=0.50) {
      ctx4.fillText("HERB+",posx,posy+=10);
    } else if(this.outputs[2]>=0.25) {
      ctx4.fillText("HERB",posx,posy+=10);
    } else {
      posy+=10;
    }
    if(this.outputs[3]<-0.33) {
      ctx4.fillText("EATR",posx,posy+=10);
    } else if(this.outputs[3]>=0.33) {
      ctx4.fillText("EATG",posx,posy+=10);
    } else {
      ctx4.fillText("EATB",posx,posy+=10);
    }
    ctx4.fillText("ECH+: "+(round(this.maxECH*100)/100),posx,posy+=10);
    ctx4.fillText("ECH-: "+(round(this.minECH*100)/100),posx,posy+=10);
    ctx4.fillText("MAXFNRG: "+(round(this.maxFNRG*100)/100),posx,posy+=10);
    ctx4.fillText("MINFNRG: "+(round(this.minFNRG*100)/100),posx,posy+=10);
    ctx4.fillText("NETFNRG: "+(round(this.netFNRG*100)/100),posx,posy+=10);
    ctx4.fillText("POSFNRG: "+(round(this.posFNRG*100)/100),posx,posy+=10);
    ctx4.fillText("FER: "+(round(this.posFNRG*100/this.netFNRG)/100),posx,posy+=10);
    posx+=100;
    posy=210;
    ctx4.fillText("MTILE: "+this.mouth.tile+" MPOS: "+this.mouth.mX+", "+this.mouth.mY, posx, posy+=10);
    ctx4.fillText("MDISRES: "+this.mouth.dissen+" MDIRRES: "+this.mouth.dirsen+(this.mouth.sees==1 ? " !!!":""), posx, posy+=10);
    ctx4.fillText("VELRES: "+this.velres, posx, posy+=10);
    ctx4.fillText("ROTRES: "+this.rotres, posx, posy+=10);
    posy+=10;
    if(this.eyeNumber>0) {
      for(var i=0;i<this.eyeNumber;i++) {
        ctx4.fillText("E"+(i+1)+" DISRES: "+this.eyes[i].dissen+" DIRRES: "+this.eyes[i].dirsen+(this.eyes[i].sees==1 ? " !!!":""), posx, posy+=10);
      }
      posy+=10;
    }
    ctx4.fillText("MUTA: "+this.muta, posx, posy+=10);

    ctx4.fillStyle= this.hexes[4];
    ctx4.fillRect(200,200,10,10);
    ctx4.fillRect(220,200,10,10);
    ctx4.fillRect(240,200,10,10);
    ctx4.fillRect(260,200,10,10);
    ctx4.fillRect(280,200,10,10);
    ctx4.fillRect(300,200,10,10);
    ctx4.fillStyle= this.hexes[3];
    ctx4.fillText("X",201,209);
    ctx4.fillText("B",221,209);
    ctx4.fillText("F",241,209);
    ctx4.fillText("M",261,209);
    ctx4.fillText("R",281,209);
    ctx4.fillText("K",301,209);

    if(consoleMouse && leftPressed) {
      if(mouseX>200 && mouseX<210 && mouseY>200 && mouseY<210) { // Exit
        display=0;
        highlighted=null;
        ctx3.fillStyle="#323232";
        ctx3.fillRect(200, 200, 400, 200);
        leftPressed=false;
      } else if(mouseX>220 && mouseX<230 && mouseY>200 && mouseY<210) { // Brain
        display=1;
        leftPressed=false;
      } else if(mouseX>240 && mouseX<250 && mouseY>200 && mouseY<210) { // Fam
        display=3;
        leftPressed=false;
      } else if(mouseX>260 && mouseX<270 && mouseY>200 && mouseY<210) { // Muts
        display=4;
        leftPressed=false;
      } else if(mouseX>280 && mouseX<290 && mouseY>200 && mouseY<210) { // Reincarnate
        this.reincarnate();
        leftPressed=false;
      } else if(mouseX>300 && mouseX<310 && mouseY>200 && mouseY<210) {
        this.kill();
        leftPressed=false;
      }
    }
  } else if(display==1) { // BRAIN DISPLAY
    ctx3.beginPath();
    ctx3.fillStyle="#808080";
    ctx3.fillRect(0,0,CONSOLEX,CONSOLEY);
    ctx3.fillStyle="#A0A0A0"
    ctx3.fillRect(0,0,10,10);
    ctx3.fillStyle="#606060"
    ctx3.fillText("X",1,9);
    ctx3.fillStyle=this.hexes[0];
    ctx3.arc(40,40, 25, 0, TWOPI);
    ctx3.fill();
    ctx3.fillStyle="#FFFFFF";

    var posx=120;
    var posy=30;
    var spcx=60;
    var spcy=22;
    for(var k=0, bL=BRAINLAYERSCAP; k<bL; k++) {
      ctx3.beginPath();
      for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
        posy+=spcy;
        ctx3.arc(posx, posy, 8, 0, TWOPI);
      }
      ctx3.fill();
      posx+=spcx;
      posy=30;
    }
    ctx3.fillStyle= "#FFFFFF";
    if(this.colors[0]>127 || this.colors[1]>127 || this.colors[2]>127) {
      ctx3.fillStyle= "#000000";
    }
    ctx3.beginPath();
    posx=75;
    posy=40-6;
    ctx3.fillText("VELO",posx, posy+=spcy);
    ctx3.fillText("ROTA",posx, posy+=spcy);
    ctx3.fillText("NRG",posx, posy+=spcy);
    ctx3.fillText("FNRG", posx, posy+=spcy);
    posy+=spcy; // eats col
    posy+=spcy; // eats type
    ctx3.fillText("MCOL", posx, posy+=spcy);
    ctx3.fillText("MSN", posx, posy+=spcy);
    ctx3.fillText("MSN2", posx, posy+=spcy);
    ctx3.fillText("MDIR", posx, posy+=spcy);
    ctx3.fillText("MDIS", posx, posy+=spcy);
    ctx3.fillText("HLTH", posx, posy+=spcy);
    ctx3.fillText("SIZE", posx, posy+=spcy);
    ctx3.fillText("ATK",posx,posy+=spcy);
    ctx3.fillText("MEM1", posx, posy+=spcy);
    ctx3.fillText("MEM2", posx, posy+=spcy);
    ctx3.fillText("MEM3", posx, posy+=spcy);
    ctx3.fillText("MEM4", posx, posy+=spcy);
    ctx3.fillText("MEM5", posx, posy+=spcy);
    ctx3.fillText("MEM6", posx, posy+=spcy);
    ctx3.fillText("MEM7", posx, posy+=spcy);
    ctx3.fillText("MEM8", posx, posy+=spcy);

    for(var i=0, eN=this.eyeNumber; i<eN;i++) {
      ctx3.fillText("E"+(i+1)+"COL",posx,posy+=spcy);
      ctx3.fillText("E"+(i+1)+"SEN",posx,posy+=spcy);
      ctx3.fillText("E"+(i+1)+"DIR",posx,posy+=spcy);
      ctx3.fillText("E"+(i+1)+"DIS",posx,posy+=spcy);
    }
    display=2;
  } else if(display==3) {
    var posx=210;
    var posy=210;
    ctx4.beginPath();
    ctx4.fillStyle=this.hexes[0];
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= this.hexes[4];
    ctx4.fillRect(200,200,10,10);
    ctx4.fillStyle= this.hexes[3];
    ctx4.fillText("X",201,209);
    ctx4.fillStyle= "#FFFFFF";
    if(this.colors[0]>127 || this.colors[1]>127 || this.colors[2]>127) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    ctx4.fillText("IDX: "+this.index,posx,posy+=10);
    if(this.parent!=null) {
      if(this.pidx<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+deadanimals[(-(this.pidx+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.pidx].children.length,posx, posy+=10);
      }
      if(consoleMouse && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.pidx;
            leftPressed=false;
          }
        }
      }
    }
    posy+=10;
    for(var i=0;i<this.children.length;i++) {
      if(posy>380) {
        posx+=100;
        posy=210;
      }
      if(this.children[i]<0) {
        ctx4.fillText(deadanimals[(-(this.children[i]+1))].name+"-"+deadanimals[(-(this.children[i]+1))].gen+"D"+deadanimals[(-(this.children[i]+1))].children.length,posx, posy+=10);
      } else {
        ctx4.fillText(animals[this.children[i]].name+"-"+animals[this.children[i]].gen+"A"+animals[this.children[i]].children.length,posx, posy+=10);
      }
      if(consoleMouse && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.children[i];
            leftPressed=false;
          }
        }
      }
    }


    if(consoleMouse && leftPressed) {
      if(mouseX>200 && mouseX<210 && mouseY>200 && mouseY<210) {
        display=0;
        leftPressed=false;
      }
    }
  } else if(display==4) {
    var posx=210;
    var posy=210;
    ctx4.beginPath();
    ctx4.fillStyle=this.hexes[0];
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= this.hexes[4];
    ctx4.fillRect(200,200,10,10);
    ctx4.fillStyle= this.hexes[3];
    ctx4.fillText("X",201,209);
    ctx4.fillStyle= "#FFFFFF";
    if(this.colors[0]>127 || this.colors[1]>127 || this.colors[2]>127) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    if(this.parent!=null) {
      if(this.pidx<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+deadanimals[(-(this.pidx+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.pidx].children.length,posx, posy+=10);
      }
      if(consoleMouse && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.pidx;
            leftPressed=false;
          }
        }
      }
    }
    posy+=10;
    ctx4.fillText("VELRESMUT: "+this.senmuts[0], posx, posy+=10);
    ctx4.fillText("ROTRESMUT: "+this.senmuts[1], posx, posy+=10);
    ctx4.fillText("MAXSZGENE: "+this.maxSizeGene, posx, posy+=10);
    ctx4.fillText("MINSZGENE: "+this.minSizeGene, posx, posy+=10);

    posy=210;
    posx+=110;
    ctx4.fillText("MOUDSSMUT: "+this.mouth.mutrs[0], posx, posy+=10);
    ctx4.fillText("MOUDRSMUT: "+this.mouth.mutrs[1], posx, posy+=10);
    posy+=10;
    for(var i=0; i<this.eyeNumber;i++) {
      if(posy>340) {
        posx+=110;
        posy=210;
      }
      ctx4.fillText("E"+(i+1)+"DSSMUT"+": "+this.eyes[i].mutrs[0], posx, posy+=10);
      ctx4.fillText("E"+(i+1)+"DRSMUT"+": "+this.eyes[i].mutrs[1], posx, posy+=10);
      posy+=10;
    }

    if(consoleMouse && leftPressed) {
      if(mouseX>200 && mouseX<210 && mouseY>200 && mouseY<210) {
        display=0;
        leftPressed=false;
      }
    }
  }
  //Leave display 2 separate from above else-ifs to ensure immediate console display switching between profiles
  if(display==2) {
    var posx=120;
    var posy=30;
    var spcx=60;
    var spcy=22;

    ctx4.fillStyle= "#FFFFFF";
    if(this.colors[0]>127 || this.colors[1]>127 || this.colors[2]>127) {
      ctx4.fillStyle= "#000000";
    }

    posx=10;
    posy=10;
    if(this.alive) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    if(this.parent!=null) {
      if(this.pidx<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+deadanimals[(-(this.pidx+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.pidx].children.length,posx, posy+=10);
      }
      if(consoleMouse && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.pidx;
            display=1;
            leftPressed=false;
          }
        }
      }
    }

    ctx4.fillText("NRG: "+round(100*this.energy)/100, posx, posy+=10);
    ctx4.fillText("B$: "+(round(this.brainCost*BRAINSIZECAP*BRAINLAYERSCAP)),posx,posy+=10);

    posx=75;
    posy=101;
    spcy=22;
    posy+=spcy;
                                              /////////////////
    if(this.outputs[3]<-0.33) {
      ctx4.fillText("EATR",posx,posy+=spcy);
    } else if(this.outputs[3]>=0.33) {
      ctx4.fillText("EATG",posx,posy+=spcy);
    } else {
      ctx4.fillText("EATB",posx,posy+=spcy);
    }
    if(this.outputs[2]<-0.33) {
      ctx4.fillText("CARN",posx,posy+=spcy);
    } else if(this.outputs[2]>=0.33) {
      ctx4.fillText("HERB",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }

    spcy=22;
    posx=550;
    posy=40-6;
    if(this.outputs[0]>0.2) {
      ctx4.fillText("VEL++", posx,posy+=spcy);
    } else if(this.outputs[0]<-0.2) {
      ctx4.fillText("VEL--", posx,posy+=spcy);
    } else {
      posy+=spcy;
    }
    if(this.outputs[1]>0.2) {
      ctx4.fillText("ROT++", posx,posy+=spcy);
    } else if(this.outputs[1]<-0.2) {
      ctx4.fillText("ROT--", posx,posy+=spcy);
    } else {
      posy+=spcy;
    }
    if(this.outputs[2]<-0.33) {
      ctx4.fillText("CARN", posx,posy+=spcy);
    } else if(this.outputs[2]>=0.33){
      ctx4.fillText("HERB", posx,posy+=spcy);
    } else {
      posy+=spcy;
    }
    if(this.outputs[3]<-0.33) {
      ctx4.fillText("EATR", posx,posy+=spcy);
    } else if(this.outputs[3]>=0.33){
      ctx4.fillText("EATG", posx,posy+=spcy);
    } else {
      ctx4.fillText("EATB", posx,posy+=spcy);
    }


    if(this.outputs[4]>=0.33) {
      ctx4.fillText("MITO",posx,posy+=spcy);
    }else if(this.outputs[4]>-0.33){
      ctx4.fillText("GROW",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }

    if(this.outputs[5]>0.2) {
      ctx4.fillText("ATK++",posx,posy+=spcy);
    } else if(this.outputs[5]<-0.2) {
      ctx4.fillText("ATK--",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }

    if(this.outputs[6]>0.2) {
      ctx4.fillText("MDIS++",posx,posy+=spcy);
    } else if(this.outputs[6]<-0.2) {
      ctx4.fillText("MDIS--",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }
    if(this.outputs[7]>0.2) {
      ctx4.fillText("MCW",posx,posy+=spcy);
    } else if(this.outputs[7]<-0.2) {
      ctx4.fillText("MCCW",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }

    for(var i=0, eC=EYECAP; i<eC; i++) {
      if(i<this.eyeNumber) {
        if(this.outputs[(i*2)+8]>0.2) {
          ctx4.fillText("E"+(i+1)+"CW",posx,posy+=spcy);
        } else if(this.outputs[(i*2)+8]<-0.2) {
          ctx4.fillText("E"+(i+1)+"CCW",posx,posy+=spcy);
        } else {
          posy+=spcy;
        }
        if(this.outputs[(i*2)+9]>0.2) {
          ctx4.fillText("E"+(i+1)+"DIS++",posx,posy+=spcy);
        } else if(this.outputs[(i*2)+9]<-0.2) {
          ctx4.fillText("E"+(i+1)+"DIS--",posx,posy+=spcy);
        } else {
          posy+=spcy;
        }
      } else {
        posy+=2*spcy;
      }
    }
    for(var i=0;i<MEMCAP;i++) {
      if(this.outputs[18+i]>0.2) {
        ctx4.fillText("MEM"+(i+1)+"++",posx,posy+=spcy);
      } else if(this.outputs[18+i]<-0.2) {
        ctx4.fillText("MEM"+(i+1)+"--",posx,posy+=spcy);
      } else {
        posy+=spcy;
      }
    }
    if(this.outputs[26]>0.2) {
      ctx4.fillText("MSEN++",posx,posy+=spcy);
    } else if(this.outputs[26]<-0.2) {
      ctx4.fillText("MSEN--",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }
    if(this.outputs[27]>0.2) {
      ctx4.fillText("MSEN2++",posx,posy+=spcy);
    } else if(this.outputs[27]<-0.2) {
      ctx4.fillText("MSEN2--",posx,posy+=spcy);
    } else {
      posy+=spcy;
    }
    for(var i=0, eC=EYECAP; i<eC; i++) {
      if(i<this.eyeNumber) {
        if(this.outputs[28+i]>0.2) {
          ctx4.fillText("ESEN++",posx,posy+=spcy);
        } else if(this.outputs[28+i]<-0.2) {
          ctx4.fillText("ESEN--",posx,posy+=spcy);
        } else {
          posy+=spcy;
        }
      }
    }

    posx=120;
    spcx=60;
    var neu=null;
    var neuNum=null;
    var neuLay=null;
    /*
      sC= stroke color.
      s1/s2= stroke primary/secondary. Given that outWeight vals are clamped at [-100, 100], total range = 200. Multiply by 255 to project onto range [0,255].
      ow 100 = If R, then (255, 191, 191). ow -100 = If R, then (0, 64, 64).
      That doesnt make sense, so reverse- (64, 0, 0).
      (-1, -1,-1) -> (-5/4, -1/2, -5/4)
    */
    for(var k=0, bL=BRAINLAYERSCAP;  k<bL; k++) {
      posy=30;
      for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
        posy+=spcy;

        if(consoleMouse && mouseX>posx-10 && mouseX<posx+10 && mouseY>posy-10 && mouseY<posy+10) {

          for(var i=0, bS2=BRAINSIZECAP; i<bS2; i++) {
            if(k<bL-1){
              var oW = this.brain[k][j].outWeight(i);
              if(oW> this.brain[k][j].maxOut) {
                this.brain[k][j].maxOut = oW;
              } else if(oW<this.brain[k][j].minOut) {
                this.brain[k][j].minOut = oW;
              }
              var Sc;
              if(oW>=0){
                sC =round(255*(50+(50*oW/this.brain[k][j].maxOut))/100);
              } else {
                sC =round(255*(50-(50*oW/this.brain[k][j].minOut))/100);
              }
              ctx4.beginPath();
              ctx4.strokeStyle=rgbToHex(sC,sC,sC);
              ctx4.moveTo(posx,posy);
              ctx4.lineTo(posx+spcx, posy-(j-i)*spcy);
              ctx4.stroke();
            }
          }
          if(k==BRAINLAYERSCAP-1) {
            for(var l=0;l<8;l++) {
              if((18+l)==j) {
                ctx4.moveTo(posx,posy);
                ctx4.lineTo(posx-(spcx*(bL-1)),((16+l)*spcy)+8);
                ctx4.stroke();
              }
            }
          }
        }

        ctx4.beginPath();
        ctx4.fillStyle="#000000";
        if(k==0) {
          ctx4.fillText(round(100*this.brain[k][j].is)/100, posx-10, posy+3);
        } else if (k==bL-1) {
          ctx4.fillText(round(100*this.brain[k][j].is)/100, posx-10, posy-2);
          ctx4.fillText(round(100*this.outputs[j])/100, posx-10, posy+8);
        } else if(consoleMouse && mouseX>posx-100 && mouseX<posx+100 && mouseY>posy-100 && mouseY<posy+100) {
          ctx4.fillText(round(100*this.brain[k][j].is)/100, posx-10, posy+3);
        }
        if(consoleMouse && mouseX>posx-10 && mouseX<posx+10 && mouseY>posy-10 && mouseY<posy+10) {
          if(leftPressed || rightPressed) {
            neu=this.brain[k][j];
            neuNum=j;
            neuLay=k;

          }
        }
      }
      posx+=spcx;
    }
    if(neu!=null) {
      if(leftPressed) {
        var posy2=30;
        ctx4.fillStyle="#FFFFFF";
        ctx4.fillRect(10,10,130,470);
        ctx4.fillStyle="#323232";
        ctx4.fillText("N:"+neuNum+", L:"+neuLay+" WEIGHTS",20,posy2);
        ctx4.fillText("$: "+round(neu.cost*10000)/10000,20,posy2+=10);
        ctx4.fillText("W1",20,posy2+=10);
        ctx4.fillText("B",80,posy2);
        for(var i=0, bS2=BRAINSIZECAP; i<bS2; i++) {
          ctx4.fillText(neu.weights[i], 20, posy2+=10);
          ctx4.fillText(neu.bias[i], 80, posy2);
        }
      } else {
        var posy2=30;
        ctx4.fillStyle="#FFFFFF";
        ctx4.fillRect(10,10,130,460);
        ctx4.fillStyle="#323232";
        ctx4.fillText("N:"+neuNum+", L:"+neuLay+" MUTS",20,posy2);
        ctx4.fillText("W1",20,posy2+=10);
        ctx4.fillText("B",80,posy2);
        for(var i=0, bS2=BRAINSIZECAP; i<bS2; i++) {
          ctx4.fillText(neu.wGenes[i], 20, posy2+=10);
          ctx4.fillText(neu.bGenes[i], 80, posy2);
        }
      }
    }

    if(consoleMouse && leftPressed && mouseX>0 && mouseX<10 && mouseY>0 && mouseY<10) {
      display=0;
      console.setup();
      leftPressed=false;
    }
  }
}
/*
Animal.prototype.regress2=function(pidx, idx, scale) { // cI= child index, pI= parent index (if parent is alive)
  var pI;
  var aI;
  var mux;
  if(pidx>=0){
    pI = animals[pidx];
  } else {
    pI = deadanimals[-(pidx+1)];
  }
  if(idx>=0){
    aI = animals[idx];
  } else {
    aI = deadanimals[-(idx+1)];
  }
  if(propagateMode>0 && pI.genePool>0){
    mux=pI.genePool; // descendants DO NOT include animals own children: rather, counts GRANDCHILDREN (how successful each of its children have been at reproducing)
  }else {
    mux=1;
  }
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        aI.brain[i][j].wGenes[k]+=((pI.brain[i][j].weights[k]+pI.brain[i][j].wGenes[k]/mux)-this.brain[i][j].weights[k])/scale; //scale is bigger than 1 if more children than parent had-> regress to 0 LESS
        aI.brain[i][j].bGenes[k]+=((pI.brain[i][j].bias[k]+pI.brain[i][j].bGenes[k]/mux)-this.brain[i][j].bias[k])/scale;

        aI.brain[i][j].wGenes[k]=round(10000*aI.brain[i][j].wGenes[k])/10000;
        aI.brain[i][j].bGenes[k]=round(10000*aI.brain[i][j].bGenes[k])/10000;
      }
    }
  }
  /*
  Suppose you have a parent weight w. Parent is successful, has a child who mutated and has a weight of w+1.
  However, child is unsuccessful. So tell parent to mutate opposite. Parent gene g0, was originally 0, and is now fluxed:
  g1 = w+g0-(w+1)
  g1 = w+0-(w+1)
  g1 = -1.
  So gene was swung opposite, next child will have gene with weight w-1 or w.

  Suppose parent has another child, with weight w-1. Again, child is unsuccessful. Tell parent to mutate opposite.
  Parent gene g1 is fluxed:
  g1 = w+(g1)-(w-1)
  g1 = (w-1)-(w-1)
  g1 = w-1-w+1
  g1 = 0.
  Gene was swung opposite again. Then weight value w is stable at 0.
  * /

  aI.mouth.mutrs[0]+=(((pI.mouth.dissen+pI.mouth.mutrs[0]/mux)-this.mouth.dissen)/scale);
  aI.mouth.mutrs[1]+=(((pI.mouth.dirsen+pI.mouth.mutrs[1]/mux)-this.mouth.dirsen)/scale);

  aI.mouth.mutrs[0]=round(10000*aI.mouth.mutrs[0])/10000;
  aI.mouth.mutrs[1]=round(10000*aI.mouth.mutrs[1])/10000;

  for(var i=0; i<EYECAP; i++) {
    aI.eyes[i].mutrs[0]+=(((pI.eyes[i].dissen+pI.eyes[i].mutrs[0]/mux)-this.eyes[i].dissen)/scale);
    aI.eyes[i].mutrs[1]+=(((pI.eyes[i].dirsen+pI.eyes[i].mutrs[1]/mux)-this.eyes[i].dirsen)/scale);

    aI.eyes[i].mutrs[0]=round(10000*aI.eyes[i].mutrs[0])/10000;
    aI.eyes[i].mutrs[1]=round(10000*aI.eyes[i].mutrs[1])/10000;
  }

  aI.senmuts[0]+=((pI.velres+pI.senmuts[0]/mux)-this.velres)/scale;
  aI.senmuts[1]+=((pI.rotres+pI.senmuts[1]/mux)-this.rotres)/scale;

  aI.senmuts[0]=round(100*aI.senmuts[0])/100;
  aI.senmuts[1]=round(100*aI.senmuts[1])/100;

  aI.maxSizeGene+=((pI.maxSize+pI.maxSizeGene/mux)-this.maxSize)/scale;
  aI.minSizeGene+=((pI.minSize+pI.minSizeGene/mux)-this.minSize)/scale;

  aI.maxSizeGene=round(10*aI.maxSizeGene)/10;
  aI.minSizeGene=round(10*aI.minSizeGene)/10;
}
*/

Animal.prototype.regress=function(pidx, idx, scale) { // cI= child index, pI= parent index (if parent is alive)
  var pI;
  var aI;
  if(pidx>=0){
    pI = animals[pidx];
  } else {
    pI = deadanimals[-(pidx+1)];
  }
  if(idx>=0){
    aI = animals[idx];
  } else {
    aI = deadanimals[-(idx+1)];
  }
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        aI.brain[i][j].wGenes[k]+=((pI.brain[i][j].weights[k]-this.brain[i][j].weights[k])/scale); //scale is bigger than 1 if more children than parent had-> regress to 0 LESS
        aI.brain[i][j].bGenes[k]+=((pI.brain[i][j].bias[k]-this.brain[i][j].bias[k])/scale);

        aI.brain[i][j].wGenes[k]=round(10000*aI.brain[i][j].wGenes[k])/10000;
        aI.brain[i][j].bGenes[k]=round(10000*aI.brain[i][j].bGenes[k])/10000;
      }
    }
  }

  aI.mouth.mutrs[0]+=((pI.mouth.dissen-this.mouth.dissen)/scale);
  aI.mouth.mutrs[1]+=((pI.mouth.dirsen-this.mouth.dirsen)/scale);

  aI.mouth.mutrs[0]=(round(10000*aI.mouth.mutrs[0])/10000);
  aI.mouth.mutrs[1]=(round(10000*aI.mouth.mutrs[1])/10000);

  for(var i=0; i<EYECAP; i++) {
    aI.eyes[i].mutrs[0]+=((pI.eyes[i].dissen-this.eyes[i].dissen)/scale);
    aI.eyes[i].mutrs[1]+=((pI.eyes[i].dirsen-this.eyes[i].dirsen)/scale);

    aI.eyes[i].mutrs[0]=(round(10000*aI.eyes[i].mutrs[0])/10000);
    aI.eyes[i].mutrs[1]=(round(10000*aI.eyes[i].mutrs[1])/10000);
  }

  aI.senmuts[0]+=((pI.velres-this.velres)/scale);
  aI.senmuts[1]+=((pI.rotres-this.rotres)/scale);

  aI.senmuts[0]=(round(100*aI.senmuts[0])/100);
  aI.senmuts[1]=(round(100*aI.senmuts[1])/100);

  aI.maxSizeGene+=((pI.maxSize-this.maxSize)/scale);
  aI.minSizeGene+=((pI.minSize-this.minSize)/scale);

  aI.maxSizeGene=(round(10*aI.maxSizeGene)/10);
  aI.minSizeGene=(round(10*aI.minSizeGene)/10);
}

Animal.prototype.propagate=function(index) { // cI= child index, pI= parent index (if parent is alive)

  /*
  Suppose you have parent weight w, initial parent gene g0=0. Parent has child who mutates w+1, and is successful. Parent gene g0 is fluxed:
  g1=g0+((w+1)-w)
  g1=0+1.
  g1=1.
  Also, genePool++.
  Suppose parent has new child, accumulates w+1 (random bm 0). Child successful. g is fluxed again:
  g2=g1+((w+1)-w)
  g2=1+1
  g2=2.
  Also, genePool++.



  A(C0/W0/G0)
  A(C1/W0/G0), B(C0/W1/G0)
  A(C1/W0/G1), B(C1/W1/G0), C(C0/W1/G0)
  A




  Children creatures do well when g stays at g+1... so keep it there.

  0 1 2

  (5+5+5+0+5)/4
  */

  var pI;
  if(index>=0){
    pI=animals[index];
  } else {
    pI=deadanimals[-(index+1)];
  }
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        pI.brain[i][j].wGenes[k]+=(this.brain[i][j].weights[k]-pI.brain[i][j].weights[k]);
        pI.brain[i][j].bGenes[k]+=(this.brain[i][j].bias[k]-pI.brain[i][j].bias[k]);
        pI.brain[i][j].wGenes[k]=(round(10000*pI.brain[i][j].wGenes[k])/10000);
        pI.brain[i][j].bGenes[k]=(round(10000*pI.brain[i][j].bGenes[k])/10000);
      }
    }
  }

  pI.mouth.mutrs[0]+=(this.mouth.dissen-pI.mouth.dissen);
  pI.mouth.mutrs[1]+=(this.mouth.dirsen-pI.mouth.dirsen);
  pI.mouth.mutrs[0]=(round(10000*pI.mouth.mutrs[0])/10000);
  pI.mouth.mutrs[1]=(round(10000*pI.mouth.mutrs[1])/10000);

  for(var i=0; i<EYECAP; i++) {
    if(this.eyes[i]!= null && pI.eyes[i]!=null) {
      pI.eyes[i].mutrs[0]+=(this.eyes[i].dissen-pI.eyes[i].dissen);
      pI.eyes[i].mutrs[1]+=(this.eyes[i].dirsen-pI.eyes[i].dirsen);
      pI.eyes[i].mutrs[0]=(round(10000*pI.eyes[i].mutrs[0])/10000);
      pI.eyes[i].mutrs[1]=(round(10000*pI.eyes[i].mutrs[1])/10000);
    }
  }

  pI.senmuts[0]+=(this.velres-pI.velres);
  pI.senmuts[1]+=(this.rotres-pI.rotres);
  pI.senmuts[0]=(round(100*pI.senmuts[0])/100);
  pI.senmuts[1]=(round(100*pI.senmuts[1])/100);

  pI.maxSizeGene+=(this.maxSize-pI.maxSize);
  pI.minSizeGene+=(this.minSize-pI.minSize);
  pI.maxSizeGene=round(10*pI.maxSizeGene)/10;
  pI.minSizeGene=round(10*pI.minSizeGene)/10;
}
Animal.prototype.resetGenes= function() {
  this.senmuts[0]=0;
  this.senmuts[1]=0;
  this.maxSizeGene=0;
  this.minSizeGene=0;
  this.mouth.mutrs[0]=0;
  this.mouth.mutrs[1]=0;
  for(var j=0;j<EYECAP;j++){
    this.eyes[j].mutrs[0]=0;
    this.eyes[j].mutrs[1]=0;
  }
  for(var j=0;j<BRAINLAYERSCAP;j++){
    for(var k=0;k<BRAINSIZECAP;k++){
      for(var l=0;l<BRAINSIZECAP;l++){
        this.brain[j][k].wGenes[l]=0;
        this.brain[j][k].bGenes[l]=0;
      }
    }
  }
  var a=0;
  for(var j=0;j<this.children.length;j++){
    if(this.children[j]>=0) {
      a++;
    }
  }
  this.genePool=this.liveDesc-a;
}
