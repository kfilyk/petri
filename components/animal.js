var START_SIZE=1;
var MAX_SIZE=20;
var BRAIN_SIZE=50; //number of neurons
var NUM_INPUT_NEURONS=30;
var NUM_OUTPUT_NEURONS=35; 
var EATING_CONSTANT=2;

class Animal {
  constructor(x, y, index ) {
    this.index=index;
    this.x=x;
    this.y=y;
    this.alive=true;
    this.tile=null;
    this.size=START_SIZE;
    this.health=0;
    this.gen=0;
    this.parent=null;
    this.sibling_idx=null;
    this.children=[];
    this.descendants=0;
    this.proGenes=0;
    this.conGenes=0;
    this.name=namer();
    this.velocity=0; 
    this.rotation=0;
    this.direction=round(Math.random()*360); // facing direction
    this.eyes=new Array(5);
    for(var i=0;i<5;i++) {
      this.eyes[i] = new Eye(this.x, this.y);
    }
    this.mouth=new Mouth(this.x, this.y);
    this.eaten=0;
    this.redEaten=0.003;
    this.greenEaten=0.003;
    this.blueEaten=0.003;
    this.netEaten=1;
    
    this.inputs=new Array(NUM_INPUT_NEURONS);
    this.outputs=new Array(NUM_OUTPUT_NEURONS);
  
    for(var i=0; i<NUM_INPUT_NEURONS; i++) { // fill with empty neurons
      this.inputs[i] = new Neuron(); // neuron will be created with number of weights equal to outputs+hiddens
      this.inputs[i].init(NUM_OUTPUT_NEURONS, 8); // 30 inputs, 20 outputs - start without controlling direction &distance of eyes, mouth (12)
      //this.inputs[i].createDeltas(NUM_OUTPUT_NEURONS); 

    }

    for(var i=0; i<NUM_OUTPUT_NEURONS; i++) { // fill with empty neurons
      this.outputs[i] = new Neuron(); // no weights; exist only to calculate output
      this.outputs[i].init(NUM_OUTPUT_NEURONS, 0); // start output neurons with empty weights linking to other output neurons
      //this.outputs[i].createDeltas(NUM_OUTPUT_NEURONS); 
    }
  
    this.energy=START_SIZE*1000;
    this.maxEnergy=this.energy;
    this.energyChange=0;
  
  
    this.totalEnergyGain=0;
    this.damage=0;
    this.damageReceived=0;
    this.damageCaused=0;
    this.cols = new Uint8ClampedArray(9);
    this.lr=0;
  }
}


// sense map + other animals in vicinity of mouth, eyes
Animal.prototype.sense=function() {

  // reset mouth, eyes seeing other animals. if mouth, eyes over border of map: tell creature that there is no food there (r, g, b = -1)

  // set tile of mouth, eyes
  var s1=this.size;
  this.mouth.sense()

  for(var i=0; i<5; i++) { // set  tile  visible to eye
    this.eyes[i].sense()
  }
  /*
  (s1/4)= radius of mouth
  */
  for(var j=0; j<=HIGHESTINDEX; j++) { // loop through all living animals
    if(animals[j].alive==true && (j!=this.index)) {
      if(this.mouth.sees==-1) { 
        // if this creatures mouth intercepts bounding box of another creature body
        if(abs(this.mouth.x-animals[j].x) <= ((animals[j].size/2)+(s1/4)) && abs(this.mouth.y-animals[j].y) <= ((animals[j].size/2)+(s1/4))) {
          this.mouth.s=((2*animals[j].size)/MAX_SIZE)-1;
          this.mouth.r=(animals[j].outputs[3].out); // get red of other creature
          this.mouth.g=(animals[j].outputs[4].out); // get green of other creature
          this.mouth.b=(animals[j].outputs[5].out); // get blue of other creature
          this.mouth.sees=j; // record what animal has been seen. could have a concurrency problem IFF the creature dies before eat sequence- could hurt a new creature which took the spot of the old one. Fix this later
        }
      }

      for(var i=0; i<5; i++) {
        if(this.eyes[i].sees==-1) {
          if(abs(this.eyes[i].x-animals[j].x) <= (s1/4)+animals[j].size/2 && abs(this.eyes[i].y-animals[j].y) <= (s1/4)+animals[j].size/2) {
            this.eyes[i].s=((2*animals[j].size)/MAX_SIZE)-1;
            this.eyes[i].r=(animals[j].outputs[3].out); // get red of other creature
            this.eyes[i].g=(animals[j].outputs[4].out); // get green of other creature
            this.eyes[i].b=(animals[j].outputs[5].out); // get blue of other creature
            this.eyes[i].sees=j;
          }
        }
      }
    }
  }
}

Animal.prototype.move=function() {
  // smallest creature max damage: 15
  // largest creature max damage: 300
  this.velocity=this.outputs[0].out*5/(1+this.damage/this.size); 
  this.rotation=this.outputs[1].out*45/(1+this.damage/this.size); 
  
  this.direction+=this.rotation;

  if(this.direction<0) {
    this.direction+=360;
  } else if(this.direction>359) {
    this.direction-=360;
  }

  this.x+=this.velocity*Math.cos(this.direction*DEG_TO_RAD);
  this.y+=this.velocity*Math.sin(this.direction*DEG_TO_RAD);

  // if map boundary hit
	if(this.x<0 || this.x>=FIELDX) {
		if(this.x<0) {
			this.x=0;
		} else {
			this.x=FIELDX-1;
		}
    this.velocity = 0;  // -2 acts as a flag
	}
	if(this.y<0 || this.y>=FIELDY) {
		if(this.y<0) {
			this.y=0;
		} else {
			this.y=FIELDY-1;
		}
    this.velocity = 0;
	}

	//update current tile this creature is on
	var ct=((~~(this.y/25)*40)+(~~(this.x/25)));
	if(ct>=1600) {
		this.tile=1599;
	} else if (ct<0) {
		this.tile= 0;
	}
	this.tile=ct;

  // set mouth x, y using x,y plane coord. system rather than distance, rotation coord. sys used by movement
  this.mouth.move(this.direction, this.x, this.y, this.outputs[8].out*2*this.size, this.outputs[9].out*2*this.size);
  for(var i=0;i<5; i++) {
    this.eyes[i].move(this.direction, this.x, this.y, this.outputs[(i*2)+10].out*5*this.size, this.outputs[(i*2)+11].out*5*this.size);
  }
}

