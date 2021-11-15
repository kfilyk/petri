function Animal(x,y,index) {
	this.index=index;
	this.alive=true;
	this.x=x;
	this.y=y;
	this.tile=null;
	this.size=STARTSIZE;
	this.health=0;
	this.gen=0;
  this.age=0;
	this.parent=null;
	this.parent_index=null;
  this.cno=null;
	this.children=[];
  this.liveDescendants=0;
  this.descendants=0;
  this.proGenes=0;
  this.conGenes=0;
	this.name=namer();

  this.velocity=0; 
  this.rot=0;
	this.dir=round(Math.random()*360); // facing direction
  this.velDir=(Math.random()*2)-1; // traveling direction

	this.eyes=new Array(5);
	for(var i=0;i<5;i++) {
		this.eyes[i] = new Eye(this.x, this.y);
	}
	this.mouth=new Mouth(this.x, this.y);
	this.food=0;

  this.red=0.0005;
  this.green=0.0005;
  this.blue=0.0005;
  this.netRed=0.001;
  this.netGreen=0.001;
  this.netBlue=0.001;

  this.posFood=0.0005;
  this.netFood=0.001;

	this.brain=new Array(BRAIN_SIZE);
	this.brainCost=0;

  /*
  basic brain inputs:

  0. food
  1. energy change

  2. mouth red
  3. mouth green
  4. mouth blue
  5. mouth sense

  6. health
  7. size
  8. velocity

  */

  /*
  brain outputs array:
  output neurons exist between at indices 29-36, with potential to go from indices 29 - 50?
  outputs[0] = velocity
  outputs[1] = rotation
  outputs[2] = herbivore/ carnivore
  outputs[3] = interact red
  outputs[4] = interact green
  outputs[5] = interact blue
  outputs[6] = have a kid

  */

	for(var i=0; i<BRAIN_SIZE; i++) { // fill brain with empty neurons
    this.brain[i] = new Neuron(); // neuron will be created with number of weights equal to total size of brain?
    if(i<9){ // for basic input neurons + mouth, excluding eyes
      this.brain[i].initRandomWeights(0,BRAIN_INPUTS+8); // init first 9 inputs w connections to first 9 inputs + first 7 outputs
    }
    if(i>=BRAIN_INPUTS && i<BRAIN_INPUTS+8){ // if neuron is output neuron, excluding eyes
      this.brain[i].initRandomWeights(0,BRAIN_INPUTS+8); // init first (basic) 7 output neurons with connections to first 7 outputs, inputs
    }
    this.brainCost+=this.brain[i].cost;
	}

	this.brainCost/=BRAIN_SIZE;

  // outputs array
	this.outputs=new Array(BRAIN_OUTPUTS);
	for(var i=0;i<BRAIN_OUTPUTS;i++) {
		this.outputs[i]=0;
	}

	this.energy=STARTSIZE*10000;
	this.maxEnergy=this.energy;
	this.energyChange=0;

	this.maxEnergyChange=1;
	this.minEnergyChange=-1;

  this.gain=0;
	this.energyExchanged=0;
	this.dmgReceived=0;
	this.dmgCaused=0;
	this.score=0;
	this.top=SCORESCAP;
  this.cols = new Uint8ClampedArray(15);
  this.lr=0;
}
Animal.prototype.draw=function(c){
  c[0]=this.red/this.netFood*255; // colour the creature
  c[1]=this.green/this.netFood*255;
  c[2]=this.blue/this.netFood*255;
  c[3]=c[0]-20;
  c[4]=c[1]-20;
  c[5]=c[2]-20;
  c[6]=c[0]+20;
  c[7]=c[1]+20;
  c[8]=c[2]+20;
  c[9]=c[0]-40;
  c[10]=c[1]-40;
  c[11]=c[2]-40;
  c[12]=c[0]+40;
  c[13]=c[1]+40;
  c[14]=c[2]+40;

  //draw eyes
  ctx2.strokeStyle=rgbToHex(c[6],c[7],c[8]);
  ctx2.fillStyle=rgbToHex(c[12],c[13],c[14]);
  for(var i=0; i<5; i++) {
    ctx2.beginPath();
    ctx2.arc(this.eyes[i].x,this.eyes[i].y, this.size/10, 0, TWOPI); // eyes are 1/5 size of body
    ctx2.stroke();
    ctx2.fill();
  }

  // draw body
  ctx2.strokeStyle= rgbToHex(c[3],c[4],c[5]);
  ctx2.fillStyle= rgbToHex(c[0],c[1],c[2]);
  ctx2.beginPath();
  ctx2.arc(this.x, this.y, this.size/2, 0, TWOPI); //
  ctx2.stroke();
  ctx2.fill();

  // draw mouth
	ctx2.strokeStyle=rgbToHex(c[9],c[10],c[11]);
	ctx2.fillStyle=rgbToHex(c[3],c[4],c[5]);
	ctx2.beginPath();
	ctx2.arc(this.mouth.x,this.mouth.y, this.size/4, 0, TWOPI);
	ctx2.stroke();
	ctx2.fill();


	if(mouseOverMap && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50 && highlighted!=this.index) {
		ctx2.fillStyle= "#FFFFFF";
		ctx2.fillText(this.name+"-"+this.gen+(this.alive==true ? "A":"D")+this.children.length, this.x+(2*this.size), this.y-(2*this.size)+2);
	}
}

