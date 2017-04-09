# Petri
Hello, this program is used for evolving successful neural-network "species" using genetic algorithms. Please note that it is still in early development. To further my own understanding, and to push the capabilities of this program, I am absolutely open to criticism and more than happy to accommodate collaboration. More than anything, this project serves to be exploratory in nature. 

# INSTRUCTIONS

1: Run the program by clicking on the html file. The program runs fastest when using Firefox or Google Chrome. You may have to zoom out, by going to the display bar menu and selecting View -> Zoom Out.

2: Click "NEW RANDOM 100" to generate a random assortment of creatures. Tiles are initiallized with maximum colour values. Colour value  is synonymous with food. Creatures "eat" the colors red, green, and blue, subtracting them from terrain tiles. A "positive" tile will have colour, and give the creature energy. A "negative" tile will appear grey, and take energy away from the creature. Creatures will require time to form coherent behaviours and other movements. Stopping and starting, non-cyclic swimming patterns, and extension/rotation of eyes indicate that behaviour paths are forming. Given enough time, creatures will evolve the ability to sense and respond to one another.

3: Whenever you'd like, you can turn on the REGRESS and PROPAGATE functions located in the console menu, in order to accelerate the evolution of the creatures. Note that these functions are experimental- they make "having the greatest number of children" the "successful" direction of evolution. Start low, with "REGRESS < 1 CHILDREN" and "PROPAGATE ON". More info on these functions is coming.

4: REGRESS causes the genes of unsuccessful creatures (with less children) to be subtracted from the parents' gene pool. PROPAGATE allows successful creatures (with more children) to add their genes to the parents' gene pool. When the parent divides, the new creature inherits the average of those genes. If you'd like to turn these functions off and let creatures freely mutate, turn propagate off first, then wait ~5 min before turning regress off. 

5: Watch your memory- on my Macbook Pro 2016 using Firefox, The program runs for about 8 hours before the browser crashes. This is more than enough time to witness improvements in creature lifespan/decision making/interaction. When memory runs out eventually, your computer will be fine, but you'll have to close the browser and restart. I will be converting this project to C++ in the future, so to avoid this.

6: Left-clicking on a living creature in the terrarium, or on a creatures' name in the highscore chart, will bring up its statics in an info-card, to the right of the terrarium. More detail on stats is in the "STATS section below.

7: At the top of the info-card are a row of menu buttons:

Left-clicking the "X" will exit the info-card. 

Left-clicking the "B" will display a map of the creatures' brain, including neuron connections and real-time operations. More detail on the the brain is in the "BRAIN" section below.

Left-clicking the "F" will display the descendants of the creature. All related-creature names are left-clickable, and will pull up that creature's info-card.

Left-clicking the "M" will display the gene-mutation rates in regards to the creatures physical attributes.

8: Graphs are used in the console to represent rates of change over generations and over time. Data is recorded every 100 frames, when used to calculate rates of change over time. Data is recorded when creatures die, when used to calculate rates of change over generations.

AVEFER: Average Food-Energy-Ratio- Depicts the average amount of positive food energy that currently living creatures have consumed, compared to the total food energy they have consumed.

AVECHILDREN: Average Children: Depicts the average number of children that currently living creatures have had

9: To reset the simulation, click "RESET". Functionality allowing creatures to be revived/modified/mutated is soon to come.

# BRAIN

Each creature has a brain consisting of 8 layers, with 42 neurons per layer. The first layer receives inputs from the creature's actions/environment. The last layer consists of creature outputs.

Each neuron recieves an input signal in accordance to the softsign function:

x/(1+abs(x))

This function was used as opposed to the sigmoid or ReLU, because of its softer gradient between its range extremities (-1, 1). Furthermore, softsign is efficient in comparison to sigmoid, non-linear in comparison to ReLU, and allows positive and negative weights and biases to be used.

Each neuron contains 84 weights and 42 biases. Initial weight and bias values are randomly selected using a box-muller distribution with variance=1 and mean=0, then divided in half. This allows for more flexiblility in mutation rate upon initialization. The 84 weights are initialized as two copies of the same initial weight value. One weight is used if the input value positive, and the other if the input is negative. These two weight values may diverge over several generations. They allow the output value to have two rates of change, depending on the sign of the input.
 
Left-clicking any neuron brings up its weight and bias values. Right-clicking any neuron brings up its weight and bias gene-mutation rates.

# STATS

(COLUMN 1)

NAME: (4 characters representing animal name) + "-" + (generation number) + (living/dead status: "A" = ALIVE / "D" = DEAD) + (number of children) // EXAMPLE: XLHX-1A15

IDX: Index in either living/dead array

PAR: (4 characters representing parent name) + "-" + (generation number) + (living/dead status) + (number of children) // EXAMPLE: XLHS-0D2

CNO: Child number- index in parents' children array

GENO: (Number of descendant creature mutations included in genome)/(Number of descendants)

NRG: Life energy of creature. Negative number implies dead

NETNRG: Total positive energy accumulated

TOP: Position in highscores chart

B$: Brain Cost- the absolute sum of all weights and biases in all neurons in the creature brain, averaged over the number of neurons. B$ is a constant, subtracted from creatures energy change at each frame

POS: (center x position in pixels), (center y position in pixels)

DIR: 360 direction in degrees; Y-axis inverted as per Javascript

VEL: Speed in pixels

ROT: Speed of rotation in degrees

HLTH: Health- range of [-1, 1], where -1 means dead and +1 means (current energy) == (maximum positive energy)

AGE: Number of frames creature has been alive

(COLUMN 2)

SMAX: Maximum body diameter in pixels

SIZE: Current body diameter in pixels

SMIN: Minimum body diameter in pixels

ATK: Attack- range of (-1, 1). The rate at which the creature wishes to attack/heal (take energy/give energy), where -1 means heal and +1 means attack. The size of the resulting damage is dependent on the creature size; scales accordingly. For now, all attacks are considered a carnivorous action: attacking==eating

(IN)DMG: In damage; recieved

DMG>>: Out damage; caused

DTRI: Deterioration- Constant which grows as creature consumes toxic tiles/gets attacked, halved when a creature reproduces

HERB/CARN: Eat type- blank means minimal decision

EATR/G/B: Eat colour

ECH+: Maximum (positive) energy change

ECH-: Minimum (negative) energy change

MAXFNRG: Maximum (positive) food energy

MINFNRG: Minimum (negative) food energy

NETFNRG: Absolute sum of positive and negative food energy accumulation over lifetime

POSFNRG: Sum of positive food energy accumulation over lifetime

FER: Food Energy Ratio- (POSFNRG)/(NETFNRG)

(COLUMN 3)

(MTILE: mouth current terrain tile) + (MPOS: (mouth x-pixel), (mouth y-pixel))

(MDISRES: Mouth distance response sensitivity to decision output) + (MDIRRES: Mouth direction response sensitivity to decision output) +  + ("!!!": Detected creature)

VELRES: (Velocity response sensitivity to decision output)

ROTRES: (Rotation response sensitivity to decision output)

EYE: (Eye number) + (DISRES: Eye distance response sensitivity to decision output) + (DIRRES: Eye direction response sensitivity to decision output) + ("!!!": Detected creature)

MUTA: Mutation rate- steers random body color mutation 
