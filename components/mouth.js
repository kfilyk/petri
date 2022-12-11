// Mouth creature component
class Mouth {
  constructor(x,y) {
    this.x=x;
    this.y=y;
  }
  tile=null;
  r=0;
  g=0;
  b=0;
  s=0;
  sees=0;
}

// set mouth x, y using x,y plane coord. system rather than distance, rotation coord. sys used by movement
Mouth.prototype.move=function(animalDir, animalX, animalY, mouthX, mouthY) {
  var angle = Math.atan(mouthX/(mouthY+0.001))/DEG_TO_RAD
  var dist = Math.sqrt(mouthX**2 + mouthY**2)
  if(mouthX < 0) {
    angle+=180
  }
  
  this.x= animalX + dist*Math.cos(DEG_TO_RAD*(angle+animalDir))
  this.y= animalY + dist*Math.sin(DEG_TO_RAD*(angle+animalDir))
}

Mouth.prototype.sense=function() {
  this.sees = -1;
  this.s = 0;
  if(this.x>=0 && this.y>=0 && this.x<FIELDX && this.y<FIELDY) {
    this.tile=((~~(this.y/25)*40)+(~~(this.x/25)));
    this.r=tiles[this.tile].R/150;
    this.g=tiles[this.tile].G/200;
    this.b=tiles[this.tile].B/100;
  } else { // if against a wall, tell the creature that its poisonous!
    this.tile=null;
    this.r =-1;
    this.g =-1;
    this.b =-1;
    this.s = -1;
  }
}