class Neuron {
    // upon new input, brain signals are initially weak and do not affect creature. Grow stronger over time.
    //why try to determine which input neurons are optimal to start with? Start from simple to complex; Do not attempt all at same time.
    // neural connections start
    posWeights;  // one connection for every other neuron in brain - including input and output neurons
    negWeights;  // one connection for every other neuron in brain - including input and output neurons
    //biases;  // over time, collect average synapse strength neuron   
    in=0;
    out=0;
    /*
    this.i1=0; // for recursion...
    this.i2=0;
    this.i3=0;
    this.o1=0;
    this.o2=0;
    this.o3=0;
    */

}

Neuron.prototype.init=function(connections, ignorable) { // if this.in>=0 return this.in*weights[0]
    this.posWeights = new Float32Array(connections).fill(0)
    this.negWeights = new Float32Array(connections).fill(0)

   // this.biases = new Float32Array(connections).fill(0)

    for(var i=0; i<connections-ignorable; i++) {
        this.posWeights[i]= Math.random()*2-1;
        this.negWeights[i]= Math.random()*2-1;

        // this.biases[i] = 0 ** this is implicitly done at creation of biases array
    }
}

Neuron.prototype.clamp=function() { // calculates sum of inputs + bias to be used in synapse
    this.out = this.in > 1 ? 1: (this.in < -1 ? -1: this.in);
}


Neuron.prototype.synapse=function(idx) { // if this.in>=0 return this.in*weights[0]
    return (this.in > 0 ? this.in*this.posWeights[idx] : this.in*this.negWeights[idx]) //+ this.biases[idx];
}


// used by nothing, currently
Neuron.prototype.tanh=function() { // calculates sum of inputs + bias to be used in synapse
        
    /*
    // Takes ~200ms to do 10 million of these
    this.out = Math.tanh(this.in); 
    */

    /*
    // Takes ~130ms to do 10 million of these
    var e = Math.exp(2*this.in) 
    this.out = (e-1)/(e+1);
    */

    // Takes ~130ms to do 10 million of these. same as above
    this.out = (Math.exp(2*this.in) -1)/(Math.exp(2*this.in) +1);
}