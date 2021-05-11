Animal.prototype.getMutations=function(x, scale, i, k) {
  var r = (Math.random()*2-1)/scale;
  if(Math.random()>0.5){
    r=0;
  }
  if(accelerate==0){
    return r;
  }else if(accelerate==1){
    var pM=this.getAdvantageousMutations(x,i,k);
    pM*=this.proGenes;
    return (pM+r)/(this.proGenes+1);
  }else if(accelerate==2){
    var pM=this.getAdvantageousMutations(x,i,k);
    var cM=this.getDetrimentalMutations(x,i,k);
    var diff = pM-cM;
    pM*=this.proGenes;
    pM=(pM+r)/(this.proGenes+1);
    return (diff+pM);

  } else if(accelerate==3){
    var pM=this.getAdvantageousMutations(x,i,k);
    return pM+r;
  } else if(accelerate==4){
    var pM=this.getAdvantageousMutations(x,i,k);
    var cM=this.getDetrimentalMutations(x,i,k);
    var diff = pM-cM;
    return pM+diff+r;
    /*
      g0a2   |g1a1   |g1d0   |pM   |cM   |diff   |del   |
    a)   -1.5    -1.2    -1.7   0.3  -0.2     0.5   -1.0
    b)      2     2.3     2.7   0.3   0.7    -0.4    0.1
    c)   -0.5     0.4    -0.6   0.9  -0.1     0.5    1.4
    d)    0.5     0.2     0.2  -0.3  -0.3     0.0   -0.3
    e)   -0.5     0.4     0.0   0.9   0.5     0.2    1.1
    f)      2     2.7     2.3   0.7   0.3     0.2    0.9
    */
  }else if(accelerate==5) {
    var pM=this.getAdvantageousMutations(x,i,k);
    var cM=this.getDetrimentalMutations(x,i,k);
    var diff = pM-cM;
    pM*=this.proGenes;
    pM=(pM+r)/(this.proGenes+1);
    return (diff+pM);

  } else if(accelerate==6){
    var pM=this.getAdvantageousMutations(x,i,k);
    var cM=this.getDetrimentalMutations(x,i,k);
    var diff = pM-cM;
    pM*=this.proGenes;
    pM=(pM+r)/(this.proGenes+1);
    return (diff+pM);

  } else if(accelerate==7){
    var pM=this.getAdvantageousMutations(x,i,k);
    var cM=this.getDetrimentalMutations(x,i,k);
    var diff = pM-cM;
    pM*=this.proGenes;
    pM=(pM+(r*(this.conGenes+1)))/(this.proGenes+(this.conGenes+1));
    return (diff+pM);

  } else if(accelerate==8){
    var pM=this.recurseGetAdvantageous(x, i, k, this.index);
    var pG=this.liveDescendants;
    if(pG==0){
      pG++;
    } else {
      this.proGenes=pG;
    }
    pM/=pG;
    var cM=this.recurseGetDetrimentals(x, i, k, this.index);
    var cG=this.descendants-this.liveDescendants;
    if(cG==0){
      cG++;
    } else {
      this.conGenes=cG;
    }
    cM/=cG;

    var diff = pM-cM;
    pM*=pG;
    pM=(pM+r)/(this.proGenes+1);
    return (diff+pM);

  } else if(accelerate==9){
    /*
      Look at descendants, count those who successfully reproduced. Sum mutations then average -> advantageous.
      Same with Detrimentals.
    */
    var pM=this.recurseGetAdvantageous(x, i, k, this.index);
    var pG=this.recurseCountAdvantageous(x, i, k);
    if(pG==0){
      pG++;
    } else {
      this.proGenes=pG;
    }
    pM/=pG;
    var cM=this.recurseGetDetrimentals(x, i, k, this.index);
    var cG=this.recurseCountDetrimentals(x, i, k);
    if(cG==0){
      cG++;
    } else {
      this.conGenes=cG;
    }
    cM/=cG;
    var diff = pM-cM;

    /*
    diff == pD-cD
    del == diff+pD

    g0a2   |g1a1   |g1d0   |pD   |cD   |diff   |del   |
  a)   -1.5    -1.2    -1.7   0.3  -0.2     0.5    0.8
  b)      2     2.3     2.7   0.3   0.7    -0.4   -0.1
  c)   -0.5     0.4    -0.6   0.9  -0.1     1.0    1.9
  d)    0.5     0.2     0.2  -0.3  -0.3     0.0   -0.3
  e)   -0.5     0.4     0.0   0.9   0.5     0.4    1.3
  f)      2     2.7     2.3   0.7   0.3     0.4    1.1
    */

    pM*=pG;
    pM=(pM+r)/(this.proGenes+1);
    return (diff+pM);
  } else if(accelerate==10){
    var pM=this.recurseGetAdvantageous(x, i, k, this.index);
    var pG=this.recurseCountAdvantageous(x, i, k);
    if(pG==0){
      pG++;
    } else {
      this.proGenes=pG;
    }
    pM/=pG;
    var cM=this.recurseGetDetrimentals(x, i, k, this.index);
    var cG=this.recurseCountDetrimentals(x, i, k);
    if(cG==0){
      cG++;
    } else {
      this.conGenes=cG;
    }
    cM/=cG;
    pM*=pG;
    pM=(pM+r)/(this.proGenes+1);
    return (pM-cM);
  } else if(accelerate==11){
    var pM=this.recurseGetAdvantageous(x, i, k, this.index); // pro delta
    var pG=this.recurseCountAdvantageous(x, i, k);
    if(pG==0){
     pG++;
    } else {
     this.proGenes=pG;
    }
    pM/=pG; // ave pro
    var cM=this.recurseGetDetrimentals(x, i, k, this.index); // con delta
    var cG=this.recurseCountDetrimentals(x, i, k);
    if(cG==0){
     cG++;
    }else {
     this.conGenes=cG;
    }
    cM/=cG; // ave con
    var diff = (pM-cM)/2;
    return diff+pM+r;

  } else if(accelerate==12){
    var pM=this.recurseGetAdvantageous(x, i, k, this.index); // pro delta
    var pG=this.recurseCountAdvantageous(x, i, k);
    this.proGenes=pG;
    var cM=this.recurseGetDetrimentals(x, i, k, this.index); // con delta
    var cG=this.recurseCountDetrimentals(x, i, k);
    this.conGenes=cG;
    return (pM-cM+r)/(pG+cG+1);
  }
}