// sense map + other animals in vicinity of mouth, eyes
Animal.prototype.sense=function() {
	this.age++;
	this.energyChange=0;
  this.energyChange+=this.energyExchanged; // subtract energy used while interaction with creatures
  this.dmgReceived-=this.energyExchanged;  // how much damage has been taken by this creature
  this.energyExchanged=0; // reset interaction energy for this iteration

  // reset mouth, eyes seeing other animals
	this.mouth.sees=-1; 
  this.mouth.sense = 0; 
	for(var i=0;i<5; i++) {
    this.eyes[i].sees=-1;
    this.eyes[i].sense = 0;
  }

  // if map boundary hit
	if(this.x<0 || this.x>=FIELDX) {
		if(this.x<0) {
			this.x=0;
		} else {
			this.x=FIELDX-1;
		}
		this.outputs[0]=0; // set velocity to 0
	}
	if(this.y<0 || this.y>=FIELDY) {
		if(this.y<0) {
			this.y=0;
		} else {
			this.y=FIELDY-1;
		}
		this.outputs[0]=0; // set velocity to 0
	}

	//update current tile this creature is on
	var ct=((~~(this.y/25)*40)+(~~(this.x/25)));
	if(ct>=1600) {
		this.tile=1599;
	} else if (ct<0) {
		this.tile= 0;
	}
	this.tile=ct;

  var s1=this.size;
  if(this.mouth.tile!=null) { // set tile visible to mouth 
    this.mouth.r=tiles[this.mouth.tile].R/150;
    this.mouth.g=tiles[this.mouth.tile].G/200;
    this.mouth.b=tiles[this.mouth.tile].B/100;
  }

  for(var i=0; i<5; i++) { // set  tile  visible to eye
    if(this.eyes[i].tile!=null) {
      this.eyes[i].r=tiles[this.eyes[i].tile].R/150;
      this.eyes[i].g=tiles[this.eyes[i].tile].G/200;
      this.eyes[i].b=tiles[this.eyes[i].tile].B/100;
    }
  }
  /*
  (s1/4)= radius of mouth
  */
  for(var j=0; j<=HIGHESTINDEX; j++) { // loop through all living animals
    if(animals[j].alive==true && (j!=this.index)) {
      if(this.mouth.sees==-1) {
        // if this creatures mouth intercepts bounding box of another creature body
        if( ((abs(this.mouth.x-animals[j].x) <=((animals[j].size/2)+(s1/4))) && (abs(this.mouth.y-animals[j].y)<=((animals[j].size/2)+(s1/4)))) || ((abs(this.mouth.x-animals[j].mouth.x)<=((animals[j].size/4)+(s1/4))) && (abs(this.mouth.y-animals[j].mouth.y)<=((animals[j].size/4)+(s1/4)))) ) {
          this.mouth.r=((2*animals[j].red/animals[j].netFood)-1); // get red colour of other creature
          this.mouth.g=((2*animals[j].green/animals[j].netFood)-1); // get blue colour of other creature
          this.mouth.b=((2*animals[j].blue/animals[j].netFood)-1); // get green colour of other creature
          this.mouth.sense=animals[j].outputs[2]; // sense other creature's eating habit 
          this.mouth.sees=j; // could have a concurrency problem IFF the creature dies before eat sequence- could hurt a new creature which took the spot of the old one. Fix this later
        }
      }

      for(var i=0; i<5; i++) {
        if(this.eyes[i].sees==-1) {
          if(((abs(this.eyes[i].x-animals[j].x)-(s1/8))<=animals[j].size/2 && (abs(this.eyes[i].y-animals[j].y)-(s1/8))<=animals[j].size/2) || ((abs(this.eyes[i].x-animals[j].mouth.x)-(s1/8))<=animals[j].size/4 && (abs(this.eyes[i].y-animals[j].mouth.y)-(s1/8))<=animals[j].size/4)) {
            this.eyes[i].r=((2*animals[j].red/animals[j].netFood)-1);
            this.eyes[i].g=((2*animals[j].green/animals[j].netFood)-1);
            this.eyes[i].b=((2*animals[j].blue/animals[j].netFood)-1);
            this.eyes[i].sense=animals[j].outputs[2];
            this.eyes[i].sees=j;
          }
        }
      }
    }
  }
}


// dictates rules for animals consuming tiles or other creatures 
Animal.prototype.eat=function() {
  var s1=this.size;
  this.food=0;

  if(this.outputs[2]<0) { // carnivorous
    if(this.mouth.sees!=-1){ // sees an animal - is this strictly an alive animal currently? hopefully
      j=this.mouth.sees; // the animal seen
      if(animals[j].alive==true) {
        var x = 10*s1*(-this.outputs[2]); // this creatures size scaled by 10 so its not too tiny - x represents carnivorous intention with possible eating intensity from (0 to 100)
        
        var r=(this.outputs[3]+1)/2; // eatr [-1, 1] -> [0, 1] : red interactivity
        var g=(this.outputs[4]+1)/2; // eatg
        var b=(this.outputs[5]+1)/2; // eatb
        // creature estimates the other creature's colour, is rewarded based on precision
        //convert back to range [-1, 1], then scale

        var r=((1-abs(r-animals[j].red/animals[j].netFood))*2-1) * x; // if other has 100% red and you guessed 100% red, then 0 difference between guessed and actual- perfect attack
        var g=((1-abs(g-animals[j].green/animals[j].netFood))*2-1) * x; // if other has 0% green and you guess 100% green,
        var b=((1-abs(b-animals[j].blue/animals[j].netFood))*2-1) * x;
        // if negative, actually gave the other animal food
        if(r>0){ // got food 
          this.netRed+=r;
          this.red+=r;
        } else { // lost food
          this.netRed-=r;
        }
        if(g>0){
          this.netGreen+=g;
          this.green+=g;
        } else {
          this.netGreen-=g;
        }
        if(b>0){
          this.netBlue+=b;
          this.blue+=b;
        } else {
          this.netBlue-=b;
        }
        this.food=r+g+b;
        animals[j].energyExchanged -= this.food; // energy exchanged with interacted creature
        this.dmgCaused+=this.food;
      }
    }
  }else { //herbivore. note that if a creature eats from a tile that has negative food, it will be poisonous to the creature.
    // 0 means no interaction, 1 means feeding, -1 means ???
    if(this.mouth.tile!=null) { // if the mouth is actually over a tile
      var t = this.mouth.tile;
      var r=s1*this.outputs[2]*this.outputs[3]; // size * herbaciousness * red interactivity - if outputs[3] is positive, then  eating red. if outputs[3] is negative, then approximating toxicity
      var g=s1*this.outputs[2]*this.outputs[4]; // size * herbaciousness * green interactivity
      var b=s1*this.outputs[2]*this.outputs[5]; // size * herbaciousness * blue interactivity
      tiles[t].update=true;

      if(r>0){ // eating red
        r*=tiles[t].R; // eat of the tile a proportion equivalent to what the tile has
        if(r>0){ // tile fertile
          this.netRed+=r;
          this.red+=r;
          tiles[t].R-=r;
        } else { // tile toxic - reward creature with energy for not eating toxic tile - when r < 0, implies creature is sensing 
          this.netRed-=r;
          tiles[t].R+=r;
        }
        if(tiles[t].R<-tiles[t].RCap) {
          tiles[t].R=-tiles[t].RCap;
        }
      } else { // spit red
        tiles[t].R-=r;
        if(tiles[t].R>255){
          tiles[t].R=255;
        }
      }
      if(g>0){
        g*=tiles[t].G;
        if(g>0){
          this.netGreen+=g;
          this.green+=g;
          tiles[t].G-=g;
        } else { // g < 0
          this.netGreen-=g;
          tiles[t].G+=g;
        }
        if(tiles[t].G<-tiles[t].GCap) {
          tiles[t].G=-tiles[t].GCap;
        }
      } else {
        tiles[t].G-=g;
        if(tiles[t].G>255){
          tiles[t].G=255;
        }
      }
      if(b>0){
        b*=tiles[t].B; // t.B could be negative
        if(b>0){
          this.netBlue+=b;
          this.blue+=b;
          tiles[t].B-=b;

        } else {
          this.netBlue-=b;
          tiles[t].B+=b;
        }
        if(tiles[t].B<-tiles[t].BCap) {
          tiles[t].B=-tiles[t].BCap;
        }
      } else { // b<0
        tiles[t].B-=b;
        if(tiles[t].B>255){
          tiles[t].B=255;
        }
      }
      this.food=r+g+b;
    }
  }
}