// dictates rules for animals consuming tiles or other creatures 
Animal.prototype.eat=function() {
  var s1=this.size;
  this.eaten=0;
  var r = 0;
  var g = 0;
  var b = 0;

  if(this.mouth.sees!=-1){ // sees an animal - is this strictly an alive animal currently? hopefully
    prey = animals[this.mouth.sees]; // the animal seen
    if(prey.alive==true) {
      
      // CARNIVORE RGB INTERACTION * ([PREY RGB INTERACTION]+1)/2 * SIZE * 5. 
      // Also, (abs(prey.outputs[3].out)+1) is used so that a creature that is not 'interacting' with its environment still can be eaten: not invisible! 
      // Furthermore, when a creature eats another creature who is fully 'grazing' on tiles, that creature receives the MOST amount of damage- akin to 'letting ones guard down'
      r = this.outputs[3].out > 0 ? 0 : -this.outputs[3].out*(abs(prey.outputs[3].out)+1)*s1*EATING_CONSTANT;
      g = this.outputs[4].out > 0 ? 0 : -this.outputs[4].out*(abs(prey.outputs[4].out)+1)*s1*EATING_CONSTANT;
      b = this.outputs[5].out > 0 ? 0 : -this.outputs[5].out*(abs(prey.outputs[5].out)+1)*s1*EATING_CONSTANT;

        // if food has been properly eaten, increase the red/green/blue eaten tallies
      this.redEaten+=r;
      this.greenEaten+=g;
      this.blueEaten+=b;
      this.eaten=r+g+b;
      this.netEaten += this.eaten;
      prey.damage += this.eaten; // energy exchanged with interacted creature. could receive damage from multiple, so +=
      prey.damageReceived += this.eaten;  // how much damage has been taken by this creature over lifetime; this doesn't reset
      this.damageCaused += this.eaten;
    }
    
  } else if(this.mouth.tile!=null) { // herbivore if the mouth is actually over a tile
    var t = this.mouth.tile;
    
    // HERBIVORE COL INTERACTION * SIZE * COL EQUALIZATION VAR
    r = this.outputs[3].out < 0 ? 0 : this.outputs[3].out*s1*EATING_CONSTANT; 
    g = this.outputs[4].out < 0 ? 0 : this.outputs[4].out*s1*EATING_CONSTANT; 
    b = this.outputs[5].out < 0 ? 0 : this.outputs[5].out*s1*EATING_CONSTANT; 
    
    if(isNaN(this.outputs[3].out) || isNaN(this.outputs[4].out) || isNaN(this.outputs[5].out)){
      console.log("NAN OUTPUT")
    }

    // food is removed from tile. could go into the negative: halt further reduction if @ -XCap. Because tile colouration is predominantly green, adjust so that red, blue tiles lose less food per consumption, to make RGB equal
    tiles[t].R > -tiles[t].RCap ? tiles[t].R-= r/1.5 : null;
    tiles[t].G > -tiles[t].GCap ? tiles[t].G-= g : null;
    tiles[t].B > -tiles[t].BCap ? tiles[t].B-= b/2 : null;
  
    if(isNaN(tiles[t].R) || isNaN(tiles[t].G) || isNaN(tiles[t].B)){
      console.log("NAN TILE RGB")

    }
    // multiply final food retrieved by amount of food on tile. If there a negative amount of food, it is poisonous to the creature.
    r *= tiles[t].R/tiles[t].RCap;
    g *= tiles[t].G/tiles[t].GCap;
    b *= tiles[t].B/tiles[t].BCap;

    if(r> 0) {this.redEaten+=r; }
    if(g> 0) {this.greenEaten+=g; }
    if(b> 0) {this.blueEaten+=b; }

    this.netEaten += abs(r); 
    this.netEaten += abs(g);
    this.netEaten += abs(b);
    this.eaten=r+g+b; 
  } else {
    // if not on mouth tile - if the creature is stuck on the edge of the map- too bad, its slightly poisonous also. incentive to not be lazy
    this.eaten = -1;
  }

}

Animal.prototype.draw=function(c){
  //var opacity = round(255*((abs(this.outputs[3].out) + abs(this.outputs[4].out) + abs(this.outputs[5].out))/3))
  // total = this.outputs[3].out+this.outputs[4].out+this.outputs[5].out

  c[0] = 50+round(abs(this.outputs[3].out)*205); // what its planning to eat
  c[1] = 50+round(abs(this.outputs[4].out)*205);
  c[2] = 50+round(abs(this.outputs[5].out)*205);

  //c[3]= round(255*this.redEaten/this.netEaten); // at most, red, green or blue is 1/3 * netEaten 
  //c[4]= round(255*this.greenEaten/this.netEaten);
  //c[5]= round(255*this.blueEaten/this.netEaten);
  c[3]=c[0]+40;
  c[4]=c[1]+40;
  c[5]=c[2]+40;
  c[6]=c[0]+80;
  c[7]=c[1]+80;
  c[8]=c[2]+80;



  //draw eyes
  //ctx2.strokeStyle=rgbToHex(c[6],c[7],c[8]);
  ctx2.fillStyle=rgbToHex(c[6],c[7],c[8]);
  for(var i=0; i<5; i++) {
    ctx2.beginPath();
    ctx2.arc(this.eyes[i].x,this.eyes[i].y, this.size/8, 0, TWOPI); // eyes are 1/5 size of body
    //ctx2.stroke();
    ctx2.fill();
  }

  // draw body
  //ctx2.strokeStyle= rgbToHex(c[3],c[4],c[5]);
  ctx2.fillStyle= rgbToHex(c[0],c[1],c[2]);
  ctx2.beginPath();
  ctx2.arc(this.x, this.y, this.size/2, 0, TWOPI); // WITH START SIZE OF 5, RADIUS IS 2.5
  //ctx2.stroke();
  ctx2.fill();

  // draw mouth
  //ctx2.fillStyle=rgbaToHex(c[3], c[4], c[5], opacity)
	ctx2.fillStyle=rgbToHex(c[3],c[4],c[5]);
	ctx2.beginPath();
	ctx2.arc(this.mouth.x,this.mouth.y, this.size/4, 0, TWOPI);
	//ctx2.stroke();
	ctx2.fill();

	if(mouseOverMap && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50 && highlighted!=this.index) {
		ctx2.fillStyle= "#FFFFFF";
		ctx2.fillText(this.name+"-"+this.gen+(this.alive==true ? "A":"D")+this.children.length, this.x+(2*this.size), this.y-(2*this.size)+2);
	}
}