Animal.prototype.getAdvantageousMutations=function(x, i, k) {
  var pM=0;
  var pG=0;
  var child;

  if(accelerate==0){
    return 0;
  }else if(accelerate<8){
    for(var y=0;y<this.children.length;y++){
      if(this.children[y]>=0){
        child = animals[this.children[y]];
      } else {
        child = graveyard[-(this.children[y]+1)];
      }
      var c;
      if(accelerate==5 || accelerate==6 || accelerate==7){
        c=child.liveDescendants;
      } else if(accelerate>0 && accelerate<5){ // 1,2,3,4
        c=child.children.length;
      }
      if(x==0){
        pM+=c*(child.brain[i].weights[k]-this.brain[i].weights[k]);
      } else if(x==1){
        pM+=c*(child.brain[i].bias-this.brain[i].bias);
      } else if(x==5){
        pM+=c*(child.maxSize-this.maxSize);
      } else if(x==6){
        pM+=c*(child.minSize-this.minSize);
      }
      pG+=c;
    }
    if(pG==0){
      pG++;
    } else {
      this.proGenes=pG;
    }
    return pM/pG;

  } else if(accelerate==8){
    var pM=this.recurseGetAdvantageous(x, i, k, this.index);
    var pG=this.liveDescendants;
    if(pG==0){
      pG++;
    } else {
      this.proGenes=pG;
    }
    return pM/pG;

  } else if(accelerate>=9){
    pM=this.recurseGetAdvantageous(x, i, k, this.index);
    pG=this.recurseCountAdvantageous(x, i, k);
    if(pG==0){
      pG++;
    } else {
      this.proGenes=pG;
    }
    return pM/pG;
  }
}