Animal.prototype.think=function(b) {

  // sensory inputs - each b[x] is an input neuron
  b[0].in=this.food/(256*this.size); // how much food animal is consuming
  if(this.energyChange>=0) { // how much this animal is systaining itself
    b[1].in=this.energyChange/this.maxEnergyChange; // maybe should be average energy change
  } else {
    b[1].in=(-this.energyChange)/this.minEnergyChange;
  }
  b[2].in=this.mouth.r;
  b[3].in=this.mouth.g;
  b[4].in=this.mouth.b;
  b[5].in=this.mouth.sense; // sense if another creature
  b[6].in=this.health; // how much 'energy' creature has
  b[7].in=this.size/10; // current size of creature
  b[8].in=this.outputs[0]; // last velocity?

  var i; // use i for eyes
  // compute eyes
  var idx=9;
  for(i=0; i<5; i++) {
    b[(4*i)+idx].in=this.eyes[i].r;
    b[(4*i)+idx+1].in=this.eyes[i].g;
    b[(4*i)+idx+2].in=this.eyes[i].b;
    b[(4*i)+idx+3].in=this.eyes[i].sense;
  }

	// first frame: imagine all other neurons recieving '0' as input, so all neuron input values are accounted for up to this point.

  // calculate activation for all neurons
  /*
  for(i=0; i<BRAIN_SIZE; i++) {
    b[i].calc(this.index, i);
    b[i].o3=b[i].o2;
    b[i].o2=b[i].o1;
    b[i].o1=b[i].out;
    b[i].i3=b[i].i2;
    b[i].i2=b[i].i1;
    b[i].i1=b[i].in;
  }
*/

  // for all input neurons, 
  for(i=BRAIN_INPUTS, input=0; i<BRAIN_SIZE; i++) { 
    for(var j=0; j<BRAIN_SIZE; j++){
      input+=b[j].synapse(i); // Sum neuron weights with respect to neuron b[i]
    }
    b[i].in=input; // set activation of neuron
    input=0;
  }

  for(i=0; i<BRAIN_OUTPUTS; i++) {
    this.outputs[i]=b[i+BRAIN_INPUTS].out; // compute for all outputs?
  }
}

Animal.prototype.move=function() {
  this.velocity=this.outputs[0]*(10/this.size);
  this.rot=this.outputs[1]*(10/this.size);
  this.dir+=this.rot;
  if(this.dir<0) {
    this.dir+=360;
  } else if(this.dir>359) {
    this.dir-=360;
  }
  this.velDir=this.dir+(this.outputs[7]*180);
  if(highlighted==this.index && leftPressed && mouseOverMap && abs(this.x-mouseX)<20 && abs(this.y-mouseY)<20){
    this.x=round(mouseX);
    this.y=round(mouseY);
  } else {
    this.x+=this.velocity*Math.cos((this.velDir)*DEG_TO_RAD);
    this.y+=this.velocity*Math.sin((this.velDir)*DEG_TO_RAD);
  }

  var s1=this.size;
  // set mouth location
  this.mouth.angle=this.outputs[9]*180;
  this.mouth.dis=this.outputs[10]*2*s1;
  this.mouth.setXY(this.dir,this.x,this.y);
	//this.mouth.sees=-1;

  //set eye location
  for(var i=0;i<5; i++) {
    this.eyes[i].angle=this.outputs[(i*2)+12]*180;
    this.eyes[i].dis=this.outputs[(i*2)+13]*5*s1;
    this.eyes[i].setXY(this.dir, this.x, this.y);
    this.eyes[i].sense=0;
    //this.eyes[i].sees=-1;
  }
}
Animal.prototype.grow=function() {
  if(this.energy < 100000) { // if size less than 10/ energy < 100000
    this.size = Math.ceil(this.energy/1000)/10;  
    /*
    ex. if energy == 99001, round to size = 10
    if energy = 50000, round to size = 5
    if energy = 1, round to size = 0.1
    */

  } else { // if full size has been reached
    if(LIVEPOP<POPCAP) { // if there is room
      var i=0;
      while (animals[i]!=null) {
        if(animals[i].top<SCORESCAP || animals[i].alive==true) {  //Alive clause effectively determines that animal isnt overwriting itself
          i++;
        } else {
          break;
        }
      }
      if(i>HIGHESTINDEX) {
        HIGHESTINDEX=i;
      }
      var mutant=new Animal(this.x,this.y,i); // create new animal
      this.descendants++;
      this.liveDescendants++;
      this.mutate(mutant);
      this.size-=5; // lose enouugh mass to create a new child
      this.size = round(this.size/10)*10;
      this.children.push(i);
      animals[i]=null;
      animals[i]=mutant;
      newest=i;
      LIVEPOP++;

      var ancestor=this.parent_index;
      while(ancestor!=null) {
        if(ancestor>=0) {
          animals[ancestor].descendants++;
          animals[ancestor].liveDescendants++;
          ancestor=animals[ancestor].parent_index;
        } else {
          graveyard[-(ancestor+1)].descendants++;
          graveyard[-(ancestor+1)].liveDescendants++;
          ancestor=graveyard[-(ancestor+1)].parent_index;
        }
      }

      if(scoreType==0){
        this.score=this.children.length;
      }
      while(mutant.gen>=PPG.length){
        // if the is a 7th gen creature but only creatures up to gen 5 have died, create space for new gen
        PPG.push(0);
        FPG.push(0);
        BPG.push(0);
      }
      PPG[mutant.gen]++;
      if(PPG[mutant.gen]>maxPPG){
        maxPPG=PPG[mutant.gen];
      }
      BPG[mutant.gen]+=mutant.brainCost;
      if(BPG[mutant.gen]/PPG[mutant.gen]>maxBPG){
        maxBPG=BPG[mutant.gen]/PPG[mutant.gen];
      }
    }
  }

}
Animal.prototype.decay=function() {
  this.energy= Math.round(10*this.energy)/10; 
  console.log("FLAG!");
	if(this.energy<=0.0) {
		this.alive=false;
		LIVEPOP--;

		if(this.index==HIGHESTINDEX) {
			var i=this.index;
			while(i>-1 && animals[i].alive==false) {
				i--;
			}
			HIGHESTINDEX=i;
		}
    // CHANGE
    var dead = new Animal(this.x, this.y, -(graveyard.length+1)); // set a index to pos in dead array...
		//var dead = new Animal(this.x, this.y, graveyard.length); // set a index to pos in dead array...
		this.grave(dead);

		if(this.parent_index!=null) { //animal needs to tell parent/children its dead... needs to know if parent is alive. If parent dead, parent_index will be negative (-(parent_index+1)).
			if(this.parent_index<0) { //if parent is dead, no worries
				graveyard[-(this.parent_index+1)].children[this.cno]= dead.index;
			} else {
        animals[this.parent_index].children[this.cno]=dead.index;
      }

      var anc = this.parent_index;
      while(anc!=null){
        if(anc>=0){
          animals[anc].liveDescendants--;
          anc = animals[anc].parent_index;
        } else {
          graveyard[-(anc+1)].liveDescendants--;
          anc = graveyard[-(anc+1)].parent_index;
        }
      }
		}

    globalNetNRG+=this.gain;
    netLifespan+=this.age;
    FPG[this.gen]+=(this.posFood/this.netFood);

		graveyard.push(dead);
		for(var i=0, cL=this.children.length; i<cL; i++) {
			if(this.children[i]<0) {
				graveyard[-(this.children[i]+1)].parent_index=dead.index;
			} else {
				animals[this.children[i]].parent_index=dead.index;
			}
		}
		if(highlighted==this.index) {
      // CHANGE
      // highlighted=-(dead.index+1);
			highlighted=dead.index;
			if(display!=1 && display!=2) {
				dashboard.setup();
			}
		}
    if(this.index==newest){
      newest=dead.index;
    }
    if(this.top<SCORESCAP) {
      scores[this.top]=dead.index;
    }

	} else {
		this.energyChange+=this.food-(abs(this.rot)+abs(this.velocity)+this.brainCost+this.size);
		this.energy+=this.energyChange;
    if(this.energyChange>0) {
      this.gain+=this.energyChange;
    }
		if(this.energy>this.maxEnergy) {
			this.maxEnergy=this.energy;
		}
		if(this.food<0){
      this.netFood-=this.food;
		} else {
      this.netFood+=this.food;
      this.posFood+=this.food;
    }
    if(this.netFood!=0){
      aveFER+=(this.posFood/this.netFood)/LIVEPOP; // Add living animals ratio of pos/net FNRG
    }
    aveAge+=this.age/LIVEPOP;
    aveChildren+=(this.children.length)/LIVEPOP;
		//this.energyExchanged=0;
    //this.age++;
		if(this.energyChange>this.maxEnergyChange) {
			this.maxEnergyChange=this.energyChange;
		} else if(this.energyChange<this.minEnergyChange) {
			this.minEnergyChange=this.energyChange;
		}
		this.health=(this.energy-(this.maxEnergy/2))/(this.maxEnergy/2);
    if(scoreType==1){
      this.score=this.age;
    } else if(scoreType==2){
      this.score=round(this.gain);
    }
	}
}

