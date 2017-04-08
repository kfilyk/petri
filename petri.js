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
var popPerGen=[];
var FERPerGen=[]; //FER: Food Energy Ratio
var childPerGen=[];

var graphHolder=new Array(5);
graphHolder[0]=0;
graphHolder[1]=1;
graphHolder[2]=2;
graphHolder[3]=3;
graphHolder[4]=6;

var regressMode=0;
/*
1.15:
5/4/17: IS REGRESS BEING DONE WRONG? Currently, I am finding difference between ANY ANCESTOR and the unsuccessful descendant,
  then subtracting that difference from the gene pool. Instead, try finding difference between unsuccessful descendant and the
  PARENT of that descendant, then subtracting THAT instead... Meanwhile, propagate function works rediculously TOO well...
*/
var propagateMode=0;

/*
FASTEST COMBOS:
2. RM=3/FM=1
1. RM=4/FM=2
*/

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

/*
0.23
11/2/17: WTF is the best way to balance score?? rn its foodEnergy/age but it could still change
0.29:
29/2/17: Best score = how long animal has been alive for... Possibly implement score which stacks when parent dies (this.score = par.score+this.score)? Growth rate could get out of hand...
1.08:
23/3/17:
  - Use 3 or more score types: lifespan, energy gained, number of children.

*/
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
					if((abs(animals[ai].x-mouseX)<20) && abs(animals[ai].y-mouseY)<20) {
						if(highlighted!=null) {
							if(display==2) {
								display=1;
							}
						}
						highlighted=ai;
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
		ctx4.clearRect(0,0,CONSOLEX,CONSOLEY);
		ctx3.fillStyle=rgbToHex(50,50,50);
		ctx3.fillRect(0,0,CONSOLEX,CONSOLEY);
		ctx3.fillStyle="#FFFFFF";
		ctx3.strokeStyle="#FFFFFF";
		var posy=15;
		ctx3.fillText("PETRI 1.16", 10, posy);
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
    } else if(regressMode<6){
      ctx3.fillText("REGRESS <"+regressMode+" CHILDREN",posx2+5,posy+=20);
    } else {
      ctx3.fillText("REGRESS < CNO",posx2+5,posy+=20);
    }
    if(propagateMode==0) {
      ctx3.fillText("PROPAGATE OFF",posx2+5,posy+=20);
    } else if(propagateMode==1){
      ctx3.fillText("PROPAGATE ON",posx2+5,posy+=20);
    }

    posx2=280;
    posy=20;
	},
	update : function() {
		if(display!=1 && display!=2) {
			ctx4.clearRect(0, 0, 150, 400);
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
      ctx4.clearRect(0, 380, CONSOLEX, CONSOLEY-380); //Clear rect a little above, a little below
      var buttonX=10;
      var lineX= CONSOLEX/(~~(time/100));
      posy=600;
      ctx4.fillStyle="#FFFFFF";
      ctx4.strokeStyle="#FFFFFF";
      for(var i=0;i<5; i++){

        ctx4.fillRect(buttonX,490,10,10);
        if(leftPressed){
          if(consoleMouse && mouseX>buttonX && mouseX<buttonX+10 && mouseY>490 && mouseY<500) {
            if(graphHolder[i]<6){
              graphHolder[i]++;
            } else {
              graphHolder[i]=-1;
            }
            leftPressed=false;
          }
        } else if(rightPressed){
          if(consoleMouse && mouseX>buttonX && mouseX<buttonX+10 && mouseY>490 && mouseY<500) {
            if(graphHolder[i]>-1){
              graphHolder[i]--;
            } else {
              graphHolder[i]=6;
            }
            rightPressed=false;
          }
        }
        buttonX+=20;

        if(graphHolder[i]==0){
          graph(lineX, posy, aveFERHist, "AVEFER: ", 1);
        } else if(graphHolder[i]==1){
          graph(lineX, posy, aveChildrenHist, "AVECHILDREN: ", 1);
        } else if(graphHolder[i]==2){
          graph(lineX, posy, aveLifespanHist, "AVELIFESPAN: ", maxAveLifespan);
        } else if(graphHolder[i]==3){
          graph(lineX, posy, avePosNRGHist, "AVEPOSNRG: ", maxAvePosNRG);
        } else if(graphHolder[i]==4){
          if(popPerGen.length>0){
            var genX;
            if(popPerGen.length>1){
              genX = CONSOLEX/(popPerGen.length-1);
            } else {
              genX=0;
            }
            genGraph(genX, posy, FERPerGen, "FERPERGEN: ", 1); //Food energy ratio per gen
          }
        } else if(graphHolder[i]==5){
          if(popPerGen.length>0){
            var genX;
            if(popPerGen.length>1){
              genX = CONSOLEX/(popPerGen.length-1);
            } else {
              genX=0;
            }
            genGraph(genX, posy, childPerGen, "CPG: ", maxChildPerGen); //children per gen
          }
        } else if(graphHolder[i]==6){
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
      buttonX=10;
      ctx4.fillStyle="#323232";
      for(var i=0;i<5; i++){
        ctx4.fillText(graphHolder[i],buttonX+1, 499);
        buttonX+=20;
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
            if(regressMode==6) {
              regressMode=0;
            } else {
              regressMode++;
            }
						console.setup();
						leftPressed=false;
					} else if((mouseY>150)&&(mouseY<160)) { // FORTHPROP MODE
						if(propagateMode==0) {
							propagateMode=1;
						} else if(propagateMode==1){
              propagateMode=0;
            }
						console.setup();
						leftPressed=false;
					}
				}
			}
		}
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
/*
0.29:
29/2/17: Implementing gradient descent via a "back-propagation" is possible- not going to be scientifically
accurate definition, just an experimental attempt at creating a recurrent mutation tweaker that follows a similar idea.
Have to be careful that I do not influence evolution by accidentally creating bias for creatures with high longevity...
TBC in 0.30:
1. For every mutable trait, establish a "learning rate" LR that is small in proportion to the trait.
	Example: For minSize, a good learning rate would be +-0.1, such that each mutant minSize value increments by that amount.
2. Initial (random) creatures will be created with an LR array of size n=number of mutable traits.
	Initial LR values will be set to a +- "unit value" for that trait (+-0.1 for minSize, +-1 for color, etc...).
	Children are born with identical LRs to the parent (for now).
3. Every child will contribute to the parents mutation rates, such that the death/success of each child pushes/pulls
	on the LRs of the parent. When a child dies, the LR of the parent changes incrementally in the direction
	opposite to the trait difference between the parent and child. Example: Suppose a child C has a minSize of 7.5 (~8) and
	the parent P has a minSize of 7.2 (~7). Suppose the LR of the parent is 0.3. If C dies, C causes the LR of P to
	decrease by 0.1. Then the failure of C has influenced all new children of P, such that the minSize grows less quickly
	for all future children of P (will not approach 8). The LR of P for minSize is now 0.2 (decreases by 0.1, the unit value).
	Then children born to P will have a minSize of 7.4 (~7) and a LR of 0.2 (same as the parent).
4. For now, only children deaths influence parent LRs. Parents have no influence on children LRs upon death. Success rate/
	highscore has no influence on LR either. Parent LRs only change in response to child deaths when the parent is ALIVE.
	"Success" then becomes implicative- the creatures who reproduce will be the ones who succeed, because their
	lineages will be the only ones around (Unless they all randomly start off craving the sweet cradle of death).
	This is what I am HOPING FOR- i've seen this somewhat in previous versions, but no way of telling what will happen next .
	Hypothetically, success should steer in the direction of longevity, and backprop will steer in the direction of
	self-perfecting form- if a petri is seldom to reproduce, then it has no offspring capable of directing the
	survivability of further offspring -> lineage dies. Inevitably, parent dies, due to changing environment/
	success of other lineages/being eaten. Remaining population consists of petris/lineages who adapted...
*/

function randn_bm() { //random box-muller: generate normal distribution
    var u = 1 - Math.random(); // Subtraction to flip [0, 1) to (0, 1].
    var v = 1 - Math.random();
    return Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
}

function randn_one() {
    return round((Math.random()*2)-1);
}

function Tile(x,y,num) {
  /*
  0.20:
  5/2/17: Tried tiles with regen rate of 0.2 instead of 0.1 = animals with less eyes survive/propagate more easily initially...?
  5/2/17: No, i guess not..
  6/2/17: Tile Col Range:
  	R= [-30,150]
  	G= [-30,200]
  	B= [-30,100]
  6/2/17: No more math.random() call every time "regenerate" is called. Replaced with standard regenRate for every tile.

  */
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
  /*
  0.20:
  5/2/17: Minimized the range of the bias, weights1, and weights2: allows for more flexibility in neuron decision mutation, strengthens over generations.
  	Bias vals can go as low as "round((Math.random()*10)-5)/100" without problems; weights vals "round((Math.random()*40)-20)/100".
  0.22:
  10/2/17: Discovered 32 bit float vals= +3 FPS. however my recent choice to draw all creature mouths+eyes oncanvas = -3 FPS. Oh well.
  0.23:
  11/2/17: Increased weights, decreased bias -> greater variation/range in output signals -> greater adaptability/flexible reasoning potential? But still keep it low as possible.
  11/2/17: No, thats so wrong. Biases are as flexible as weights.
  19/2/17: OutSignal has been modded to be 2* softsign, such that when x==1, y==1. Just trying it.
  19/2/17: That was interesting... but terrible. Way too oversensitive. Back to softsign... for now.
  19/2/17: JK... trying 2*(x^3)/(x^2)....
  19/2/17: ... That might be way better... too early to tell. Previous softsign did not remotely allow animals to access highest settings of output functions... new activation function changes that at least.
  0.25:
  20/2/17: Another possibility:((2x)^3)/(1+(3x)^2) = 8(x^3)/(1+9(x^2))

  	this.outSignal=function(ni) {
  		var x=(this.is+this.bias[ni]);
  		return x/(100+(x>=0 ? x:-x));
  	}
  	this.outSignal=function(ni) {
  		var x=((this.is+this.bias[ni])/100);
  		return 2*((1/(1+Math.exp(-x)))-0.5);
  	}
  	this.outSignal=function(ni) {
  		var x=((this.is+this.bias[ni])/100);
  		return (8*x*x*x)/(1+(9*x*x));
  	}
  7/3/17: In order to speed up mutations (while also not causing chaos), create variable neumut, with range [0.0 -> 1.0] (increments in tenths).
    this variable determines how much mutrate values change per generation (+-neumut), and is directed via backprop
  17/3/17: Neumut sucks. Need to use more accurate method to predict descent.
  17/3/17: No more I can do on Javascript; too slow- need to proceed from using linear values to multiplicative or softsign function, if possible.
    Time to humble myself and write in c++. Also, If initial input values are positive/negative/extreme,
    shouldnt we simply manipulate the init inputs at each layer, rather than generating new numbers at each layer? Should switch to a
    multiclass function instead of random int values.
  1.07:
  22/3/17: Possibly move range into float values??
  1.08:
  22/3/17: Switching to multiplication. Keep biases, w1, w2. Use negative values?
  1.12:
  31/3/17: Switched to multiplication. Lots of changes. Using abs function generally to compute values. Using box-muller distribution of
    initial weights and bias values (normal dist. centered at 0).
    Going to implement alpha values for all neurons such that the shape of the abs function is more flexible.
    All in all, simulation is more viable than ever. Initial pop has a high survivability rate, I've managed to cut back on numerous
    variables in an effort to simply properties, graphs have been put into use (super helpful), and ive learned about and switched to
    using prototype functions for all objects (+3FPS, WAY better memory usage). Hopefully only one or two final changes to be made.

  4/4/17: Changed my mind about using alpha value. Unneccesary added complexity. Since softsign approximates sigmoid, just use a
    corresponding rational of weights/bias == plenty of flexibility.
  */
  this.weights=new Array(2);
	this.weights[0]=new Float64Array(BRAINSIZECAP);
	this.weights[1]=new Float64Array(BRAINSIZECAP);
	this.bias=new Float64Array(BRAINSIZECAP);
	this.w1Genes=new Array(BRAINSIZECAP);
	this.w2Genes=new Array(BRAINSIZECAP);
	this.bGenes=new Array(BRAINSIZECAP);
  this.maxOut=0.5; // IN RELATION TO STARTING VALUES
  this.minOut=-0.5;

	this.is=0;
	this.cost=0;
	for(var i=0;i<BRAINSIZECAP;i++) {
		this.bias[i]=0;
		var c=round(5000*randn_bm())/10000; //Half range of norm. dist.
		this.weights[0][i]=c;
    this.weights[1][i]=c;
		this.cost+=abs(c);
		this.cost+=abs(c);

    //Set mutation rates to 0;
		this.w1Genes[i]=0;
		this.w2Genes[i]=0;
		this.bGenes[i]=0;
	}
}
Neuron.prototype.outWeight=function(idx) { // if this.is>=0 return this.is*weights[0]
  return this.bias[idx]+this.softSign(this.is)*this.weights[(this.is>=0 ? 0:1)][idx];
}
Neuron.prototype.softSign=function(is) {
  return is/(1+(is>=0 ? is:-is));
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
  /*
  0.20:
  5/2/17: Tile Col Range:
  	R= [-30,150]
  	G= [-30,200]
  	B= [-30,100]
  	Such that for R, -60 centers on average, range between [-30, 150] (180 total)
  */
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
  /*
  0.20:
  5/2/17: Color Types: 0=red, 1=green, 2=blue
  28/2/17: Score based on success of lineage
  */
	this.index=index;
	this.alive=true;
	this.x=x;
	this.y=y;
	this.tile=null;
	this.minSize=5;
	this.maxSize=2*this.minSize;
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
          this.brain[i][j].weights[0][k]=1;
          this.brain[i][j].weights[1][k]=1;
        }
        this.brainCost-=this.brain[i][j].cost;
        this.brain[i][j].cost=2*BRAINSIZECAP;
        this.brainCost+=this.brain[i][j].cost;
      }
		}
	}
  this.weightDiff=0;
	this.brainCost/=(BRAINSIZECAP*BRAINLAYERSCAP*3);

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

	ctx2.strokeStyle=this.hexes[2];
	ctx2.fillStyle=this.hexes[4];
	for(var i=0, eN=this.eyeNumber;i<eN;i++) {
    ctx2.beginPath();
    ctx2.arc(this.eyes[i].eX,this.eyes[i].eY, round(this.size/10), 0, TWOPI);
		ctx2.stroke();
		ctx2.fill();
	}


	if(terrainMouse && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50 && highlighted!=this.index) {
		ctx2.fillStyle= "#FFFFFF";
		ctx2.fillText(this.name+"-"+this.gen+(this.alive ? "A":"D")+this.children.length, this.x+(2*this.size), this.y-(2*this.size));
	}
}
Animal.prototype.think=function() {
  /*
  0.29:
  28/2/17: Clamped values from outputs 3 & 2 (eating col/type, respectively)
  29/2/17: Idea: Allow mouth(s), eyes to detect similarity in names of other animals:
  	(AAAA <-> AAAA) = 1
  	(AAAA <-> AAAB) = 0.8
  	(AAAA <-> AABB) = 0.4
  	(AAAA <-> ABBB) = -0.2
  	(AAAA <-> BBBB) = -1
  	(AAAA <-> BBBA) = -0.8
  	(AAAA <-> BBAA) = -0.4
  	(AAAA <-> BAAA) = 0.2
  	...
  	Letters in a name have influence of 0.4, 0.3, 0.2, 0.1 respectively.
  	It will take eyeNumber+mouthNumber (currently 6) neurons to implement... maybe wait a while...

    for (var i = 0; i < someObject.anArray.length ; i++) {
        if (someObject.anArray[i].point.x > someObject.anArray.point.y) {
           someFunction( someObject.anArray[i].point );
        }
    }

    var pointArray = someObject.anArray, thisPoint=null;
    for (var i = 0; i < pointArray.length ; i++) {
        thisPoint = anArray[i];
        if ( thisPoint.x > thisPoint.y ) {
           someFunction( thisPoint) ;
        }
    }

  */
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
  for(var i=0, temp=0, bS=BRAINSIZECAP; i<bS; i++) {
    for(var j=0; j<inp; j++) {
      temp+=this.brain[0][j].outWeight(i);
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
    this.outputs[i]=this.brain[bL][i].outWeight(i);
  }
}
Animal.prototype.move=function() {
  /*
  0.28
  22/02/17: Created mutable "sens" values: sensitivity values for used for neural responsiveness to input stimulus
  27/02/17: Need recoil vals for vel + rot?
  */


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

  this.x+=round(this.vel*(Math.cos(this.dir*DEGTORAD))); //ROUNDED INTEGER
  this.y+=round(this.vel*(Math.sin(this.dir*DEGTORAD))); //ROUNDED INTEGER
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
  /*
  0.20:
  7/2/17: Difficulty to obtain food decreased; animals dont lose huge energy if eating wrong color. Otherwise no diversity/mutation/happiness
  10/2/17: Future Goals: 1. Make them hate each other 2. Make them eat each other
  20/2/17: No food if not carnivore? Probs makes sense. No free rides. However, try to help animals with carnivorous
  habits- chasing, etc- dont make it brutal for carnivores to survive- they will be the smartest creatures.
  */
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
        //this.genePool++;
        this.mutate(mutant);
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
            animals[ancestor].genePool++;
            ancestor=animals[ancestor].pidx;
          } else {
            deadanimals[-(ancestor+1)].descendants++;
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
          if(ancestor!=null) {
            if(ancestor>=0) {
              this.propagate(ancestor);
              ancestor=animals[ancestor].pidx;
            } else {
              this.propagate(ancestor);
              ancestor=deadanimals[-(ancestor+1)].pidx;
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
  /*
  0.24
  11/2/17: Okay, so if you keep yourself alive a long time, thats awesome. You get points for a long lifespan.
  You ALSO gain points if you eat a lot of food. Makes sense. use echange/age??
  0.25
  13/2/17: Nope. Tried using age score, incrementing every frame, added +1 if foodEnergy>0 per frame. Pretty good,
  	but after the cycle bloom success of intelligent eating habits loses out to straight herbivore (too much food).
  	Going to try to counter balance this with -1 if foodEnergy<0.
  13/2/17: RESOUNDING SUCCESS! Score inc. per frame +-1 if foodEnergy<>0. Generates *intelligent* population
  	by gen ~25.
  13/2/17: Cell damage rate is a ratio of (foodEnergyloss)/(minSize energy). In 0.26, test implementation
  	of foodenergy/(size energy)- better imitation of nature, where large creatures possess incrementally
  	more superior DNA repair mechanisms/longer lifespans. Reducing cell damage for larger size also takes
  	away from survival stress of large creatures in simulation, and nudges in that direction.
  16/3/17: Scrap all that. Now using backpropogation to control mutation rates/gradient descent of attributes.
  21/3/17: If a child does not attain a number of children greater or equal to the parents,
    where child.score<=child.cno (cno==index of child in parents' child array), then backpropogation affects parent.
  */
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
		this.clone(dead);

		if(this.pidx!=null) { //animal needs to tell parent/children its dead... needs to know if parent is alive. If parent dead, pidx will be negative (-(pidx+1)).
			if(this.pidx<0) { //if parent is dead, no worries
				deadanimals[-(this.pidx+1)].children[this.cno]= -(dead.index+1);
			} else {
        animals[this.pidx].children[this.cno]=-(dead.index+1);
      }

      if(regressMode>0){
        if(this.children.length<regressMode){
          var ancestor = this.pidx;
          while(ancestor!=null){
            if(ancestor>=0){
              this.softRegress(this.pidx, ancestor, 1);
              if(ancestor==this.pidx){ // If ancestor wasnt parent, concentrate the mutation direction by reducing the gene pool...
                animals[ancestor].genePool++;
              }
              ancestor = animals[ancestor].pidx;
            } else {
              this.softRegress(this.pidx, ancestor, 1);
              if(ancestor==this.pidx){
                deadanimals[-(ancestor+1)].genePool++;
              }
              ancestor = deadanimals[-(ancestor+1)].pidx;
            }
          }
        }
      } else if(regressMode==6){  // CNO
        if(this.cno!=null){
          if(this.children.length<(this.cno+1)){
            var ancestor = this.pidx;
            while(ancestor!=null){
              if(ancestor>=0){
                this.softRegress(this.pidx, ancestor, 1);
                if(ancestor==this.pidx){
                  animals[ancestor].genePool++;
                }
                ancestor = animals[ancestor].pidx;
              } else {
                this.softRegress(this.pidx, ancestor, 1);
                if(ancestor==this.pidx){
                  deadanimals[-(ancestor+1)].genePool++;
                }
                ancestor = deadanimals[-(ancestor+1)].pidx;
              }
            }
          }
        }
      }
		}
    globalNetNRG+=this.netNRG;
    netLifespan+=this.age;
    if(this.gen>=popPerGen.length){
      popPerGen.push(0);
      FERPerGen.push(0);
      childPerGen.push(0);
    }
    popPerGen[this.gen]++;
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
  if(propagateMode==1 && this.genePool>0){
    mux=this.genePool; // descendants DO NOT include animals own children: rather, counts GRANDCHILDREN (how successful each of its children have been at reproducing)
  }else {
    mux=1;
  }

  a.velres=this.velres;
  a.rotres=this.rotres;

  a.senmuts[0]=this.senmuts[0]/mux; //set child and parent mutation rates identical...
  a.senmuts[1]=this.senmuts[1]/mux;
  a.senmuts[0]=round(100*a.senmuts[0])/100;
  a.senmuts[1]=round(100*a.senmuts[1])/100;

  a.velres+=((this.senmuts[0]/mux)+(randn_bm()/100)); // child genes displaced incrementally... PARENTS DONT CHANGE
  a.rotres+=((this.senmuts[1]/mux)+(randn_bm()/100));
  a.velres=round(100*a.velres)/100;
  a.rotres=round(100*a.rotres)/100;

  a.maxSizeGene=this.maxSizeGene/mux;
  a.minSizeGene=this.minSizeGene/mux;
  a.maxSizeGene=round(10*a.maxSizeGene)/10;
  a.minSizeGene=round(10*a.minSizeGene)/10;

  a.maxSize=this.maxSize;
  a.minSize=this.minSize;
  a.maxSize+=round((this.maxSizeGene/mux)+randn_bm());
  if(a.maxSize>SIZECAP) {
    a.maxSize=SIZECAP;
  } else if(a.maxSize<2*a.minSize) {
    a.maxSize=2*a.minSize;
  }

  a.minSize+=round((this.minSizeGene/mux)+randn_bm());
  if(a.minSize>=round(a.maxSize/2)) {
    a.minSize=round((a.maxSize-1)/2);
  }else if(a.minSize<5) {
    a.minSize=5;
  }
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

  a.mouth.mutrs[0]=this.mouth.mutrs[0]/mux;
  a.mouth.mutrs[1]=this.mouth.mutrs[1]/mux;
  a.mouth.mutrs[0]=round(10000*a.mouth.mutrs[0])/10000;
  a.mouth.mutrs[1]=round(10000*a.mouth.mutrs[1])/10000;

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
        a.brain[i][j].weights[0][k]=this.brain[i][j].weights[0][k];
        a.brain[i][j].weights[1][k]=this.brain[i][j].weights[1][k];
        a.brain[i][j].bias[k]=this.brain[i][j].bias[k];

        a.brain[i][j].w1Genes[k]=this.brain[i][j].w1Genes[k]/mux;
        a.brain[i][j].w2Genes[k]=this.brain[i][j].w2Genes[k]/mux;
        a.brain[i][j].bGenes[k]=this.brain[i][j].bGenes[k]/mux;

        a.brain[i][j].w1Genes[k]=round(10000*a.brain[i][j].w1Genes[k])/10000;
        a.brain[i][j].w2Genes[k]=round(10000*a.brain[i][j].w2Genes[k])/10000;
        a.brain[i][j].bGenes[k]=round(10000*a.brain[i][j].bGenes[k])/10000;

        a.brain[i][j].weights[0][k]+=((this.brain[i][j].w1Genes[k]/mux)+(randn_bm()/1000));
        a.brain[i][j].weights[1][k]+=((this.brain[i][j].w2Genes[k]/mux)+(randn_bm()/1000));
        a.brain[i][j].bias[k]+=((this.brain[i][j].bGenes[k]/mux)+(randn_bm()/1000));

        a.brain[i][j].weights[0][k]=round(10000*a.brain[i][j].weights[0][k])/10000;
        a.brain[i][j].weights[1][k]=round(10000*a.brain[i][j].weights[1][k])/10000;
        a.brain[i][j].bias[k]=round(10000*a.brain[i][j].bias[k])/10000;
        a.weightDiff+= abs(a.brain[i][j].weights[0][k]-a.brain[i][j].weights[1][k]);
        a.brain[i][j].cost+=(abs(a.brain[i][j].weights[0][k])+abs(a.brain[i][j].weights[1][k])+abs(a.brain[i][j].bias[k]));
      }
      a.brainCost+=a.brain[i][j].cost;
    }
  }

  a.eyeNumber=this.eyeNumber;
  for(var i=0;i<BRAINSIZECAP;i++) {
    a.outputs[i]=this.outputs[i];
  }
  a.brainCost/=(BRAINSIZECAP*BRAINLAYERSCAP*3);//3 attributes

  for(var i=0, eC=EYECAP; i<eC; i++) {
    if(i<a.eyeNumber && this.eyes[i]!=null) {
      a.eyes[i]=new Eye(a.dir,a.x,a.y);
      a.eyes[i].dir=this.eyes[i].dir;
      a.eyes[i].stray=this.eyes[i].stray;
      a.eyes[i].dissen=this.eyes[i].dissen;
      a.eyes[i].dirsen=this.eyes[i].dirsen;
      a.eyes[i].col=this.eyes[i].col;
      a.eyes[i].sense=this.eyes[i].sense;

      a.eyes[i].mutrs[0]=this.eyes[i].mutrs[0]/mux;
      a.eyes[i].mutrs[1]=this.eyes[i].mutrs[1]/mux;
      a.eyes[i].mutrs[0]=round(10000*a.eyes[i].mutrs[0])/10000;
      a.eyes[i].mutrs[1]=round(10000*a.eyes[i].mutrs[1])/10000;

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
Animal.prototype.clone=function(a) {
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
  a.genePool=this.genePool;
  a.dmgCaused=this.dmgCaused;
  a.dmgReceived=this.dmgReceived;
  a.health=this.health;
  a.deterioration=this.deterioration;
  a.maxFNRG=this.maxFNRG;
  a.minFNRG=this.minFNRG;
  a.netFNRG=this.netFNRG;
  a.posFNRG=this.posFNRG;

  a.foodEnergy=this.foodEnergy;
  a.maxECH=this.maxECH;
  a.minECH=this.minECH;
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
        a.brain[i][j].weights[0][k]=this.brain[i][j].weights[0][k];
        a.brain[i][j].weights[1][k]=this.brain[i][j].weights[1][k];
        a.brain[i][j].bias[k]=this.brain[i][j].bias[k];
        a.brain[i][j].w1Genes[k]=this.brain[i][j].w1Genes[k];
        a.brain[i][j].w2Genes[k]=this.brain[i][j].w2Genes[k];
        a.brain[i][j].bGenes[k]=this.brain[i][j].bGenes[k];
        a.brain[i][j].maxOut=this.brain[i][j].maxOut;
        a.brain[i][j].minOut=this.brain[i][j].minOut;
      }
    }
  }
  a.weightDiff=this.weightDiff;
  a.brainCost=this.brainCost;
  for(var i=0;i<BRAINSIZECAP;i++) {
    a.outputs[i]=this.outputs[i];
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

  if(display==0) {
    var posx=210;
    var posy=210;
    ctx4.beginPath();
    ctx4.fillStyle=this.hexes[0];
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= this.hexes[4];
    ctx4.fillRect(200,200,10,10);
    ctx4.fillRect(220,200,10,10);
    ctx4.fillRect(240,200,10,10);
    ctx4.fillRect(260,200,10,10);
    ctx4.fillStyle= this.hexes[3];
    ctx4.fillText("X",201,209);
    ctx4.fillText("B",221,209);
    ctx4.fillText("F",241,209);
    ctx4.fillText("M",261,209);
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
    ctx4.fillText("GENO: "+this.genePool+"/"+this.descendants,posx,posy+=10);

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
    ctx4.fillText("ATK: "+(round(100*this.attack)/100),posx,posy+=10);
    ctx4.fillText(">>DMG: "+round(this.dmgReceived*100)/100,posx,posy+=10);
    ctx4.fillText("DMG>>: "+round(this.dmgCaused*100)/100,posx,posy+=10);
    ctx4.fillText("DTRI: "+round(10000*this.deterioration)/10000, posx,posy+=10);
    posy+=10;
    if(this.outputs[2]<-0.33) {
      ctx4.fillText("CARN",posx,posy+=10);
    } else if(this.outputs[2]>=0.33) {
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

    if(consoleMouse && leftPressed) {
      if(mouseX>200 && mouseX<210 && mouseY>200 && mouseY<210) { // Exit
        display=0;
        highlighted=null;
        ctx3.fillStyle="#323232";
        ctx3.fillRect(200, 200, 400, 200);
        ctx4.clearRect(200, 200, 400, 200);
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
      }
    }
  } else if(display==1) {
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
    ctx4.clearRect(0,0,CONSOLEX,CONSOLEY);

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
    ctx4.fillText("B$: "+(round(this.brainCost*BRAINSIZECAP*BRAINLAYERSCAP*3)),posx,posy+=10);
    ctx4.fillText("WD: "+(round(10000*this.weightDiff)/10000),posx,posy+=10);

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
        ctx4.fillText("W2",60,posy2);
        ctx4.fillText("B",100,posy2);
        for(var i=0, bS2=BRAINSIZECAP; i<bS2; i++) {
          ctx4.fillText(neu.weights[0][i], 20, posy2+=10);
          ctx4.fillText(neu.weights[1][i], 60, posy2);
          ctx4.fillText(neu.bias[i], 100, posy2);
        }
      } else {
        var posy2=30;
        ctx4.fillStyle="#FFFFFF";
        ctx4.fillRect(10,10,130,460);
        ctx4.fillStyle="#323232";
        ctx4.fillText("N:"+neuNum+", L:"+neuLay+" MUTS",20,posy2);
        ctx4.fillText("W1",20,posy2+=10);
        ctx4.fillText("W2",60,posy2);
        ctx4.fillText("B",100,posy2);
        for(var i=0, bS2=BRAINSIZECAP; i<bS2; i++) {
          ctx4.fillText(neu.w1Genes[i], 20, posy2+=10);
          ctx4.fillText(neu.w2Genes[i], 60, posy2);
          ctx4.fillText(neu.bGenes[i], 100, posy2);
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
Animal.prototype.regress=function(index, scale) { // cI= child index, pI= parent index (if parent is alive)
  var pI;
  if(index>=0){
    pI = animals[index];
  } else {
    pI = deadanimals[-(index+1)];
  }
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        pI.brain[i][j].w1Genes[k]+=((pI.brain[i][j].weights[0][k]-this.brain[i][j].weights[0][k])/scale); //scale is bigger than 1 if more children than parent had-> regress to 0 LESS
        pI.brain[i][j].w2Genes[k]+=((pI.brain[i][j].weights[1][k]-this.brain[i][j].weights[1][k])/scale);
        pI.brain[i][j].bGenes[k]+=((pI.brain[i][j].bias[k]-this.brain[i][j].bias[k])/scale);

        pI.brain[i][j].w1Genes[k]=(round(10000*pI.brain[i][j].w1Genes[k])/10000);
        pI.brain[i][j].w2Genes[k]=(round(10000*pI.brain[i][j].w2Genes[k])/10000);
        pI.brain[i][j].bGenes[k]=(round(10000*pI.brain[i][j].bGenes[k])/10000);
      }
    }
  }

  pI.mouth.mutrs[0]+=((pI.mouth.dissen-this.mouth.dissen)/scale);
  pI.mouth.mutrs[1]+=((pI.mouth.dirsen-this.mouth.dirsen)/scale);

  pI.mouth.mutrs[0]=(round(10000*pI.mouth.mutrs[0])/10000);
  pI.mouth.mutrs[1]=(round(10000*pI.mouth.mutrs[1])/10000);

  for(var i=0; i<EYECAP; i++) {
    if(this.eyes[i]!= null && pI.eyes[i]!= null) {
      pI.eyes[i].mutrs[0]+=((pI.eyes[i].dissen-this.eyes[i].dissen)/scale);
      pI.eyes[i].mutrs[1]+=((pI.eyes[i].dirsen-this.eyes[i].dirsen)/scale);

      pI.eyes[i].mutrs[0]=(round(10000*pI.eyes[i].mutrs[0])/10000);
      pI.eyes[i].mutrs[1]=(round(10000*pI.eyes[i].mutrs[1])/10000);
    }
  }

  pI.senmuts[0]+=((pI.velres-this.velres)/scale);
  pI.senmuts[1]+=((pI.rotres-this.rotres)/scale);

  pI.senmuts[0]=(round(100*pI.senmuts[0])/100);
  pI.senmuts[1]=(round(100*pI.senmuts[1])/100);

  pI.maxSizeGene+=((pI.maxSize-this.maxSize)/scale);
  pI.minSizeGene+=((pI.minSize-this.minSize)/scale);

  pI.maxSizeGene=(round(10*pI.maxSizeGene)/10);
  pI.minSizeGene=(round(10*pI.minSizeGene)/10);
}
*/
Animal.prototype.softRegress=function(pidx, idx, scale) { // cI= child index, pI= parent index (if parent is alive)
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
        aI.brain[i][j].w1Genes[k]+=((pI.brain[i][j].weights[0][k]-this.brain[i][j].weights[0][k])/scale); //scale is bigger than 1 if more children than parent had-> regress to 0 LESS
        aI.brain[i][j].w2Genes[k]+=((pI.brain[i][j].weights[1][k]-this.brain[i][j].weights[1][k])/scale);
        aI.brain[i][j].bGenes[k]+=((pI.brain[i][j].bias[k]-this.brain[i][j].bias[k])/scale);

        aI.brain[i][j].w1Genes[k]=(round(10000*aI.brain[i][j].w1Genes[k])/10000);
        aI.brain[i][j].w2Genes[k]=(round(10000*aI.brain[i][j].w2Genes[k])/10000);
        aI.brain[i][j].bGenes[k]=(round(10000*aI.brain[i][j].bGenes[k])/10000);
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
  var pI;
  if(index>=0){
    pI=animals[index];
  } else {
    pI=deadanimals[-(index+1)];
  }
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        pI.brain[i][j].w1Genes[k]+=(this.brain[i][j].weights[0][k]-pI.brain[i][j].weights[0][k]);
        pI.brain[i][j].w2Genes[k]+=(this.brain[i][j].weights[1][k]-pI.brain[i][j].weights[1][k]);
        pI.brain[i][j].bGenes[k]+=(this.brain[i][j].bias[k]-pI.brain[i][j].bias[k]);
        pI.brain[i][j].w1Genes[k]=(round(10000*pI.brain[i][j].w1Genes[k])/10000);
        pI.brain[i][j].w2Genes[k]=(round(10000*pI.brain[i][j].w2Genes[k])/10000);
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
  pI.maxSizeGene=(round(10*pI.maxSizeGene)/10);
  pI.minSizeGene=(round(10*pI.minSizeGene)/10);
}

/*
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
  if(propagateMode==1){
    mux=this.genePool; // descendants DO NOT include animals own children: rather, counts how successful each of its children have been at reproducing
  }else {
    mux=1;
  }

  a.velres=this.velres;
  a.rotres=this.rotres;

  a.senmuts[0]=this.senmuts[0]/mux; //set child and parent mutation rates identical
  a.senmuts[1]=this.senmuts[1]/mux;
  a.senmuts[0]=round(100*a.senmuts[0])/100;
  a.senmuts[1]=round(100*a.senmuts[1])/100;

  a.velres+=(this.senmuts[0]/mux); // child attributes displaced incrementally...
  a.rotres+=(this.senmuts[1]/mux);
  a.velres=round(100*a.velres)/100;
  a.rotres=round(100*a.rotres)/100;

  var rbm;
  for(var i=0;i<2;i++) {
    rbm=randn_bm();
    if(rbm>this.senmuts[i]){ // Use normal distribution to generate random numbers localized around 0....
      this.senmuts[i]+=1/100; //parent genes are displaced...
    } else if(rbm<this.senmuts[i]){
      this.senmuts[i]-=1/100; //parent genes are displaced...
    }
    this.senmuts[i]=round(100*this.senmuts[i])/100;
  }

  a.maxSizeGene=this.maxSizeGene/mux;
  a.minSizeGene=this.minSizeGene/mux;
  a.maxSizeGene=round(10*a.maxSizeGene)/10;
  a.minSizeGene=round(10*a.minSizeGene)/10;

  a.maxSize=this.maxSize;
  a.minSize=this.minSize;
  a.maxSize+=round(this.maxSizeGene/mux);
  if(a.maxSize>SIZECAP) {
    a.maxSize=SIZECAP;
  } else if(a.maxSize<2*a.minSize) {
    a.maxSize=2*a.minSize;
  }

  a.minSize+=round(this.minSizeGene/mux);
  if(a.minSize>=round(a.maxSize/2)) {
    a.minSize=round((a.maxSize-1)/2);
  }else if(a.minSize<5) {
    a.minSize=5;
  }
  a.midSize=(a.maxSize-a.minSize)/2;
  a.size=a.minSize;

  rbm=randn_bm();
  if(rbm>this.maxSizeGene){
    this.maxSizeGene+=1/10;
  } else if(rbm<this.maxSizeGene){
    this.maxSizeGene-=1/10;
  }
  rbm=randn_bm();
  if(rbm>this.minSizeGene){
    this.minSizeGene+=1/10;
  } else if(rbm<this.minSizeGene){
    this.minSizeGene-=1/10;
  }
  this.maxSizeGene=round(10*this.maxSizeGene)/10;
  this.minSizeGene=round(10*this.minSizeGene)/10;

  a.energy=a.minSize*10000;
  a.maxEnergy=a.energy;
  a.vel=this.vel;
  a.rot=this.rot;
  a.attack=this.attack; // * this.size refers to original size before mitosis

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

  a.mouth.mutrs[0]=this.mouth.mutrs[0]/mux;
  a.mouth.mutrs[1]=this.mouth.mutrs[1]/mux;
  a.mouth.mutrs[0]=round(10000*a.mouth.mutrs[0])/10000;
  a.mouth.mutrs[1]=round(10000*a.mouth.mutrs[1])/10000;

  a.mouth.dissen+=this.mouth.mutrs[0]/mux;
  a.mouth.dissen=round(10000*a.mouth.dissen)/10000;
  a.mouth.dirsen+=this.mouth.mutrs[1]/mux;
  a.mouth.dirsen=round(10000*a.mouth.dirsen)/10000;
  rbm=randn_bm();
  if(rbm>this.mouth.mutrs[0]){
    this.mouth.mutrs[0]+=10/10000;
  } else if(rbm<this.mouth.mutrs[0]){
    this.mouth.mutrs[0]-=10/10000;
  }

  rbm=randn_bm();
  if(rbm>this.mouth.mutrs[1]){
    this.mouth.mutrs[1]+=10/10000;
  } else if(rbm<this.mouth.mutrs[1]){
    this.mouth.mutrs[1]-=10/10000;
  }
  this.mouth.mutrs[0]=round(10000*this.mouth.mutrs[0])/10000;
  this.mouth.mutrs[1]=round(10000*this.mouth.mutrs[1])/10000;

  for(var i=0;i<MEMCAP;i++) {
    a.memory[i]=this.memory[i];
  }

  a.brainCost=0;
  for(var i=0, bL=BRAINLAYERSCAP; i<bL; i++) {
    for(var j=0, bS=BRAINSIZECAP; j<bS; j++) {
      a.brain[i][j].cost=0;
      a.brain[i][j].is=this.brain[i][j].is;

      for(var k=0, bS2=BRAINSIZECAP; k<bS2; k++) {
        a.brain[i][j].weights[0][k]=this.brain[i][j].weights[0][k];
        a.brain[i][j].weights[1][k]=this.brain[i][j].weights[1][k];
        a.brain[i][j].bias[k]=this.brain[i][j].bias[k];

        a.brain[i][j].w1Genes[k]=this.brain[i][j].w1Genes[k]/mux;
        a.brain[i][j].w2Genes[k]=this.brain[i][j].w2Genes[k]/mux;
        a.brain[i][j].bGenes[k]=this.brain[i][j].bGenes[k]/mux;

        a.brain[i][j].w1Genes[k]=round(10000* a.brain[i][j].w1Genes[k])/10000;
        a.brain[i][j].w2Genes[k]=round(10000* a.brain[i][j].w2Genes[k])/10000;
        a.brain[i][j].bGenes[k]=round(10000* a.brain[i][j].bGenes[k])/10000;

        a.brain[i][j].weights[0][k]+=this.brain[i][j].w1Genes[k]/mux;
        a.brain[i][j].weights[1][k]+=this.brain[i][j].w2Genes[k]/mux;
        a.brain[i][j].bias[k]+=this.brain[i][j].bGenes[k]/mux;

        a.brain[i][j].weights[0][k]=round(10000*a.brain[i][j].weights[0][k])/10000;
        a.brain[i][j].weights[1][k]=round(10000*a.brain[i][j].weights[1][k])/10000;
        a.brain[i][j].bias[k]=round(10000*a.brain[i][j].bias[k])/10000;

        rbm=randn_bm();
        if(rbm>this.brain[i][j].w1Genes[k]){
          this.brain[i][j].w1Genes[k]+=10/10000;
        } else if(rbm<this.brain[i][j].w1Genes[k]){
          this.brain[i][j].w1Genes[k]-=10/10000;
        }
        rbm=randn_bm();
        if(rbm>this.brain[i][j].w2Genes[k]){
          this.brain[i][j].w2Genes[k]+=10/10000;
        } else if(rbm<this.brain[i][j].w2Genes[k]){
          this.brain[i][j].w2Genes[k]-=10/10000;
        }
        rbm=randn_bm();
        if(rbm>this.brain[i][j].bGenes[k]){
          this.brain[i][j].bGenes[k]+=10/10000;
        } else if(rbm<this.brain[i][j].bGenes[k]){
          this.brain[i][j].bGenes[k]-=10/10000;
        }

        this.brain[i][j].w1Genes[k]=round(10000*this.brain[i][j].w1Genes[k])/10000;
        this.brain[i][j].w2Genes[k]=round(10000*this.brain[i][j].w2Genes[k])/10000;
        this.brain[i][j].bGenes[k]=round(10000*this.brain[i][j].bGenes[k])/10000;

        a.brain[i][j].cost+=(abs(a.brain[i][j].weights[0][k])+abs(a.brain[i][j].weights[1][k])+abs(a.brain[i][j].bias[k]));
      }
      a.brainCost+=a.brain[i][j].cost;
    }
  }

  a.eyeNumber=this.eyeNumber;
  for(var i=0;i<BRAINSIZECAP;i++) {
    a.outputs[i]=this.outputs[i];
  }
  a.brainCost/=(BRAINSIZECAP*BRAINLAYERSCAP*3);//3 attributes

  for(var i=0, eC=EYECAP; i<eC; i++) {
    if(i<a.eyeNumber && this.eyes[i]!=null) {
      a.eyes[i]=new Eye(a.dir,a.x,a.y);
      a.eyes[i].dir=this.eyes[i].dir;
      a.eyes[i].stray=this.eyes[i].stray;
      a.eyes[i].dissen=this.eyes[i].dissen;
      a.eyes[i].dirsen=this.eyes[i].dirsen;
      a.eyes[i].col=this.eyes[i].col;
      a.eyes[i].sense=this.eyes[i].sense;

      a.eyes[i].mutrs[0]=this.eyes[i].mutrs[0]/mux;
      a.eyes[i].mutrs[1]=this.eyes[i].mutrs[1]/mux;
      a.eyes[i].mutrs[0]=round(10000*a.eyes[i].mutrs[0])/10000;
      a.eyes[i].mutrs[1]=round(10000*a.eyes[i].mutrs[1])/10000;

      a.eyes[i].dissen+=this.eyes[i].mutrs[0]/mux; //Child attributes displaced by parent muts...
      a.eyes[i].dissen=round(10000*a.eyes[i].dissen)/10000;
      a.eyes[i].dirsen+=this.eyes[i].mutrs[1]/mux;
      a.eyes[i].dirsen=round(10000*a.eyes[i].dirsen)/10000;

      rbm=randn_bm();
      if(rbm>this.eyes[i].mutrs[0]){
        this.eyes[i].mutrs[0]+=10/10000;
      } else if(rbm<this.eyes[i].mutrs[0]){
        this.eyes[i].mutrs[0]-=10/10000;
      }

      rbm=randn_bm();
      if(rbm>this.eyes[i].mutrs[1]){
        this.eyes[i].mutrs[1]+=10/10000;
      } else if(rbm<this.eyes[i].mutrs[1]){
        this.eyes[i].mutrs[1]-=10/10000;
      }

      this.eyes[i].mutrs[0]=round(10000*this.eyes[i].mutrs[0])/10000;
      this.eyes[i].mutrs[1]=round(10000*this.eyes[i].mutrs[1])/10000;
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
*/