Animal.prototype.decay=function() {

  // reset energyChange; account for any damage taken last iteration
  // energy is expended from the 'exertion of interaction', as well as 'metabolism' from size. adding exertion from interaction is to inhibit a creature from interacting unless there is actually food to be gained.
  if(livePop>100){
    this.energyChange = this.eaten - this.damage - ((abs(this.outputs[0].out)+abs(this.outputs[1].out)+abs(this.outputs[3].out)+abs(this.outputs[4].out)+abs(this.outputs[5].out))); 
  } else if(livePop>50) {
    this.energyChange = this.eaten - this.damage - (abs(this.outputs[0].out)+abs(this.outputs[1].out)+abs(this.outputs[3].out)+abs(this.outputs[4].out)+abs(this.outputs[5].out))/2; 
  } else {
    this.energyChange = this.eaten - this.damage - (abs(this.outputs[0].out)+abs(this.outputs[1].out)+abs(this.outputs[3].out)+abs(this.outputs[4].out)+abs(this.outputs[5].out))/4; 
  }

  this.energy+=this.energyChange;

  if(this.energyChange>0) {
    this.totalEnergyGain+=this.energyChange;
  }

  if(this.energy>this.maxEnergy) {
    this.maxEnergy=this.energy;
  }

  aveChildren+=(this.children.length)/livePop;
  this.health=(this.energy-(this.maxEnergy/2))/(this.maxEnergy/2);

  // after processing food consumed this iteration, if energy is still negative, creature dies
	if(this.energy<=0) {
		this.alive=false;
		livePop--;

    //roll back highest index
		if(this.index==HIGHESTINDEX) {
			var i=this.index;
			while(i>-1 && !animals[i].alive) {
				i--;
			}
			HIGHESTINDEX=i;
		}

    var dead = _.cloneDeep(this);
    dead.index = -(graveyard.length+1)

    // Tell parent that creature is dead... If parent dead, parent_index will be negative (-(parent_index+1)).
		if(this.parent!=null) { 
			if(this.parent<0) { //if parent is dead, no worries
				graveyard[-(this.parent+1)].children[this.sibling_idx]= dead.index;
			} else { //if alive
        animals[this.parent].children[this.sibling_idx]=dead.index;
      }

      // iterate through ancestors and do the same thing...
      var anc = this.parent;
      while(anc!=null){
        if(anc>=0){
          animals[anc].descendants--;
          anc = animals[anc].parent;
        } else {
          graveyard[-(anc+1)].descendants--;
          anc = graveyard[-(anc+1)].parent;
        }
      }
		}

    // Tell children that their parent is dead... If child is dead, child_index is negative (-(parent_index+1)).
    for(var i=0, cL=this.children.length; i<cL; i++) {
			if(this.children[i]<0) {
				graveyard[-(this.children[i]+1)].parent=dead.index;
			} else {
        //console.log(this.children)
				animals[this.children[i]].parent=dead.index;
			}
		}
		if(highlighted==this.index) {
			highlighted=dead.index;
		}
    if(this.index==newest){
      newest=dead.index;
    }

    globalNetNRG+=this.totalEnergyGain;

		graveyard.push(dead);
    document.getElementById("dash-live-info").innerHTML = "LIVE: " + livePop + "     DEAD: " + graveyard.length;
	
  }
}

Animal.prototype.grow=function() {
  // growth uses output 6
  //console.log(this.outputs[6].out)

  // outputs[6] controls what size to split at: -1 means split at smallest possible size (2), 1 means split at largest possible size (20)
  // (-1, 1) -> (2, 20)
  this.size = round(this.energy/100)/10
  if(this.size > MAX_SIZE) { 
    this.size = MAX_SIZE 
  } else if(this.size<1) {
    this.size = 1
  }
  if (this.energy > (this.outputs[6].out + 1)*18000+2000 && livePop<POPCAP) { // if signal divide, creature big enough, and there is room

    // find an empty creature slot in the animals[] array to place new mutant creature
    var i=0;
    while (animals[i]!=null) {
      if(animals[i].alive==true) {  // Alive clause effectively determines that mutant isnt overwriting a living/highscoring animal
        i++;
      } else {
        break;
      }
    }
    //console.log("FOUND INDEX: ", HIGHESTINDEX)    

    // parent undergoes mitosis

    if(i>HIGHESTINDEX) {
      HIGHESTINDEX=i;
    }
    this.size = round((this.size*10)/2)/10; // divide in half
    this.energy /= 2;

    var mutant=_.cloneDeep(this); // create new animal
    mutant.mitosis(this); // mutate given parent as reference

    this.descendants++;
    this.children.push(i); // push index of child to children[] array

    mutant.index = i // IMPORTANT! Set index of mutant
    animals[i]=mutant; 
    newest=i;
    livePop++;
  
    // recursive backwards and add a record of descendants to older/deceased animals
    var ancestor=this.parent;
    while(ancestor!=null) {
      if(ancestor>=0) {
        animals[ancestor].descendants++;
        ancestor=animals[ancestor].parent;
      } else {
        graveyard[-(ancestor+1)].descendants++;
        ancestor=graveyard[-(ancestor+1)].parent;
      }
    }
  }
}

