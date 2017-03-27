# petri
A testing ground for genetic algorithms in a dynamic environment. Note that this program is subject to change as my experience progresses.

# INSTRUCTIONS

1: Open zip file.

2: Right-click on html file, choose firefox as browser (runs faster than safari/chrome/IE)

3: Click "NEW RANDOM 100" to generate a random assortment of creatures.

4: Wait for five minutes. Most of the initial random petris will die. If the population dies out COMPLETELY, click "NEW RANDOM 100" again... this is the only thing to do, really, until I figure out how to ensure a base number of random petris are capable of surviving at the start. On average, expect the survival/propagation of 2 or 3 of the initial petris. 

5: Once a small population has began to take off, wait another 55 minutes for anything interesting to happen.  Petris require time to deviate from unintelligent swimming patterns (rotating only CW/CCW, not moving, eating black tiles, eating their own species, etc). Stopping and starting, non-cyclic swimming patterns, and the extension/rotation of eyes (small circles) will indicate that desirable behaviour paths are forming. Note that when fluxuations in speed, eye position, and stimuli response DO become noticable, most of these actions will still be random/useless to the creature. 

6: Watch your memory, and expect to run out eventually. When this happens, the simulation will stop/browser will crash. Your computer will be fine, but you'll have to close the browser and restart the simulation. That being said, I am working on a version of this code/other projects in c++, so this no longer is an issue. 

# STATS
Clicking on any creature will bring up several statics to the right of the terrarium. In order from top left to bottom right, those stats are:

(COLUMN 1)

NAME: (4 characters representing animal name) + "dash" + (generation number) + (living/dead status) + (number of children) // EXAMPLE: XLHX-1A15

IDX: (Index in either living/dead array)

PAR: (4 characters representing parent name) + "dash" + (generation number) + (living/dead status) + (number of children) // EXAMPLE: XLHS-0D2

POS: (center x position in pixels), (center y position in pixels)

DIR: (360 direction in degrees; Y-axis inverted)

VEL: (+- speed)

ROT: (+- speed of rotation)

HLTH: (+- representation of health in range [-1, 1], where -1 is dead, 1 is full health)

DTRI: (represents mounting cell deterioration)

(COLUMN 2)

SMAX: (Maximum body diameter in pixels)

SIZE: (current body diameter in pixels)

SMIN: (Minimum body diameter in pixels)

ATK: (+- attack value)

HERB/CARN: (eat type)

EATR/G/B: (eat colour)

FNRG+: (maximum gained food energy)

FNRG-: (minimum gained food energy)

MUTA: (random mutation rate a)

->DMG: (Damage recieved)

DMG->: (Damage caused)

(COLUMN 3)

MTILE: (mouth current terrain tile) MX: (mouth x-pixel) MY: (mouth y-pixel)

MSENRES: (Mouth sense1 response sensitivity to output) MSEN2RES: (Mouth sense2 response sensitivity to output)

MDISRES: (Mouth distance response sensitivity to output) MDIRRES: (Mouth direction response sensitivity to output)

VELRES: (Velocity response sensitivity to output)

ROTRES: (Rotation response sensitivity to output)

ATKRES: (Attack response sensitivity to output)

MEMRES: (Memory input 1-8 response sensitivity to output)