Animal.prototype.getDetrimentalMutations=function(x, i, k) {
  var cM=0;
  var cG=0;
  var child;
  if(accelerate==0){
    return 0;
  } else if(accelerate<8){
    for(var y=0;y<this.children.length;y++){
      if((accelerate>0 && accelerate<5) && this.children[y]<0){
        child = graveyard[-(this.children[y]+1)];
        if(child.children.length==0){
          if(x==0){
            cM+=(child.brain[i].weights[k]-this.brain[i].weights[k]);
          } else if(x==1){
            cM+=(child.brain[i].bias-this.brain[i].bias);
          } else if(x==5){
            cM+=(child.maxSize-this.maxSize);
          } else if(x==6){
            cM+=(child.minSize-this.minSize);
          }
          cG++;
        }
      } else if((accelerate==5 || accelerate==6) || accelerate==7){
        if(this.children[y]>=0){
          child = animals[this.children[y]];
        } else {
          child = graveyard[-(this.children[y]+1)];
        }

        if(accelerate==5 && child.liveDescendants==0){
          if(x==0){
            cM+=(child.brain[i].weights[k]-this.brain[i].weights[k]);
          } else if(x==1){
            cM+=(child.brain[i].bias-this.brain[i].bias);
          } else if(x==5){
            cM+=(child.maxSize-this.maxSize);
          } else if(x==6){
            cM+=(child.minSize-this.minSize);
          }
          cG++;
        }else if((accelerate==6 || accelerate==7) && (child.liveDescendants==0 && (this.children[y]<0 || child.descendants>0))){
          if(x==0){
            cM+=(child.brain[i].weights[k]-this.brain[i].weights[k]);
          } else if(x==1){
            cM+=(child.brain[i].bias-this.brain[i].bias);
          } else if(x==5){
            cM+=(child.maxSize-this.maxSize);
          } else if(x==6){
            cM+=(child.minSize-this.minSize);
          }
          cG++;
        }
      }
    }
    if(cG==0){
      cG++;
    } else {
      this.conGenes=cG;
    }
    return cM/cG;
  }else if(accelerate==8){
    cM=this.recurseGetDetrimentals(x, i, k, this.index);
    cG=this.descendants-this.liveDescendants;
    if(cG==0){
      cG++;
    } else {
      this.conGenes=cG;
    }
    return cM/cG;
  } else if(accelerate>=9){
    var cM=this.recurseGetDetrimentals(x, i, k, this.index);
    var cG=this.recurseCountDetrimentals(x, i, k);
    if(cG==0){
      cG++;
    } else {
      this.conGenes=cG;
    }
    return cM/cG;
  }
}

Animal.prototype.recurseGetAdvantageous=function(x, i, k, idx) {
  var pM=0;
  var child;
  var cc;
  var a;
  if(idx>=0){ // check if target animal is alive
    a = animals[idx];
  } else {
    a = graveyard[-(idx+1)];
  }

  for(var y=0; y<a.children.length; y++){ // Look at children
    if(a.children[y]>=0){ // check if living
      child = animals[a.children[y]];
    } else {
      child = graveyard[-(a.children[y]+1)];
    }
    cc=child.children.length;

    if((accelerate==8 && a.children[y]>=0)){ // if child is alive
      if(x==0){
        pM+=(child.brain[i].weights[k]-this.brain[i].weights[k]);
      } else if(x==1){
        pM+=(child.brain[i].bias-this.brain[i].bias);
      } else if(x==5){
        pM+=(child.maxSize-this.maxSize);
      } else if(x==6){
        pM+=(child.minSize-this.minSize);
      }

    }else if(accelerate>=9 && cc>0) {
      if(x==0){
        pM+=cc*(child.brain[i].weights[k]-this.brain[i].weights[k]);
      } else if(x==1){
        pM+=cc*(child.brain[i].bias-this.brain[i].bias);
      } else if(x==5){
        pM+=cc*(child.maxSize-this.maxSize);
      } else if(x==6){
        pM+=cc*(child.minSize-this.minSize);
      }
    }

    if(cc>0){
      pM+= this.recurseGetAdvantageous(x, i, k, a.children[y]);
    }

  }
  return pM;
}

Animal.prototype.recurseCountAdvantageous=function(x, i, k) {
  var pG=0;
  var child;
  var cc;
  for(var y=0; y<this.children.length; y++){ // for every child
    if(this.children[y]>=0){ // if alive
      child = animals[this.children[y]]; // set child to animal at index
    } else { // if dead
      child = graveyard[-(this.children[y]+1)]; // set child to dead animal at index
    }
    cc=child.children.length;
    if(cc>0){
      pG+=(child.recurseCountAdvantageous(x, i, k)+cc);
    }
  }
  return pG;
}

Animal.prototype.recurseGetDetrimentals=function(x, i, k, idx) {
  var cM=0;
  var child;
  if(idx>=0){ // check if target animal is alive
    a = animals[idx];
  } else {
    a = graveyard[-(idx+1)];
  }
  for(var y=0;y<a.children.length;y++){
    if(a.children[y]>=0){
      child = animals[a.children[y]];
    } else {
      child = graveyard[-(a.children[y]+1)];
    }
    if(child.children.length>0){
      cM+= this.recurseGetDetrimentals(x, i, k, a.children[y]);
    }
    if((accelerate==8 && a.children[y]<0) || ((accelerate>=9 && child.children.length==0) && a.children[y]<0)) {
      // accel 8: if child is dead
      // accel 9: if child is dead and childless
      if(x==0){
        cM+=(child.brain[i].weights[k]-this.brain[i].weights[k]);
      } else if(x==1){
        cM+=(child.brain[i].bias-this.brain[i].bias);
      } else if(x==5){
        cM+=(child.maxSize-this.maxSize);
      } else if(x==6){
        cM+=(child.minSize-this.minSize);
      }
    }
  }
  return cM;
}