Animal.prototype.think=function() {

  var idx = 0;
  this.inputs[idx++].in = this.velocity/10; 
  this.inputs[idx++].in = this.rotation/90; 
  this.inputs[idx++].in = this.eaten/(this.size*(EATING_CONSTANT*6)); // food eaten / max possible food able to be eaten (carnivore) ≤ self.size*(R+G+B)*2*EATING_CONSTANT: see eat()
  this.inputs[idx++].in = ((2*this.size)/MAX_SIZE)-1; // current size

  this.inputs[idx++].in = this.energyChange/(this.size*10);  // how much energy animal gained/lost last tick
  //console.log("ENERGY CHANGE INPUT: ", this.inputs[--idx])
  //this.inputs[idx++].in=this.health; 
  this.inputs[idx++].in=this.mouth.r; // what the mouth sees
  this.inputs[idx++].in=this.mouth.g;
  this.inputs[idx++].in=this.mouth.b;
  this.inputs[idx++].in=this.mouth.s; // sense other creature size

  for(var eye=0; eye<5; eye++) {
    this.inputs[idx++].in=this.eyes[eye].r;
    this.inputs[idx++].in=this.eyes[eye].g;
    this.inputs[idx++].in=this.eyes[eye].b;
    this.inputs[idx++].in=this.eyes[eye].s; // sense other creature size
  }

  //console.log(this.inputs)

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

  var input = 0;

  // calc hidden neuron activations
  /*
    for(i=0; i<this.hiddenInputNeurons; i++) { 
      for(var j=0; j<NUM_OUTPUT_NEURONS; j++){
        input+=this.inputs[i].synapse(j); // Sum neuron weights with respect to neuron n
      }
    this.outputs.in=input; // set activation of neuron
    input=0;
  }
  */

  //var start = Date.now()

  // calc neuron activations
  for(o=0; o < NUM_OUTPUT_NEURONS; o++) { 

    for(var j=0; j< NUM_INPUT_NEURONS; j++){
      input+=this.inputs[j].synapse(o/*, this.outputs[20].out, this.outputs[21].out,  this.outputs[22].out*/); // Sum neuron weights with respect to neuron n
    }

    for(var j=0; j<NUM_OUTPUT_NEURONS; j++){
      if(j != o){
        input+=this.outputs[j].synapse(o/*, this.outputs[20].out, this.outputs[21].out,  this.outputs[22].out*/); // Sum neuron weights with respect to neuron n
      }
    }
    
    //console.log(input)
    this.outputs[o].in=input; // set activation of neuron
    /*
    if(input>5) {
      console.log(input)
    }
    */
    input=0;
  }

  // determine outputs
  var idx = 0;
  outputIdx = 0;
  this.outputs[idx++].clamp(); // velocity
  this.outputs[idx++].clamp(); // rotation
  this.outputs[idx++].clamp(); // ???
  this.outputs[idx++].clamp(); // interact red
  this.outputs[idx++].clamp(); // interact green
  this.outputs[idx++].clamp(); // interact blue
  this.outputs[idx++].clamp(); // grow/divide ∆ ** +0.1 indicates deposit 1000 energy to increase 0.1 size. indicates gain size until maximum, -1
  this.outputs[idx++].clamp(); // mutation rate

  // mouth
  this.outputs[idx++].clamp(); // mouth left / right
  this.outputs[idx++].clamp(); // mouth front / back

  //eyes
  for(var eye=0; eye<5; eye++) {
    this.outputs[idx++].clamp(); // eye left / right
    this.outputs[idx++].clamp(); // eye front / back
  }

  /*
  this.outputs[20].in == 0 ? "": console.log("BEFORE: ", this.outputs[20].in)
  this.outputs[21].in == 0 ? "": console.log("BEFORE: ",this.outputs[21].in)
  this.outputs[22].in == 0 ? "": console.log("BEFORE: ",this.outputs[22].in)
  this.outputs[idx++].clamp(); // 20
  this.outputs[idx++].clamp(); // 21
  this.outputs[idx++].clamp(); // 22
  this.outputs[20].out == 0 ? "": console.log("AFTER: ",this.outputs[20].out)
  this.outputs[21].out == 0 ? "": console.log("AFTER: ",this.outputs[21].out)
  this.outputs[22].out == 0 ? "": console.log("AFTER: ",this.outputs[22].out)
  */

  //console.log("TIME: ", Date.now()-start)
}

