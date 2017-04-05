# Petri
A testing ground for genetic algorithms in a dynamic environment. Note that this program is subject to change as my understanding of these maths progresses.

To further my own understanding, and to push the capabilities of this program, I am absolutely open to criticism and more than happy to accomodate collaboration. More than anything, this project serves to be exploratory, and to provide insight into the potential of machine learning.

# INSTRUCTIONS

1: Right-click on the html file, and use Firefox as the browser to run the program (runs faster than safari/chrome/IE). You may have to zoom out a little, by going to the Firefox menu and clicking View-> Zoom -> Zoom Out.

2: Click "NEW RANDOM 100" to generate a random assortment of creatures. Creatures "eat" the colors red, green, and blue, subtracting them from terrain tiles. Creatures have the ability to sense and eat/interact with each other.

3: Once a few species have taken off, wait a while (~30 min). Creatures will require time to form coherent movements. Stopping and starting, non-cyclic swimming patterns, and extension/rotation of eyes indicate that behaviour paths are forming.

4: When the "NETCHILDREN" graph has stabilized with a value above 1 (Average of one child per current living creature),  you can turn on regress/propagate functions (in the console menu) to accelerate their evolution. Note that these functions are experimental, and will direct them towards having the greatest number of children. Start low, with "REGRESS </1 CHILDREN" and "PROPAGATE ON". Regress causes the genes of unsuccessful creatures (less children) to be taken away from the parents' gene pool. Propogate allows successful creatures (more children) to add their genes to the parents' gene pool. When parent divides, the creature inherits the average of those genes. If you'd like to turn these functions off and let creatures freely mutate, turn propagate off first, then wait ~5 min before turning regress off. 

5: Watch your memory- on my Macbook Pro 2016 using Firefox, The program runs for about 8 hours before the browser crashes. Fortunately, this is more than enough time to witness improvements in creature lifespan/decision making/interaction. When memory runs out eventually, your computer will be fine, but you'll have to close the browser and restart. I will be converting this project to C++ in the future, so to avoid this.

6: Clicking on a living creature in the terrarium or a creatures' name in the highscores will bring up its statics in its main stat card, to the right of the terrarium. Stats are explained below. Clicking the "X" at the top of the stat card will exit the stat card. To view the real-time operations being performed by its brain, click the "B" at the top of the stat card. To browse the creatures descendants, click the "F". To view gene-mutation rates in regards to the creatures physical attributes, click "M". In the brain, weight/bias stats can be viewed by left-clicking any neuron. weight/bias gene-mutation rates can be viewed by right-clicking any neuron.

7: To kill everything off, two options: click "RESET" for a painless death, or click "REGEN TILES ON" so it becomes "REGEN TILES OFF", and let them suffer slowly, you monster. Functionality allowing creatures to be revived/modified/mutated will be added eventually.

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

ATK: Attack- range of (-1, 1). The rate at which the creature wishes to attack/heal (take energy/give energy), where -1 means heal and +1 means attack. The size of the resulting damage is dependent on the creature size; scales accordingly. For now, all attacks are considered a carnivorous action: attacking==eating. 

>>DMG: In damage; recieved

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
