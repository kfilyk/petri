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
var highlighted=null;
var display=0;
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
var livePop=0;
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

var aveChildren=0; //Ratio of number of children per parent
var aveLifespan=0;
var avePosNRG=0;

var maxAveChildren=1;
var maxAveLifespan=1;
var maxAvePosNRG=1;

/* STATS */
// count total red, green, blue on the map
var redAgarOnMapStat=0; 
var blueAgarOnMapStat=0;
var greenAgarOnMapStat=0;
var mutationRateStat=0;
var mitosisStat=0;
var netEatenRatioStat=0;

var foodPopChart = new Chart("foodPopChart", {
  type: "line",
  data: {
    datasets: [
      {
        label: 'RED AGAR',
        data: [],
        borderColor: 'rgb(255, 0, 0)',
        pointRadius:0,
        lineTension: 0,
        fill: false,
        yAxisID: 'AGAR',
      }, 
      {
        label: 'GREEN AGAR',
        data: [],
        borderColor: 'rgb(0, 255, 0)',
        pointRadius:0,
        lineTension: 0,
        fill: false,
        yAxisID: 'AGAR',
      }, 
      {
        label: 'BLUE AGAR',
        data: [],
        borderColor: 'rgb(0, 0, 255)',
        pointRadius:0,
        lineTension: 0,
        fill: false,
        yAxisID: 'AGAR',
      }, 
      {
        label: 'POPULATION',
        data: [],
        borderColor: 'rgb(50, 50, 50)',
        pointRadius:0,
        lineTension: 0,
        fill: false,
        yAxisID: 'POP',
      }, 
    ]
  },
  options: {
    legend: {display:false},
    animation: {
      duration: 0
    },
    scales: {
      xAxes: [{
        ticks: {
          maxTicksLimit: 8
        }
      }],
      yAxes: [
      {
        id: 'AGAR',
        ticks: {
          maxTicksLimit: 8
        },
        position: 'left',
      },
      {
        id: 'POP',
        ticks: {
          maxTicksLimit: 8
        },
        position: 'right',
      }]
    }
  }
});

var optimizationChart = new Chart("optimizationChart", {
  type: "line",
  data: {
    datasets: [
      {
        label: 'MUTATION RATE',
        data: [],
        borderColor: 'rgb(50, 50, 50)',
        pointRadius:0,
        lineTension: 0,
        fill: false,
        yAxisID: 'MUT',

      }, 
      {
        label: 'EATING EFFICIENCY',
        data: [],
        borderColor: 'rgb(00, 196, 00)',
        pointRadius:0,
        lineTension: 0,
        fill: false,
        yAxisID: 'EAT',

      }, 
    ]
  },
  options: {
    legend: {display:false},    
    animation: {
      duration: 0
    },
    scales: {
      xAxes: [{
        ticks: {
          maxTicksLimit: 8
        }
      }],
      yAxes: [
      {
        id: 'MUT',
        ticks: {maxTicksLimit: 8},
        position: 'left',
      },
      {
        id: 'EAT',
        ticks: {maxTicksLimit: 8},
        position: 'right',
      }
      ]
    }
  }
});

function addChartData(chart, label, data) {
  chart.data.labels.push(label);
  i=0;
  chart.data.datasets.forEach((dataset) => {
      dataset.data.push(data[i]);
      i++;
  });
  chart.update();
}

function resetChartData(chart) {
  chart.data.labels = [];
  i=0;
  chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
  });
  chart.update();
}

var aveChildrenHist=[];
var aveLifespanHist=[];
var avePosNRGHist=[];

var accelerate=0;

var text;

const currentKeysPressed = {};
var leftAccel = 0;
var rightAccel = 0;
var upAccel = 0;
var downAccel = 0;

function highlight_newest() {
  highlighted=newest;
  document.getElementById("dashboard-stats").style.display="block";
  document.getElementById('brain').style.display='block';
}

function highlight_gold() {
  highlighted=gold;
  document.getElementById("dashboard-stats").style.display="block";
  document.getElementById('brain').style.display='block';
}
function highlight_silver() {
  highlighted=silver;
  document.getElementById("dashboard-stats").style.display="block";
  document.getElementById('brain').style.display='block';
}

