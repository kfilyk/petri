class Neuron {
    // upon new input, brain signals are initially weak and do not affect creature. Grow stronger over time.
    //why try to determine which input neurons are optimal to start with? Start from simple to complex; Do not attempt all at same time.
    weights1;  // one connection for every other neuron in brain - including input and output neurons
    weights2;  // one connection for every other neuron in brain - including input and output neurons
    //biases;  // over time, collect average synapse strength neuron   
    in=0;
    out=0;

    weight1Deltas1; 
    weight2Deltas1;  

    weight1Deltas2; 
    weight2Deltas2; 

    weight1Deltas3; 
    weight2Deltas3; 

}

Neuron.prototype.init=function(connections, initialized) { // if this.in>=0 return this.in*weights[0]
    this.weights1 = new Float32Array(connections).fill(0)
    this.weights2 = new Float32Array(connections).fill(0)

    for(var i=0; i<initialized; i++) {
        this.weights1[i]= Math.random()+Math.random()-1;
        this.weights2[i]= Math.random()+Math.random()-1;
    }
}

/*
Neuron.prototype.createDeltas=function(connections) { // if this.in>=0 return this.in*weights[0]

    this.weight1Deltas1 = new Float32Array(connections).fill(0) 
    this.weight2Deltas1 = new Float32Array(connections).fill(0) 

    this.weight1Deltas2 = new Float32Array(connections).fill(0) 
    this.weight2Deltas2 = new Float32Array(connections).fill(0) 

    this.weight1Deltas3 = new Float32Array(connections).fill(0) 
    this.weight2Deltas3 = new Float32Array(connections).fill(0) 

    for(var i=0; i<connections; i++) {
        this.weight1Deltas1[i] = Math.random()+Math.random()-1;
        this.weight2Deltas1[i] = Math.random()+Math.random()-1;
        this.weight1Deltas2[i] = Math.random()+Math.random()-1;
        this.weight2Deltas2[i] = Math.random()+Math.random()-1;
        this.weight1Deltas3[i] = Math.random()+Math.random()-1;
        this.weight2Deltas3[i] = Math.random()+Math.random()-1;
        // this.biases[i] = 0 ** this is implicitly done at creation of biases array
    }
}
*/
Neuron.prototype.clamp=function() { // calculates sum of inputs + bias to be used in synapse
    this.out = this.in > 1 ? 1 : (this.in < -1 ? -1: this.in);
}


Neuron.prototype.synapse=function(idx /* d1, d2, d3*/) { // if this.in>=0 return this.in*weights[0]
    //return round(1000*(this.in > 0 ? this.in*(this.weights1[idx]+this.weight1Deltas1[idx]*d1+this.weight1Deltas2[idx]*d2+this.weight1Deltas3[idx]*d3) : this.in*(this.weights2[idx]+this.weight2Deltas1[idx]*d1+this.weight2Deltas2[idx]*d2+this.weight2Deltas3[idx]*d3)))/1000 //+ this.biases[idx];
    return this.in > 0 ? this.in*this.weights1[idx] : this.in*this.weights2[idx] //+ this.biases[idx];
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

    /*
        try this:
        const x = this.in;
        const x2 = x * x;
        this.out = x * (27 + x2) / (27 + 9 * x2);
    */

    // Takes ~130ms to do 10 million of these. Fastet implementation found
    this.out = (Math.exp(2*this.in) -1)/(Math.exp(2*this.in) +1);
}