Animal.prototype.learn=function(b) {
  if(this.energyChange>=0) {
    this.lr=this.energyChange/this.maxEnergyChange; // if the animal experienced a net increase in energy, strengthen connections by increasing lr 
  } else {
    this.lr=(-this.energyChange)/this.minEnergyChange;
  }
	this.brainCost=0;
	for(var i=0; i<BRAIN_SIZE; i++) {
		//b[i].bias = b[i].netBias/this.age;
		/*
		for(var j=0; j<BRAIN_SIZE; j++){
			if(b[i].out>0){
				b[i].weights[j]+=b[i].out*b[i].weights[j]*this.lr*0.01;
			} else {
				b[i].weights2[j]+=b[i].out*b[i].weights2[j]*this.lr*0.01;
			}
		}
		*/

	}
}

Animal.prototype.grade=function() {
  for(var i=0, sC=SCORESCAP;i<sC;i++) {
    if(this.top<=i) {
      break;
    } else if(scores[i]==null){
      if(this.top<sC) {
        scores[this.top]=null;
      }
      scores[i]=this.index; //If called from graveyard during resetScore, it should work... no bugs yet
      this.top=i;
      break;
    }else {
      if(scores[i]<0){
        if(this.score>graveyard[-(scores[i]+1)].score) {
          if(this.top<sC) {
            scores[this.top]=null;
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

Animal.prototype.mutate=function(a) {
  a.alive=true;
  a.dir=this.dir;
  a.velDir=this.velDir;
  a.gen=this.gen+1;
  a.x=this.x;
  a.y=this.y;
  a.parent=this.name+"-"+this.gen;
  a.parent_index=this.index;
  a.cno=this.children.length;
  a.name=this.name;

  a.size=STARTSIZE;

  a.energy=a.size*10000;
  a.maxEnergy=a.energy;
  a.velocity=0;
  a.rot=0;

  if(round(Math.random()*2)==2) {
    if(round(Math.random()*(2+1))==2) {
      if(round(Math.random()*(2+2))==2) {
        if(round(Math.random()*(2+3))==2) {
          a.name=ALPH.charAt(round(Math.random()*25))+a.name.charAt(1)+a.name.charAt(2)+a.name.charAt(3);
        } else {
          a.name=a.name.charAt(0)+ALPH.charAt(round(Math.random()*25))+a.name.charAt(2)+a.name.charAt(3);
        }
      } else {
        a.name=a.name.charAt(0)+a.name.charAt(1)+ALPH.charAt(round(Math.random()*25))+a.name.charAt(3);
      }
    } else {
      a.name=a.name.charAt(0)+a.name.charAt(1)+a.name.charAt(2)+ALPH.charAt(round(Math.random()*25));
    }
  }

  for(var i=0; i<BRAIN_SIZE; i++) {
    if(i<6) {
      for(var j=0; j<BRAIN_SIZE; j++){
        if(j>=BRAIN_INPUTS && j<BRAIN_INPUTS+8) {
          a.brain[i].weights[j]=this.brain[i].weights[j];
        }
      }
      a.brain[i].bias=this.brain[i].bias;
      a.brain[i].cost=this.brain[i].cost;
    }
  }
  a.brainCost=this.brainCost;
}
Animal.prototype.grave=function(a) {
  a.alive=false;
  a.gen=this.gen;
  a.x=this.x;
  a.y=this.y;
  a.parent=this.parent;
  a.parent_index=this.parent_index;
  a.cno=this.cno;
  a.name=this.name;
  a.tile=this.tile;
  a.size=this.size;
  a.energy=this.energy;
  a.maxEnergy=this.maxEnergy;
  a.velocity=this.velocity;
  a.rot=this.rot;
  a.dir=this.dir;
  a.velDir=this.velDir;
  a.score=this.score;
  a.age=this.age;
  a.maxEnergyChange = this.maxEnergyChange;
  a.minEnergyChange = this.minEnergyChange;
  for(var i=0;i<this.children.length;i++) {
    a.children.push(this.children[i]);
  }
  a.descendants=this.descendants;
  a.liveDescendants=this.liveDescendants;
  a.proGenes=this.proGenes;
  a.conGenes=this.conGenes;
  a.dmgCaused=this.dmgCaused;
  a.dmgReceived=this.dmgReceived;
  a.health=this.health;
  a.netFood=this.netFood;
  a.posFood=this.posFood;

  a.food=this.food;
  a.energyChange=this.energyChange;
  a.gain= this.gain;

  for(var i=0; i<5; i++) {
    a.eyes[i]=new Eye(a.x,a.y);
    a.eyes[i].angle=this.eyes[i].angle;
    a.eyes[i].dis=this.eyes[i].dis;
    a.eyes[i].x=this.eyes[i].x;
    a.eyes[i].y=this.eyes[i].y;
    a.eyes[i].r=this.eyes[i].r;
    a.eyes[i].g=this.eyes[i].g;
    a.eyes[i].b=this.eyes[i].b;
    a.eyes[i].sense=this.eyes[i].sense;
  }

  a.mouth.dis=this.mouth.dis;
  a.mouth.angle=this.mouth.angle;
  a.mouth.x=this.mouth.x;
  a.mouth.y=this.mouth.y;
  a.mouth.tile=this.mouth.tile;
  a.mouth.r=this.mouth.r;
  a.mouth.g=this.mouth.g;
  a.mouth.b=this.mouth.b;
  a.mouth.sense=this.mouth.sense;

  for(var i=0; i<BRAIN_SIZE; i++) {
    a.brain[i].cost=this.brain[i].cost;
    a.brain[i].in=this.brain[i].in;
    a.brain[i].out=this.brain[i].out;
    for(var j=0;j<BRAIN_SIZE; j++) {
      a.brain[i].weights[j]=this.brain[i].weights[j];
    }
    a.brain[i].bias=this.brain[i].bias;
  }
  a.brainCost=this.brainCost;
  for(var i=0;i<BRAIN_OUTPUTS;i++) {
    a.outputs[i]=this.outputs[i];
  }

  a.red=this.red;
  a.green=this.green;
  a.blue=this.blue;
  a.netRed=this.netRed;
  a.netGreen=this.netGreen;
  a.netBlue=this.netBlue;
  for(var i=0;i<15;i++){
    a.cols[i]=this.cols[i];
  }
}
Animal.prototype.clone=function(a) {
  a.alive=true;
  a.gen=this.gen+1;
  a.x=this.x;
  a.y=this.y;
  a.parent=this.name+"-"+this.gen;
  a.parent_index=this.index;
  a.cno=this.children.length;
  a.name=this.name;
  a.tile=this.tile;
  a.size=STARTSIZE;

  a.energy=a.size*10000;
  a.maxEnergy=this.energy;
  a.velocity=this.velocity;
  a.rot=this.rot;
  a.dir=this.dir;
  a.velDir=this.velDir;

  a.health=this.health;
  a.food=this.food;
  a.energyChange=this.energyChange;

  for(var i=0; i<5; i++) {
    a.eyes[i]=new Eye(a.x,a.y);
  }

  for(var i=0; i<BRAIN_SIZE; i++) {
    for(var j=0; j<BRAIN_SIZE; j++) {
      a.brain[i].weights[j]=this.brain[i].weights[j];
    }
    a.brain[i].cost=this.brain[i].cost;
    a.brain[i].bias=this.brain[i].bias;
  }
  a.brainCost= this.brainCost;
}
Animal.prototype.kill=function() {
  if(this.alive==true){
    this.energy=-1;
  }
}
Animal.prototype.reincarnate=function() {
  if(this.alive==false){
    if(LIVEPOP<POPCAP) {
      var i=0;
      while (animals[i]!=null) {
        if(animals[i].top<SCORESCAP || animals[i].alive==true) {  //Alive clause effectively determines that animal isnt overwriting itself
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
      this.liveDescendants++;
      this.children.push(i);

      animals[i]=null;
      animals[i]=rein;

      newest=i;
      LIVEPOP++;
      var ancestor=this.parent_index;
      while(ancestor!=null) {
        if(ancestor>=0) {
          animals[ancestor].descendants++;
          animals[ancestor].liveDescendants++;
          ancestor=animals[ancestor].parent_index;
        } else {
          graveyard[-(ancestor+1)].descendants++;
          graveyard[-(ancestor+1)].liveDescendants++;
          ancestor=graveyard[-(ancestor+1)].parent_index;
        }
      }
      highlighted= rein.index;
    }
  }
}

// Show stats and tracking for a selected animal.
Animal.prototype.highlight=function() {
  if(this.alive==false) {
    this.draw(this.cols);
  }
  var s = this.size;

  // DRAW HIGHLIGHT INFO
  ctx2.beginPath();
  ctx2.fillStyle="#FFFFFF";
  ctx2.strokeStyle="#FFFFFF";
  ctx2.strokeRect(this.x-(2*s), this.y-(2*s), s*4, s*4);
  var oriX=this.x+(this.size*Math.cos(this.dir*DEG_TO_RAD));
  var oriY=this.y+(this.size*Math.sin(this.dir*DEG_TO_RAD));
  ctx2.moveTo(this.x,this.y);
  ctx2.lineTo(oriX, oriY);
  //ctx2.lineTo(oriX+(this.rot*this.size*Math.cos((this.dir+90)*DEG_TO_RAD)),oriY+(this.rot*this.size*Math.sin((this.dir+90)*DEG_TO_RAD)));
  ctx2.stroke();

  ctx2.beginPath();
  ctx2.strokeStyle="#FF0000";
  var velX=this.x+(this.velocity*2*Math.cos((this.velDir)*DEG_TO_RAD));
  var velY=this.y+(this.velocity*2*Math.sin((this.velDir)*DEG_TO_RAD));
  ctx2.moveTo(this.x,this.y);
  ctx2.lineTo(velX, velY);
  ctx2.lineTo(velX+(this.rot*2*Math.cos((this.velDir+90)*DEG_TO_RAD)),velY+(this.rot*2*Math.sin((this.velDir+90)*DEG_TO_RAD)));
  ctx2.stroke();

  ctx2.strokeStyle="#FFFFFF";
  if(mouseOverMap && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50) {
    for(var i=0;i<5;i++) {
      ctx2.beginPath();
      ctx2.arc(round(this.eyes[i].x),round(this.eyes[i].y), round(this.size/5), 0, TWOPI);
      ctx2.fillText("E"+(i+1), this.eyes[i].x+(s/2), this.eyes[i].y-(s/2));
      ctx2.stroke();
    }
  }
  var posx=this.x+(2*s);
  var posy=this.y-(2*s);
  if(this.alive==true) {
    ctx2.fillText(this.name+"-"+this.gen+(this.alive==true ? "A":"D")+this.children.length,posx, posy+2);
  }
  posy+=10;
  if(this.outputs[2]<-0.80) {
    ctx2.fillText("CARN+++",posx,posy);
  } else if(this.outputs[2]<-0.50) {
    ctx2.fillText("CARN++",posx,posy);
  } else if(this.outputs[2]<-0.20) {
    ctx2.fillText("CARN+",posx,posy);
  } else if(this.outputs[2]>=0.80) {
    ctx2.fillText("HERB+++",posx,posy);
  } else if(this.outputs[2]>=0.50) {
    ctx2.fillText("HERB++",posx,posy);
  } else if(this.outputs[2]>=0.20) {
    ctx2.fillText("HERB+",posx,posy);
  } else {

  }
  posy+=10;
  if(this.outputs[3]<-0.33) {
    ctx2.fillText("EATR",posx,posy);
  } else if(this.outputs[3]>=0.33) {
    ctx2.fillText("EATG",posx,posy);
  } else {
    ctx2.fillText("EATB",posx,posy);
  }

  if(display==0) { // MAIN stat display card
    ctx4.beginPath();
    ctx4.fillStyle=rgbToHex(this.cols[0],this.cols[1],this.cols[2]);
    ctx4.fillRect(200,200,400,200);
    posx=210;
    posy=210;
    ctx4.fillStyle= "#FFFFFF";
    if(this.red/this.netFood>0.5 || this.green/this.netFood>0.5 || this.blue/this.netFood>0.5) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive==true) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    ctx4.fillText("IDX: "+this.index,posx,posy+=10);

    if(this.parent!=null) {
      if(this.parent_index<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+graveyard[(-(this.parent_index+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.parent_index].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent_index;
            leftPressed=false;
          }
        }
      }
    }
    if(this.cno!=null){
      ctx4.fillText("CNO: "+(this.cno+1),posx,posy+=10);
    }
    ctx4.fillText("DESC: "+this.liveDescendants+"/"+this.descendants,posx,posy+=10);
    ctx4.fillText("PRO/CON: "+this.proGenes+"/"+this.conGenes,posx,posy+=10);

    posy+=10;
    ctx4.fillText("NRG: "+this.energy,posx,posy+=10);
    ctx4.fillText("NETNRG: "+round(this.gain),posx,posy+=10);
    ctx4.fillText("TOP: "+round(this.top),posx, posy+=10);
    ctx4.fillText("B$: "+(round(1000*this.brainCost)/1000),posx,posy+=10);
    posy+=10;
    ctx4.fillText("POS: "+round(this.x)+", "+round(this.y),posx,posy+=10);
    ctx4.fillText("DIR: "+round(this.dir*10)/10,posx, posy+=10);
    ctx4.fillText("VEL: "+round(this.velocity*10)/10,posx, posy+=10);
    ctx4.fillText("ROT: "+round(this.rot*10)/10,posx, posy+=10);
    ctx4.fillText("HLTH: "+round(100*this.health)/100, posx,posy+=10);
    ctx4.fillText("AGE: "+this.age, posx,posy+=10);

    posx+=100;
    posy=210;
    ctx4.fillText("SIZE: "+this.size, posx, posy+=10);
    posy+=10;
    ctx4.fillText(">>DMG: "+round(this.dmgReceived*100)/100,posx,posy+=10);
    ctx4.fillText("DMG>>: "+round(this.dmgCaused*100)/100,posx,posy+=10);
    posy+=10;
    if(this.outputs[2]<-0.80) {
      ctx4.fillText("CARN++",posx,posy+=10);
    } else if(this.outputs[2]<-0.5) {
      ctx4.fillText("CARN+",posx,posy+=10);
    } else if(this.outputs[2]<-0.20) {
      ctx4.fillText("CARN",posx,posy+=10);
    } else if(this.outputs[2]>=0.80) {
      ctx4.fillText("HERB++",posx,posy+=10);
    } else if(this.outputs[2]>=0.50) {
      ctx4.fillText("HERB+",posx,posy+=10);
    } else if(this.outputs[2]>=0.20) {
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
    ctx4.fillText("ECH+: "+(round(this.maxEnergyChange*100)/100),posx,posy+=10);
    ctx4.fillText("ECH-: "+(round(this.minEnergyChange*100)/100),posx,posy+=10);
    ctx4.fillText("POSFNRG: "+(round(this.posFood*100)/100),posx,posy+=10);
    ctx4.fillText("NETFNRG: "+(round(this.netFood*100)/100)+" ("+ round(100*this.netRed/this.netFood)+"% R, "+round(100*this.netGreen/this.netFood)+"% G, "+round(100*this.netBlue/this.netFood)+"% B)",posx,posy+=10);
    ctx4.fillText("FER: "+(round(this.posFood*100/this.netFood)/100),posx,posy+=10);
    posx+=100;
    posy=210;
    //ctx4.fillText("MTILE: "+this.mouth.tile+" MPOS: "+round(this.mouth.x)+", "+round(this.mouth.y), posx, posy+=10);
    ctx4.fillText((this.mouth.sees==1 ? "M ":"")+(this.eyes[0].sees==1 ? "E1 ":"")+(this.eyes[1].sees==1 ? "E2 ":"")+(this.eyes[2].sees==1 ? "E3 ":"")+(this.eyes[3].sees==1 ? "E4 ":"")+(this.eyes[4].sees==1 ? "E5 ":""), posx, posy+=10);
    ctx4.fillText("R: "+round(this.red)+"/"+round(this.netRed)+" ("+round(100*this.red/this.netRed)+"%)", posx, posy+=10);
    ctx4.fillText("G: "+round(this.green)+ "/"+round(this.netGreen)+" ("+round(100*this.green/this.netGreen)+"%)", posx, posy+=10);
    ctx4.fillText("B: "+round(this.blue)+ "/"+round(this.netBlue)+" ("+round(100*this.blue/this.netBlue)+"%)", posx, posy+=10);
    ctx4.fillStyle= rgbToHex(this.cols[12],this.cols[13],this.cols[14]);
    ctx4.fillRect(200,200,10,10);
    ctx4.fillRect(220,200,10,10);
    ctx4.fillRect(240,200,10,10);
    ctx4.fillRect(260,200,10,10);
    ctx4.fillRect(280,200,10,10);
    ctx4.fillRect(300,200,10,10);
    ctx4.fillStyle=rgbToHex(this.cols[9],this.cols[10],this.cols[11]);
    ctx4.fillText("X",201,209);
    ctx4.fillText("B",221,209);
    ctx4.fillText("F",241,209);
    ctx4.fillText("M",261,209);
    ctx4.fillText("R",281,209);
    ctx4.fillText("K",301,209);

    if(mouseOverConsole && leftPressed) {
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
    ctx3.fillRect(0,0,DASHX,DASHY);
    ctx3.fillStyle="#A0A0A0"
    ctx3.fillRect(0,0,10,10);
    ctx3.fillStyle="#606060"
    ctx3.fillText("X",1,9);
    ctx3.fillStyle=rgbToHex(round(255*this.red/this.netFood),round(255*this.green/this.netFood),round(255*this.blue/this.netFood));
    ctx3.arc(40,40, 25, 0, TWOPI);
    ctx3.fill();
    ctx3.fillStyle="#FFFFFF";

    posx=120;
    posy=30;
    var spcx=60;
    var spcy=22;

    ctx3.fillStyle= "#FFFFFF";
    if(this.red/this.netFood>0.5 || this.green/this.netFood>0.5 || this.blue/this.netFood>0.5) {
      ctx3.fillStyle= "#000000";
    }
    ctx3.beginPath();
    posx=5;
    posy=80;
    ctx3.fillText("FOOD", posx, posy+=spcy);
    ctx3.fillText("ECHG",posx, posy+=spcy);
    ctx3.fillText("MR",posx, posy+=spcy);
    ctx3.fillText("MG",posx, posy+=spcy);
    ctx3.fillText("MB",posx, posy+=spcy);
    ctx3.fillText("MSEN",posx, posy+=spcy);
    ctx3.fillText("HLTH", posx, posy+=spcy);
    ctx3.fillText("SIZE", posx, posy+=spcy);
    ctx3.fillText("VEL", posx, posy+=spcy);
    for(var i=0; i<5; i++) {
      ctx3.fillText("E"+(i+1)+"R",posx,posy+=spcy);
      ctx3.fillText("E"+(i+1)+"G",posx,posy+=spcy);
      ctx3.fillText("E"+(i+1)+"B",posx,posy+=spcy);
      ctx3.fillText("E"+(i+1)+"SEN",posx,posy+=spcy);
    }
    display=2;
  } else if(display==3) { // FAMILY
    posx=210;
    posy=210;
    ctx4.beginPath();
    ctx4.fillStyle=rgbToHex(round(255*this.red/this.netFood),round(255*this.green/this.netFood),round(255*this.blue/this.netFood));
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= rgbToHex(this.cols[12],this.cols[13],this.cols[14]);
    ctx4.fillRect(200,200,10,10);
    ctx4.fillStyle= rgbToHex(this.cols[9],this.cols[10],this.cols[11]);
    ctx4.fillText("X",201,209);
    ctx4.fillStyle= "#FFFFFF";
    if(this.red/this.netFood>0.5 || this.green/this.netFood>0.5 || this.blue/this.netFood>0.5) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive==true) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    ctx4.fillText("IDX: "+this.index,posx,posy+=10);
    if(this.parent!=null) {
      if(this.parent_index<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+graveyard[(-(this.parent_index+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.parent_index].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent_index;
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
        ctx4.fillText(graveyard[(-(this.children[i]+1))].name+"-"+graveyard[(-(this.children[i]+1))].gen+"D"+graveyard[(-(this.children[i]+1))].children.length,posx, posy+=10);
      } else {
        ctx4.fillText(animals[this.children[i]].name+"-"+animals[this.children[i]].gen+"A"+animals[this.children[i]].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.children[i];
            leftPressed=false;
          }
        }
      }
    }


    if(mouseOverConsole && leftPressed) {
      if(mouseX>200 && mouseX<210 && mouseY>200 && mouseY<210) {
        display=0;
        leftPressed=false;
      }
    }
  } else if(display==4) { // EMPTY (UNUSED!)
    posx=210;
    posy=210;
    ctx4.beginPath();
    ctx4.fillStyle=rgbToHex(round(255*this.red/this.netFood),round(255*this.green/this.netFood),round(255*this.blue/this.netFood));
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= rgbToHex(this.cols[12],this.cols[13],this.cols[14]);
    ctx4.fillRect(200,200,10,10);
    ctx4.fillStyle= rgbToHex(this.cols[9],this.cols[10],this.cols[11]);
    ctx4.fillText("X",201,209);
    ctx4.fillStyle= "#FFFFFF";
    if(this.red/this.netFood>0.5 || this.green/this.netFood>0.5 || this.blue/this.netFood>0.5) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive==true) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    if(this.parent!=null) {
      if(this.parent_index<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+graveyard[(-(this.parent_index+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.parent_index].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent_index;
            leftPressed=false;
          }
        }
      }
    }

    if(mouseOverConsole && leftPressed) {
      if(mouseX>200 && mouseX<210 && mouseY>200 && mouseY<210) {
        display=0;
        leftPressed=false;
      }
    }
  }
  //Leave display 2 separate from above else-ifs to ensure immediate dashboard display switching between profiles
  if(display==2) {
    posx=120;
    posy=30;
    var spcx=60;
    var spcy=22;

    ctx4.fillStyle= "#FFFFFF";
    if(this.red/this.netFood>0.5 || this.green/this.netFood>0.5 || this.blue/this.netFood>0.5) {
      ctx4.fillStyle= "#000000";
    }

    posx=10;
    posy=10;
    if(this.alive==true) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    if(this.parent!=null) {
      if(this.parent_index<0) {
        ctx4.fillText("PAR: "+this.parent+"D"+graveyard[(-(this.parent_index+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+this.parent+"A"+animals[this.parent_index].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent_index;
            display=1;
            leftPressed=false;
          }
        }
      }
    }
    ctx4.fillText("NRG: "+round(100*this.energy)/100, posx, posy+=10);

    spcy=22;
    posx=552;
    posy=104;
    if(this.outputs[0]>0.2) {
      ctx4.fillText("VEL++", posx,posy);
    } else if(this.outputs[0]<-0.2) {
      ctx4.fillText("VEL--", posx,posy);
    }
    posy+=spcy;
    if(this.outputs[1]>0.2) {
      ctx4.fillText("ROT++", posx,posy);
    } else if(this.outputs[1]<-0.2) {
      ctx4.fillText("ROT--", posx,posy);
    }
    posy+=spcy;
    if(this.outputs[2]<-0.33) {
      ctx4.fillText("CARN", posx,posy);
    } else if(this.outputs[2]>=0.33){
      ctx4.fillText("HERB", posx,posy);
    }
    posy+=spcy;
    if(this.outputs[3]<-0.80) {
      ctx4.fillText("EATR--",posx,posy);
    } else if(this.outputs[3]<-0.5) {
      ctx4.fillText("EATR-",posx,posy);
    } else if(this.outputs[3]<-0.20) {
      ctx4.fillText("EATR",posx,posy);
    } else if(this.outputs[3]>=0.80) {
      ctx4.fillText("EATR++",posx,posy);
    } else if(this.outputs[3]>=0.50) {
      ctx4.fillText("EATR+",posx,posy);
    } else if(this.outputs[3]>=0.20) {
      ctx4.fillText("EATR",posx,posy);
    }
    posy+=spcy;
    if(this.outputs[4]<-0.80) {
      ctx4.fillText("EATG--",posx,posy);
    } else if(this.outputs[4]<-0.5) {
      ctx4.fillText("EATG-",posx,posy);
    } else if(this.outputs[4]<-0.20) {
      ctx4.fillText("EATG",posx,posy);
    } else if(this.outputs[4]>=0.80) {
      ctx4.fillText("EATG++",posx,posy);
    } else if(this.outputs[4]>=0.50) {
      ctx4.fillText("EATG+",posx,posy);
    } else if(this.outputs[4]>=0.20) {
      ctx4.fillText("EATG",posx,posy);
    }
    posy+=spcy;
    if(this.outputs[5]<-0.80) {
      ctx4.fillText("EATB--",posx,posy);
    } else if(this.outputs[5]<-0.5) {
      ctx4.fillText("EATB-",posx,posy);
    } else if(this.outputs[5]<-0.20) {
      ctx4.fillText("EATB",posx,posy);
    } else if(this.outputs[5]>=0.80) {
      ctx4.fillText("EATB++",posx,posy);
    } else if(this.outputs[5]>=0.50) {
      ctx4.fillText("EATB+",posx,posy);
    } else if(this.outputs[5]>=0.20) {
      ctx4.fillText("EATB",posx,posy);
    }
    posy+=spcy;

    if(this.outputs[6]>=0.33) {
      ctx4.fillText("MITO",posx,posy);
    }else if(this.outputs[6]>-0.33){
      ctx4.fillText("GROW",posx,posy);
    }
    ctx4.fillText("VDIR",posx,posy+=spcy);
    posy+=spcy;
    ctx4.fillText("MDR",posx,posy+=spcy);
    ctx4.fillText("MDS",posx,posy+=spcy);
    posy+=spcy;
    for(var i=0; i<5; i++) {
      ctx4.fillText("E"+i+"DR",posx,posy+=spcy);
      ctx4.fillText("E"+i+"DS",posx,posy+=spcy);
    }

    var neu=null;
    var idx=null;
    var currNeuron;
    posx=55;
    spcx=60;
    posy=100;
    for(var j=0; j<BRAIN_SIZE; j++) { // iterate through each neuron
      if(j==BRAIN_INPUTS){ // after all brain input neurons drawn, draw output neurons on far right
        posx=540;
        posy=100;
      } else if(j==BRAIN_INPUTS+BRAIN_OUTPUTS){
        posx=200;
        posy=100;
      } else if(j==BRAIN_INPUTS+BRAIN_OUTPUTS+16){
        posx=280;
        posy=100;
      } else if(j==BRAIN_INPUTS+BRAIN_OUTPUTS+32){
        posx=360;
        posy=100;
      } else if(j==BRAIN_INPUTS+BRAIN_OUTPUTS+48){
        posx=440;
        posy=100;
      }
      //if(j<BRAIN_INPUTS+BRAIN_OUTPUTS){
        currNeuron=this.brain[j];
        var oS;
        oS=currNeuron.out;
        oS=round(255*(oS+1)/2);
        if(oS>255){
          oS=255;
        } else if(oS<0){
          oS=0;
        }

        //DRAW NEURON
        ctx4.fillStyle=rgbToHex(oS,oS,oS);
        ctx4.beginPath();
        ctx4.arc(posx, posy, 8, 0, TWOPI);
        ctx4.fill();
        ctx4.beginPath();
        if(oS>127){
          ctx4.fillStyle="#000000";
        } else {
          ctx4.fillStyle="#FFFFFF";
        }
        if(mouseOverConsole && mouseX>posx-100 && mouseX<posx+100 && mouseY>posy-100 && mouseY<posy+100) {
          ctx4.fillText(round(100*currNeuron.in)/100, posx-10, posy-2);
          ctx4.fillText(round(100*currNeuron.out)/100, posx-10, posy+8);
        }
        if(mouseOverConsole && mouseX>posx-10 && mouseX<posx+10 && mouseY>posy-10 && mouseY<posy+10) {
          if(leftPressed || rightPressed) {
            neu=this.brain[j];
            idx=j;
          }
        }
      //}
      posy+=spcy;
    }

    posy=60;
    if(neu!=null) { // SEE MUTATIONS
      if(leftPressed) {
        var posy2=30;
        ctx4.fillStyle="#FFFFFF";
        ctx4.fillRect(10,10,580,980);
        ctx4.fillStyle="#323232";
        ctx4.fillText("N"+idx,20,posy2);
        ctx4.fillText("$: "+round(neu.cost*1000)/1000,20, posy2+=10);
        /*
        ctx4.fillStyle="#00AA00";
        ctx4.fillText(round(1000*this.getAdvantageousMutations(2,idx,0))/1000,80,posy2);
        ctx4.fillStyle="#AA0000";
        ctx4.fillText(round(1000*this.getDetrimentalMutations(2,idx,0))/1000,120,posy2);
        */
        ctx4.fillStyle="#323232";
        ctx4.fillText("BIAS: "+round(1000*neu.bias)/1000,20,posy2+=10);

        /*
        ctx4.fillStyle="#00AA00";
        ctx4.fillText(round(1000*this.getAdvantageousMutations(1,idx,0))/1000,90,posy2);
        ctx4.fillStyle="#AA0000";
        ctx4.fillText(round(1000*this.getDetrimentalMutations(1,idx,0))/1000,130,posy2);
        */
        ctx4.fillStyle="#323232";
        ctx4.fillText("WEIGHTS:",20,posy2+=10);
        posx=20;
        for(var i=0; i<BRAIN_SIZE; i++) {
          ctx4.fillText(i+":  "+round(1000*neu.weights[i])/1000, posx, posy2+=10);
          if(i%30==0 && i!=0){
            posx+=160;
            posy2=posy;
          }
        }
        /*
        posx=70;
        posy2=posy;
        ctx4.fillStyle="#00AA00"; // positive direction
        for(var i=0; i<BRAIN_SIZE; i++) {
          ctx4.fillText(round(1000*this.getAdvantageousMutations(0,idx,i))/1000, posx, posy2+=10);
          if(i==50){
            posx=220;
            posy2=posy;
          }
        }
        posx=120;
        posy2=posy;
        ctx4.fillStyle="#AA0000"; // negative direction
        for(var i=0; i<BRAIN_SIZE; i++) {
          ctx4.fillText(round(1000*this.getDetrimentalMutations(0,idx,i))/1000,posx,posy2+=10);
          if(i==50){
            posx=270;
            posy2=posy;
          }
        }
        */
      }
    }

    if(mouseOverConsole && leftPressed && mouseX>0 && mouseX<10 && mouseY>0 && mouseY<10) {
      display=0;
      dashboard.setup();
      leftPressed=false;
    }
  }
}