Animal.prototype.recurseCountDetrimentals=function(x, i, k) {
  var cG=0;
  var child;
  for(var y=0;y<this.children.length;y++){
    if(this.children[y]>=0){
      child = animals[this.children[y]];
    } else {
      child = graveyard[-(this.children[y]+1)];
    }
    if(child.children.length>0){ // if this descendant has children, dont tally cG.
      cG+= child.recurseCountDetrimentals(x, i, k);
    }else if(this.children[y]<0){
      cG++;
    }
  }
  return cG;
}

/*
var pM=this.recurseGetAdvantageous(x, i, k, this.index); // pro delta
var pG=this.recurseCountAdvantageous(x, i, k);
if(pG==0){
 pG++;
} else {
 this.proGenes=pG;
}
pM/=pG; // ave pro
var cM=this.recurseGetDetrimentals(x, i, k, this.index); // con delta
var cG=this.recurseCountDetrimentals(x, i, k);
if(cG==0){
 cG++;
}else {
 this.conGenes=cG;
}
cM/=cG; // ave con
var diff = (pM-cM)/2; // dist between pro & con. // diff too large?

pM*=pG;
pM=(pM+r)/(this.proGenes+1);

return diff+pM;
*/

/*
diff == (pD-cD)/2
del == diff+pD

  g0a2   |g1a1   |g1d0   |pD   |cD   |diff   |del   |NEXT   |
a)   -1.5    -1.2    -1.7   0.3  -0.2    0.25   0.55   -0.95
b)      2     2.3     2.7   0.3   0.7    -0.2    0.1     2.1
c)   -0.5     0.4    -0.6   0.9  -0.1     0.5    1.4     0.9
d)    0.5     0.2     0.2  -0.3  -0.3     0.0   -0.3     0.2
e)   -0.5     0.4     0.0   0.9   0.5     0.2    1.1     0.6
f)      2     2.7     2.3   0.7   0.3     0.2    0.9     2.9

diff == (pD-cD)
del == diff+pD
  g0a2   |g1a1   |g1d0   |pD   |cD   |diff   |del   |NEXT   |
g)      1       2       1     1     0       1      2       3
h)      1       1       0     0    -1     0.5    0.5     1.5
*/

/*
Nov 15: TRIED THIS, it was awful

diff == (pD-cD)
del == g0a2-cen
NEXT == g0a2+del+diff
  g0a2   |g1a1   |g1d0   |pD   |cD   |diff   |cen   |del    |NEXT    |
a)   -1.5    -1.2    -1.7   0.3  -0.2     0.5  -1.45   -0.05    -1.05
b)      2     2.3     2.7   0.3   0.7    -0.4    2.5    -0.5      1.1
f)      2     2.7     2.3   0.7   0.3     0.4    2.5    -0.5      1.9
g)      1       2       1     1     0       1    1.5    -0.5      1.5
*/

/*
Tried this: finding center between pro+con. Identical to:

var diff = (pM-cM)/2;
return diff+pM+r;

... which does work well.
diff == (pD-cD)
del == cen-g0a2
NEXT == g0a2+del+diff
  g0a2   |g1a1   |g1d0   |pD   |cD   |diff   |cen   |del    |NEXT    |
a)   -1.5    -1.2    -1.7   0.3  -0.2     0.5  -1.45    0.05    -0.95
b)      2     2.3     2.7   0.3   0.7    -0.4    2.5     0.5      2.1
f)      2     2.7     2.3   0.7   0.3     0.4    2.5     0.5      2.9
g)      1       2       1     1     0       1    1.5     0.5      2.5
*/


/*
//12
// There are only TWO directions: "diff" doesnt work at all!
// Why calculate ANYTHING before dets and advs have both been found? should need at least one of each before finding vec
var pM=this.recurseGetAdvantageous(x, i, k, this.index); // pro delta
var pG=this.recurseCountAdvantageous(x, i, k);
if(pG==0){
  return r;
} else {
 this.proGenes=pG;
}
pM/=pG; // ave pro
var cM=this.recurseGetDetrimentals(x, i, k, this.index); // con delta
var cG=this.recurseCountDetrimentals(x, i, k);
if(cG==0){
  return r;
}else {
 this.conGenes=cG;
}
cM/=cG; // ave con
return (pM+r-cM)/3;
*/