Animal.prototype.mitosis=function(parent) {
  this.descendants = 0;
  this.children = [];
  this.gen = parent.gen+1;
  this.parent=parent.index;
  this.sibling_idx=parent.children.length;
  this.name=parent.name;
  this.maxEnergy=parent.energy;
  this.redEaten=0.003;
  this.greenEaten=0.003;
  this.blueEaten=0.003;
  this.netEaten=0.01;
  this.damage = 0;
  this.damageCaused=0;
  this.damageReceived=0;

  if(round(Math.random()*2)==2) {
    if(round(Math.random()*2)==2) {
      if(round(Math.random()*2)==2) {
        if(round(Math.random()*2)==2) {
          this.name=ALPH.charAt(round(Math.random()*25))+this.name.charAt(1)+this.name.charAt(2)+this.name.charAt(3);
        } else {
          this.name=this.name.charAt(0)+ALPH.charAt(round(Math.random()*25))+this.name.charAt(2)+this.name.charAt(3);
        }
      } else {
        this.name=this.name.charAt(0)+this.name.charAt(1)+ALPH.charAt(round(Math.random()*25))+this.name.charAt(3);
      }
    } else {
      this.name=this.name.charAt(0)+this.name.charAt(1)+this.name.charAt(2)+ALPH.charAt(round(Math.random()*25));
    }
  }

  // mutationRate is rounded because NaN errors occuring upon addition to pos/negWeight float32Arrays
  // NOTE: The mutation algorithm intentionally causes weights to tend towards 0 by subtracting "this.inputs[x].weights1[y]": This way, excessive mutation is avoided, and only useful mutations are kept non-zero
  //var mutationRate = round(100*(this.outputs[7].out+1)/2)/1000 
  var mutationRate = 0.1
  mitosisStat+=1;
  mutationRateStat+=mutationRate;
  if(isNaN(mutationRate)) {
    console.log(this.outputs[7])
    console.log("NAN MUT RATE")
  }

  /*
    where weights = weights of current creature:
    DELTAS
    w_pos = [ave(weights of LIVING descendants) - weights]
    w_neg = [ave(weights of dead descendants with 0 children) - weights]
    w_rand = [small random weight deltas]

    weights += w_rand + w_pos - w_neg
  */

  //find every child of a parent: add all except the original
  function getDescendants(idx, orig) {
    let idxs = [];  // Initialize array to store descendant indices
    let current = (idx >= 0 ? animals[idx] : graveyard[-(idx + 1)]);  // Fetch animal or from graveyard based on index
  
    // Loop through all children of the current animal
    for (let i = 0; i < current.children.length; i++) {
      // Recursively fetch descendants of the child and concatenate with idxs
      idxs = idxs.concat(getDescendants(current.children[i], orig));
    }
  
    // Add current index to idxs if it's not the original animal
    if (idx !== orig) {
      idxs.push(idx);
    }
  
    return idxs;  // Return the array of descendant indices
  }

  var idxs = getDescendants(this.parent, this.parent)
  //console.log("DESCENDANTS OF "+ parent.name+"-"+parent.gen+(parent.alive==true ? "A":"D")+parent.children.length+": "+idxs)


  function getWeightDeltas(current, base) {
    let in_weights1_deltas = [];  // Initialize array to store input weight1 deltas
    let in_weights2_deltas = [];  // Initialize array to store input weight2 deltas
    let out_weights1_deltas = []; // Initialize array to store output weight1 deltas
    let out_weights2_deltas = []; // Initialize array to store output weight2 deltas
  
    // Loop through input neurons
    for (let i = 0; i < NUM_INPUT_NEURONS; i++) {
      let w1_deltas = [];  // Initialize sub-array for weight1 deltas
      let w2_deltas = [];  // Initialize sub-array for weight2 deltas
      // Loop through output neurons
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        // Calculate deltas for weights1 and weights2
        w1_deltas[j] = current.inputs[i].weights1[j] - base.inputs[i].weights1[j];
        w2_deltas[j] = current.inputs[i].weights2[j] - base.inputs[i].weights2[j];
      }
      in_weights1_deltas.push(w1_deltas);
      in_weights2_deltas.push(w2_deltas);
    }
  
    // Loop through output neurons
    for (let i = 0; i < NUM_OUTPUT_NEURONS; i++) {
      let w1_deltas = [];  // Initialize sub-array for weight1 deltas
      let w2_deltas = [];  // Initialize sub-array for weight2 deltas
      // Loop through output neurons
      for (let j = 0; j < NUM_OUTPUT_NEURONS; j++) {
        // Calculate deltas for weights1 and weights2
        w1_deltas[j] = current.outputs[i].weights1[j] - base.outputs[i].weights1[j];
        w2_deltas[j] = current.outputs[i].weights2[j] - base.outputs[i].weights2[j];
      }
      out_weights1_deltas.push(w1_deltas);
      out_weights2_deltas.push(w2_deltas);
    }
  
    return {in_weights1_deltas, in_weights2_deltas, out_weights1_deltas, out_weights2_deltas};
  }
  
  // Usage
  var advantageous = []
  var detrimental = []
  for (let i = 0; i < idxs.length; i++) {
    let idx = idxs[i];
    let current = (idx >= 0 ? animals[idx] : graveyard[-(idx + 1)]);  // Fetch animal or from graveyard based on index
    // if animal is ALIVE or animal is DEAD WITH 0 CHILDREN: get deltas
    if(current.children.length > 0) { // add all living and dead animals that had children
      advantageous.push(getWeightDeltas(current, parent));
    } else if(idx < 0) { // if didn't have children and is dead
      //detrimental.push(getWeightDeltas(current, parent))
    }
  }
  var net = advantageous.length + detrimental.length

  /****** ADD RANDOM MUTATIONS->ZERO BEFORE ADDING ADVANAGEOUS + DETRIMENTAL ******/
 
  // Mutate input neurons
  for(var i=0; i<NUM_INPUT_NEURONS; i++) {
    for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
      // put pressure on weights to go towards zero by subtracting the weight from the possible. 
      this.inputs[i].weights1[j] += (2*Math.random()-1 - this.inputs[i].weights1[j])*mutationRate;
      this.inputs[i].weights2[j] += (2*Math.random()-1 - this.inputs[i].weights2[j])*mutationRate;
    }
  }

  // Mutate output neurons
  for(var i=0; i<NUM_OUTPUT_NEURONS; i++) {
    for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
      this.outputs[i].weights1[j] += (2*Math.random()-1 - this.outputs[i].weights1[j])*mutationRate;
      this.outputs[i].weights2[j] += (2*Math.random()-1 - this.outputs[i].weights2[j])*mutationRate;
    }
  }



  //ADD AVERAGE OF ADVANTAGEOUS DELTAS
  var advl = advantageous.length
  for(var a= 0; a < advl; a++) {
    adv = advantageous[a]
    for(var i=0; i<NUM_INPUT_NEURONS; i++) {
      for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
        this.inputs[i].weights1[j] += adv['in_weights1_deltas'][i][j]/advl;
        this.inputs[i].weights2[j] += adv['in_weights2_deltas'][i][j]/advl;
      }
    }

    for(var i=0; i<NUM_OUTPUT_NEURONS; i++) {
      for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
        this.outputs[i].weights1[j] += adv['out_weights1_deltas'][i][j]/advl;
        this.outputs[i].weights2[j] += adv['out_weights2_deltas'][i][j]/advl;
      }
    }
  }

  /*
  //SUBTRACT AVERAGE OF DETRIMENTAL DELTAS
  var detl = detrimental.length
  for(var d= 0; d < detl; d++) {
    det = detrimental[d]
    for(var i=0; i<NUM_INPUT_NEURONS; i++) {
      for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
        this.inputs[i].weights1[j] -= det['in_weights1_deltas'][i][j]/net;
        this.inputs[i].weights2[j] -= det['in_weights2_deltas'][i][j]/net;
      }
    }

    for(var i=0; i<NUM_OUTPUT_NEURONS; i++) {
      for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
        this.outputs[i].weights1[j] -= det['out_weights1_deltas'][i][j]/net;
        this.outputs[i].weights2[j] -= det['out_weights2_deltas'][i][j]/net;
      }
    }
  }
  */
  /*
  for(var i=0; i<NUM_INPUT_NEURONS; i++) {
    for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
      // put pressure on weights to go towards zero by subtracting the weight from the possible. 
      this.inputs[i].weights1[j] += (2*Math.random()-1 - this.inputs[i].weights1[j])*mutationRate;
      this.inputs[i].weights2[j] += (2*Math.random()-1 - this.inputs[i].weights2[j])*mutationRate;
    }
  }

  // Mutate output neurons
  for(var i=0; i<NUM_OUTPUT_NEURONS; i++) {
    for(var j = 0; j<NUM_OUTPUT_NEURONS; j++) {
      this.outputs[i].weights1[j] += (2*Math.random()-1 - this.outputs[i].weights1[j])*mutationRate;
      this.outputs[i].weights2[j] += (2*Math.random()-1 - this.outputs[i].weights2[j])*mutationRate;
    }
  }
  */

  document.getElementById("dash-live-info").innerHTML = "LIVE: " + livePop + "     DEAD: " + graveyard.length;
}

