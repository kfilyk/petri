
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
	sense=0;
	sees=0;
}

Eye.prototype.setXY=function(animalDir, animalX, animalY, eyeX, eyeY) {

  this.x= animalX + eyeX*Math.cos(DEG_TO_RAD*animalDir) + eyeY*Math.cos(DEG_TO_RAD*(animalDir+90));
  this.y= animalY + eyeX*Math.sin(DEG_TO_RAD*(animalDir+90)) + eyeY*Math.sin(DEG_TO_RAD*animalDir); //+ mouthY * Math.cos(DEG_TO_RAD*animalDir);

  //this.x= animalX + mouthX;
  //this.y= animalY + mouthY;
  
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