function highlight_bronze() {
  highlighted=bronze;
  document.getElementById("dashboard-stats").style.display="block";
  document.getElementById('brain').style.display='block';
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
		getXY('over', e)
    mouseOverConsole = true;
	}, false);
	stats.addEventListener("mousemove", function (e) {
		getXY('move', e)
	}, false);
	stats.addEventListener("mousedown", function (e) {
		getXY('down', e)
	}, false);
	stats.addEventListener("mouseup", function (e) {
		getXY('up', e)
	}, false);
	stats.addEventListener("mouseout", function (e) {
		getXY('out', e)
    mouseOverConsole = false;
	}, false);

	map.addEventListener("mouseover", function (e) {
		getXY('over', e)
    mouseOverMap = true;
	}, false);
	map.addEventListener("mousemove", function (e) {
		getXY('move', e)
	}, false);
	map.addEventListener("mousedown", function (e) {
		getXY('down', e)
	}, false);
	map.addEventListener("mouseup", function (e) {
		getXY('up', e)
	}, false);
	map.addEventListener("mouseout", function (e) {
		getXY('out', e)
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
    var tSca = 1+scaleDelta/400;
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
  if(!pause && time%1000==0){ // COLLECT EVERY 100 FRAMES
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
    ctx2.clearRect(-100,-100,1200,100); //top
    ctx2.clearRect(-100,FIELDY,1200,100);//bottom
    ctx2.clearRect(-100,0,100,1000); //left
    ctx2.clearRect(FIELDX,0,100,1000); //right

		for(var i=0; i<TILENUMBER; i++) {
			tiles[i].draw();
			if(!pause) {
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
        if(a.alive) {
          a.decay(); // check if animal dies this round
          if(a.alive){
            a.move(); // only move if not dead; this is placed here before sensing, but seperate from the eat step because movement can be stifled by being attacked
            a.damage = 0; // reset damage
            a.sense();

            if(gold == null || a.descendants > animals[gold].descendants) {
              gold = i;
            } else if(silver == null || a.descendants > animals[silver].descendants) {
              silver = i;
            } else if(bronze == null || a.descendants > animals[bronze].descendants) {
              bronze = i;
            }
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
              document.getElementById('dashboard-stats').style.display='block';
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


    aveChildrenHist.push(aveChildren);
    if(aveChildren>maxAveChildren){
      maxAveChildren=aveChildren;
    }
    aveChildren=0;

    aveLifespanHist.push(aveLifespan);
    avePosNRGHist.push(avePosNRG);

    // go through animals and collect data
    if(livePop != 0){
      for(var a, i=0; i<=HIGHESTINDEX; i++) {
        a = animals[i];
        if(a.alive) {
          netEatenRatioStat += (a.redEaten + a.greenEaten + a.blueEaten)  / a.netEaten;
        }
      }
      netEatenRatioStat /= livePop;

    } else {
      netEatenRatioStat = 0;
    }
    // go through tiles and collect data
		for(var i=0; i<TILENUMBER; i++) {
			if(!pause) {
        redAgarOnMapStat+=tiles[i].R;
        greenAgarOnMapStat+=tiles[i].G;
        blueAgarOnMapStat+=tiles[i].B;			
      }
		}


    addChartData(foodPopChart, time/100, [redAgarOnMapStat, greenAgarOnMapStat, blueAgarOnMapStat, livePop])
    addChartData(optimizationChart, time/100, [mutationRateStat/mitosisStat, netEatenRatioStat])


    mutationRateStat = 0;
    mitosisStat = 0;
    netEatenRatioStat = 0;

    redAgarOnMapStat=0;
    greenAgarOnMapStat=0;
    blueAgarOnMapStat=0;
    
    if(aveLifespan>maxAveLifespan){
      maxAveLifespan=aveLifespan;
    }
    if(avePosNRG>maxAvePosNRG){
      maxAvePosNRG=avePosNRG;
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

    // check if highlighted creature has died
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

  aveChildren=0;
  aveLifespan=0;
  avePosNRG=0;

  maxAveChildren=1;
  maxAveLifespan=1;
  maxAvePosNRG=1;

  livePop=0;
  HIGHESTINDEX=0;
  for(var a, i=0; i<animals.length;i++){
    a=animals[i];
    if(a!=null && a.alive==true){
      livePop++;
      HIGHESTINDEX=i;
    }
  }

  aveChildrenHist=[];
  aveLifespanHist=[];
  avePosNRGHist=[];

}

var inputManager= {
	update: function() {
		if(mouseOverMap) { // mouse over map

			//gen 1 random
			if(rightPressed) {
        
				if(livePop<POPCAP) {
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
					livePop++;
					if(i>HIGHESTINDEX) {
						HIGHESTINDEX=i;
					}
          document.getElementById("dash-live-info").innerHTML = "LIVE: " + livePop + "     DEAD: " + graveyard.length;
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
        cDrag = false;

        mouseOriginalX+=dragOffsetX;
        mouseOriginalY+=dragOffsetY;
        mouseX+=dragOffsetX;
        mouseY+=dragOffsetY;

        dragOffsetX=0;
        dragOffsetY=0;
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
  resetChartData(foodPopChart);
  resetChartData(optimizationChart);

  dashboard.setup();
  tileManager.generate();
  document.getElementById("dash-live-info").innerHTML = "LIVE: " + livePop + "     DEAD: " + graveyard.length;

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

function namer() {
	var n="";
	for(var i=0;i<4;i++) {
		n+=ALPH.charAt(round(Math.random()*25));
	}
	return n;
}

function getXY(action, e) {
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

function rgbaToHex (r,g,b,a) {
  var outParts = [
    r.toString(16),
    g.toString(16),
    b.toString(16),
    Math.round(a * 255).toString(16).substring(0, 2)
  ];

  // Pad single-digit output values
  outParts.forEach(function (part, i) {
    if (part.length === 1) {
      outParts[i] = '0' + part;
    }
  })

  return ('#' + outParts.join(''));
}

function round(r) {
	//return ~~(r + (r>0 ? .5:-.5));
  return r + (r < 0 ? -0.5 : 0.5) | 0;
}
function abs(x) {
	return (x>0 ? x:-x);
}

function Tile(x, y, num, neighbors) {
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