Animal.prototype.kill=function() {
  if(this.alive==true){
    this.energy=-1;
  }
}

Animal.prototype.reincarnate=function() {
  if(this.alive==false){
    if(livePop<POPCAP) {
      var i=0;
      while (animals[i]!=null) {
        if(animals[i].alive==true) {  //Alive clause effectively determines that animal isnt overwriting itself
          i++;
        } else {
          break;
        }
      }
      if(i>HIGHESTINDEX) {
        HIGHESTINDEX=i;
      }

      var clone = _.cloneDeep(this);
      this.descendants++;
      this.children.push(i);
      animals[i]=clone;

      newest=i;
      livePop++;
      var ancestor=this.parent;
      while(ancestor!=null) {
        if(ancestor>=0) {
          animals[ancestor].descendants++;
          ancestor=animals[ancestor].parent;
        } else {
          graveyard[-(ancestor+1)].descendants++;
          ancestor=graveyard[-(ancestor+1)].parent;
        }
      }
      highlighted = clone.index;
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
  var oriX=this.x+(this.size*Math.cos(this.direction*DEG_TO_RAD));
  var oriY=this.y+(this.size*Math.sin(this.direction*DEG_TO_RAD));

  ctx2.beginPath();
  ctx2.strokeStyle="#FF0000";
  // draw velocity vector
  var velX=this.x+(this.outputs[0].out*10*Math.cos(this.direction*DEG_TO_RAD));
  var velY=this.y+(this.outputs[0].out*10*Math.sin(this.direction*DEG_TO_RAD));
  ctx2.moveTo(this.x,this.y);
  ctx2.lineTo(velX, velY);
  // draw rotation vector
  if(this.velocity>0) {
    var rotX = velX-this.outputs[1].out*10*Math.cos((this.direction-90)*DEG_TO_RAD);
    var rotY = velY-this.outputs[1].out*10*Math.sin((this.direction-90)*DEG_TO_RAD);
  } else {
    var rotX = velX+this.outputs[1].out*10*Math.cos((this.direction-90)*DEG_TO_RAD);
    var rotY = velY+this.outputs[1].out*10*Math.sin((this.direction-90)*DEG_TO_RAD);
  }

  ctx2.lineTo(rotX, rotY);
  ctx2.stroke();

  ctx2.strokeStyle="#FFFFFF";
  if(mouseOverMap && mouseX>=this.x-50 && mouseX<this.x+50 && mouseY>=this.y-50 && mouseY<this.y+50) {
    for(var i=0;i<5;i++) {
      ctx2.beginPath();
      ctx2.arc(round(this.eyes[i].x),round(this.eyes[i].y), round(this.size/5), 0, TWOPI);
      //ctx2.fillText("E"+(i+1), this.eyes[i].x+(s/2), this.eyes[i].y-(s/2));
      ctx2.stroke();
    }
  }
  var posx=this.x+(2*s);
  var posy=this.y-(2*s);
  if(this.alive==true) {
    ctx2.fillText(this.name+"-"+this.gen+(this.alive==true ? "A":"D")+this.children.length,posx, posy+2);
  }
  posy+=10;

  if(display==0) { // MAIN stat display card

    if(this.alive==true) {
      document.getElementById("stats-name").innerHTML = this.name+"-"+this.gen+"A"+this.children.length;

    } else {
      document.getElementById("stats-name").innerHTML = this.name+"-"+this.gen+"D"+this.children.length;

    }
    document.getElementById("stats-idx").innerHTML = "IDX: "+this.index;

    if(this.parent!=null) {
      if(this.parent<0) { // if parent dead
        document.getElementById("stats-parent").innerHTML = "PARENT: "+graveyard[(-(this.parent+1))].name+"-"+graveyard[(-(this.parent+1))].gen+"D"+graveyard[(-(this.parent+1))].children.length
      }else { // if parent alive
        document.getElementById("stats-parent").innerHTML = "PARENT: "+animals[this.parent].name+"-"+animals[this.parent].gen+"A"+animals[this.parent].children.length
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent;
            leftPressed=false;
          }
        }
      }
    } else {
      document.getElementById("stats-parent").innerHTML = ""
    }
    if(this.sibling_idx!=null){
      document.getElementById("stats-sibling-idx").innerHTML = "SIBLING: "+this.sibling_idx;
    }
    document.getElementById("stats-descendants").innerHTML = "DESCENDANTS: "+this.descendants;

    var stat = round(5*this.energyChange/((this.size*10)+5)) // eaten plus max. relevant output activations
    var stat_string = "";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-energy").innerHTML = "NRG: "+round(this.energy)+"/"+round(this.maxEnergy)+"   "+stat_string;
    document.getElementById("stats-size").innerHTML = "SIZE: "+ this.size;
    document.getElementById("stats-damage").innerHTML = round(this.damageReceived)+" >> DMG >> "+round(this.damageCaused);
    document.getElementById("stats-sensors").innerHTML = (this.mouth.sees==1 ? "M ":"")+(this.eyes[0].sees==1 ? "E1 ":"")+(this.eyes[1].sees==1 ? "E2 ":"")+(this.eyes[2].sees==1 ? "E3 ":"")+(this.eyes[3].sees==1 ? "E4 ":"")+(this.eyes[4].sees==1 ? "E5 ":"")
    

    //red
    stat = round(this.outputs[3].out*5);
    stat_string = "R";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-red").innerHTML = stat_string;


    //green
    stat = round(this.outputs[4].out*5);
    stat_string = "G";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-green").innerHTML = stat_string;

    //blue
    stat = round(this.outputs[5].out*5);
    stat_string = "B";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-blue").innerHTML = stat_string;

    //velocity
    stat = round(this.outputs[0].out*5);
    stat_string = "VEL";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-velocity").innerHTML = stat_string;

    //rotation
    stat = round(this.outputs[1].out*5);
    stat_string = "ROT";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-rotation").innerHTML = stat_string;

    //mutation
    stat = round(this.outputs[6].out*5);
    stat_string = "MUT";
    if(stat > 0) {
      for(var i = 0; i<stat; i++) {
        stat_string = stat_string.concat("+")
      }
    } else {
      for(var i = 0; i<-stat; i++) {
        stat_string = stat_string.concat("-")
      }
    }
    document.getElementById("stats-mutation").innerHTML = stat_string;

  } else if(display==1) { // BRAIN DISPLAY
    ctx4.beginPath();
    ctx4.fillStyle="#808080";
    ctx4.fillRect(0,0,DASHX,DASHY);
    ctx4.fillStyle="#A0A0A0"
    ctx4.fillRect(0,0,10,10);
    ctx4.fillStyle="#606060"
    ctx4.fillText("X",1,9);
    ctx4.fillStyle=rgbToHex(round(255*this.redEaten/this.netEaten),round(255*this.greenEaten/this.netEaten),round(255*this.blueEaten/this.netEaten));
    ctx4.arc(40,40, 25, 0, TWOPI);
    ctx4.fill();
    ctx4.fillStyle="#FFFFFF";

    posx=120;
    posy=30;
    var spcx=60;
    var spcy=22;

    ctx4.fillStyle= "#FFFFFF";
    if(this.redEaten/this.netEaten>0.5 || this.greenEaten/this.netEaten>0.5 || this.blueEaten/this.netEaten>0.5) {
      ctx4.fillStyle= "#000000";
    }
    ctx4.beginPath();
    posx=5;
    posy=80;
    ctx4.fillText("FOOD", posx, posy+=spcy);
    ctx4.fillText("ECHG",posx, posy+=spcy);
    ctx4.fillText("MR",posx, posy+=spcy);
    ctx4.fillText("MG",posx, posy+=spcy);
    ctx4.fillText("MB",posx, posy+=spcy);
    ctx4.fillText("MSEN",posx, posy+=spcy);
    ctx4.fillText("HLTH", posx, posy+=spcy);
    ctx4.fillText("SIZE", posx, posy+=spcy);
    ctx4.fillText("VEL", posx, posy+=spcy);
    for(var i=0; i<5; i++) {
      ctx4.fillText("E"+(i+1)+"R",posx,posy+=spcy);
      ctx4.fillText("E"+(i+1)+"G",posx,posy+=spcy);
      ctx4.fillText("E"+(i+1)+"B",posx,posy+=spcy);
      ctx4.fillText("E"+(i+1)+"SEN",posx,posy+=spcy);
    }
    display=2;
  } else if(display==3) { // FAMILY
    posx=210;
    posy=210;
    ctx4.beginPath();
    ctx4.fillStyle=rgbToHex(round(255*this.redEaten/this.netEaten),round(255*this.greenEaten/this.netEaten),round(255*this.blueEaten/this.netEaten));
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= rgbToHex(this.cols[12],this.cols[13],this.cols[14]);
    ctx4.fillRect(200,200,10,10);
    ctx4.fillStyle= rgbToHex(this.cols[9],this.cols[10],this.cols[11]);
    ctx4.fillText("X",201,209);
    ctx4.fillStyle= "#FFFFFF";
    if(this.redEaten/this.netEaten>0.5 || this.greenEaten/this.netEaten>0.5 || this.blueEaten/this.netEaten>0.5) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive==true) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    ctx4.fillText("IDX: "+this.index,posx,posy+=10);
    if(this.parent!=null) {
      if(this.parent<0) {
        ctx4.fillText("PAR: "+graveyard[(-(this.parent+1))].name+"D"+graveyard[(-(this.parent+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+animals[this.parent].name+"A"+animals[this.parent].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent;
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
    ctx4.fillStyle=rgbToHex(round(255*this.redEaten/this.netEaten),round(255*this.greenEaten/this.netEaten),round(255*this.blueEaten/this.netEaten));
    ctx4.fillRect(200,200,400,200);
    ctx4.fillStyle= rgbToHex(this.cols[12],this.cols[13],this.cols[14]);
    ctx4.fillRect(200,200,10,10);
    ctx4.fillStyle= rgbToHex(this.cols[9],this.cols[10],this.cols[11]);
    ctx4.fillText("X",201,209);
    ctx4.fillStyle= "#FFFFFF";
    if(this.redEaten/this.netEaten>0.5 || this.greenEaten/this.netEaten>0.5 || this.blueEaten/this.netEaten>0.5) {
      ctx4.fillStyle= "#000000";
    }
    if(this.alive==true) {
      ctx4.fillText(this.name+"-"+this.gen+"A"+this.children.length, posx, posy+=10);
    } else {
      ctx4.fillText(this.name+"-"+this.gen+"D"+this.children.length, posx, posy+=10);
    }
    if(this.parent!=null) {
      if(this.parent<0) {
        ctx4.fillText("PAR: "+graveyard[(-(this.parent+1))].name+"D"+graveyard[(-(this.parent+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+animals[this.parent].name+"A"+animals[this.parent].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent;
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
    if(this.redEaten/this.netEaten>0.5 || this.greenEaten/this.netEaten>0.5 || this.blueEaten/this.netEaten>0.5) {
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
      if(this.parent<0) {
        ctx4.fillText("PAR: "+graveyard[(-(this.parent+1))].name+"D"+graveyard[(-(this.parent+1))].children.length,posx, posy+=10);
      }else {
        ctx4.fillText("PAR: "+animals[this.parent].name+"A"+animals[this.parent].children.length,posx, posy+=10);
      }
      if(mouseOverConsole && leftPressed) {
        if(mouseX>posx && mouseX<posx+80) {
          if(mouseY>posy-5 && mouseY<posy+5) {
            highlighted=this.parent;
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
    if(this.outputs[0].out>0.2) {
      ctx4.fillText("VEL++", posx,posy);
    } else if(this.outputs[0].out<-0.2) {
      ctx4.fillText("VEL--", posx,posy);
    }
    posy+=spcy;
    if(this.outputs[1].out>0.2) {
      ctx4.fillText("ROT++", posx,posy);
    } else if(this.outputs[1].out<-0.2) {
      ctx4.fillText("ROT--", posx,posy);
    }
    posy+=spcy;
    if(this.outputs[2].out<-0.33) {
      ctx4.fillText("CARN", posx,posy);
    } else if(this.outputs[2].out>=0.33){
      ctx4.fillText("HERB", posx,posy);
    }
    posy+=spcy;
    if(this.outputs[3].out<-0.80) {
      ctx4.fillText("EATR--",posx,posy);
    } else if(this.outputs[3].out<-0.5) {
      ctx4.fillText("EATR-",posx,posy);
    } else if(this.outputs[3].out<-0.20) {
      ctx4.fillText("EATR",posx,posy);
    } else if(this.outputs[3].out>=0.80) {
      ctx4.fillText("EATR++",posx,posy);
    } else if(this.outputs[3].out>=0.50) {
      ctx4.fillText("EATR+",posx,posy);
    } else if(this.outputs[3].out>=0.20) {
      ctx4.fillText("EATR",posx,posy);
    }
    posy+=spcy;
    if(this.outputs[4].out<-0.80) {
      ctx4.fillText("EATG--",posx,posy);
    } else if(this.outputs[4].out<-0.5) {
      ctx4.fillText("EATG-",posx,posy);
    } else if(this.outputs[4].out<-0.20) {
      ctx4.fillText("EATG",posx,posy);
    } else if(this.outputs[4].out>=0.80) {
      ctx4.fillText("EATG++",posx,posy);
    } else if(this.outputs[4].out>=0.50) {
      ctx4.fillText("EATG+",posx,posy);
    } else if(this.outputs[4].out>=0.20) {
      ctx4.fillText("EATG",posx,posy);
    }
    posy+=spcy;
    if(this.outputs[5].out<-0.80) {
      ctx4.fillText("EATB--",posx,posy);
    } else if(this.outputs[5].out<-0.5) {
      ctx4.fillText("EATB-",posx,posy);
    } else if(this.outputs[5].out<-0.20) {
      ctx4.fillText("EATB",posx,posy);
    } else if(this.outputs[5].out>=0.80) {
      ctx4.fillText("EATB++",posx,posy);
    } else if(this.outputs[5].out>=0.50) {
      ctx4.fillText("EATB+",posx,posy);
    } else if(this.outputs[5].out>=0.20) {
      ctx4.fillText("EATB",posx,posy);
    }
    posy+=spcy;

    if(this.outputs[6].out>=0.33) {
      ctx4.fillText("MITO",posx,posy); // cell split
    }else if(this.outputs[6].out>-0.33){
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
      if(j==NUM_INPUT_NEURONS){ // after all brain input neurons drawn, draw output neurons on far right
        posx=540;
        posy=100;
      } else if(j==NUM_INPUT_NEURONS+NUM_OUTPUT_NEURONS){
        posx=200;
        posy=100;
      } else if(j==NUM_INPUT_NEURONS+NUM_OUTPUT_NEURONS+16){
        posx=280;
        posy=100;
      } else if(j==NUM_INPUT_NEURONS+NUM_OUTPUT_NEURONS+32){
        posx=360;
        posy=100;
      } else if(j==NUM_INPUT_NEURONS+NUM_OUTPUT_NEURONS+48){
        posx=440;
        posy=100;
      }
      //if(j<NUM_INPUT_NEURONS+NUM_OUTPUT_NEURONS){
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

