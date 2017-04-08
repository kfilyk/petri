# Petri
Hello, this program is used for evolving successful neural-network "species" using genetic algorithms. Please note that it is subject to grow in terms of its functionalities, and is still in early development. To further my own understanding, and to push the capabilities of this program, I am absolutely open to criticism and more than happy to accommodate collaboration. More than anything, this project serves to be exploratory in nature. 

# INSTRUCTIONS

1: Run the program by clicking on the html file. The program runs fastest when run on Firefox or Google Chrome. You may have to zoom out, by going to the display bar menu and selecting View -> Zoom Out.

2: Click "NEW RANDOM 100" to generate a random assortment of creatures. Creatures "eat" the colors red, green, and blue, subtracting them from terrain tiles. Given enough time, creatures will evolve the ability to sense and respond to one another.

3: Once a few species have taken off, wait a while (~30 min). Creatures will require time to form coherent movements. Stopping and starting, non-cyclic swimming patterns, and extension/rotation of eyes indicate that behaviour paths are forming.

4: Whenever you'd like, you can turn on the REGRESS and PROPAGATE functions located in the console menu, in order to accelerate the evolution of the creatures. Note that these functions are experimental- they make "having the greatest number of children" the "successful" direction of evolution. Start low, with "REGRESS < 1 CHILDREN" and "PROPAGATE ON". 

5: Regress causes the genes of unsuccessful creatures (less children) to be subtracted from the parents' gene pool. Propogate allows successful creatures (more children) to add their genes to the parents' gene pool. When the parent divides, the new creature inherits the average of those genes. If you'd like to turn these functions off and let creatures freely mutate, turn propagate off first, then wait ~5 min before turning regress off. 

6: Watch your memory- on my Macbook Pro 2016 using Firefox, The program runs for about 8 hours before the browser crashes. Fortunately, this is more than enough time to witness improvements in creature lifespan/decision making/interaction. When memory runs out eventually, your computer will be fine, but you'll have to close the browser and restart. I will be converting this project to C++ in the future, so to avoid this.

7: Clicking on a living creature in the terrarium or a creatures' name in the highscores will bring up its statics in its main stat card, to the right of the terrarium. Stats are explained below. Clicking the "X" at the top of the stat card will exit the stat card. To view the real-time operations being performed by its brain, click the "B" at the top of the stat card. To browse the creatures descendants, click the "F". To view gene-mutation rates in regards to the creatures physical attributes, click "M". In the brain, weight/bias stats can be viewed by left-clicking any neuron. weight/bias gene-mutation rates can be viewed by right-clicking any neuron.

8: To reset the simulation, click "RESET". Functionality allowing creatures to be revived/modified/mutated is soon to come.

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

FNRG+: Maximum (positive) food energy

FNRG-: Minimum (negative) food energy

NETFNRG: Absolute sum of positive and negative food energy accumulation over lifetime

POSFNRG: Sum of positive food energy accumulation over lifetime

FNRG%: (POSFNRG)/(NETFNRG)

(COLUMN 3)

(MTILE: mouth current terrain tile) + (MPOS: (mouth x-pixel), (mouth y-pixel))

(MDISRES: Mouth distance response sensitivity to decision output) + (MDIRRES: Mouth direction response sensitivity to decision output) +  + ("!!!": Detected creature)

VELRES: (Velocity response sensitivity to decision output)

ROTRES: (Rotation response sensitivity to decision output)

EYE: (Eye number) + (DISRES: Eye distance response sensitivity to decision output) + (DIRRES: Eye direction response sensitivity to decision output) + ("!!!": Detected creature)

MUTA: Mutation rate- steers random body color mutation 
