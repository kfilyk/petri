// Eye creature component
class Eye {
  constructor(x,y){
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

Eye.prototype.move=function(animalDir, animalX, animalY, eyeX, eyeY) {
  var angle = Math.atan(eyeX/(eyeY+0.001))/DEG_TO_RAD
  var dist = Math.sqrt(eyeX**2 + eyeY**2)
  if(eyeX < 0) {
    angle+=180
  }
  
  this.x= animalX + dist*Math.cos(DEG_TO_RAD*(angle+animalDir))
  this.y= animalY + dist*Math.sin(DEG_TO_RAD*(angle+animalDir))
}

Eye.prototype.sense=function() {
  this.sees = -1;
  this.s = 0;
  if(this.x>=0 && this.y>=0 && this.x<FIELDX && this.y<FIELDY) {
    this.tile=((~~(this.y/25)*40)+(~~(this.x/25)));
    this.r=tiles[this.tile].R/150;
    this.g=tiles[this.tile].G/200;
    this.b=tiles[this.tile].B/100;
  } else {
    this.tile=null;
    this.r = -1;
    this.g = -1;
    this.b = -1;
    this.s = -1;
  }
}