# petri
A testing ground for genetic algorithms in a dynamic environment. Note that this program is subject to change as my own knowledge progresses.

INSTRUCTIONS:
1.RUN IN FIREFOX!
2: Click "NEW RANDOM 100" to generate a random assortment of creatures.
3: Wait about an hour. Petris require some time to deviate from a non-cyclic swimming pattern (rotating only CW/CCW). Deviations indicate that behaviour pathways are forming out of the initially random generation. By the one hour mark, fluxuations in speed, eye position, and stimuli response will become more noticable- however, note that most of these actions will still be random/useless to the creature. In the meantime...

***************************
LEGEND: Clicking on any creature will bring up several statics to the right of the terrarium. In order from top left to bottom right, those stats are:

(COLUMN 1)
NAME (Creature name): (4 letters) + "dash" + (generation number) + (living/dead status) + (number of children) // EXAMPLE: XLHX-1A15
IDX (Index in living OR dead array): (index #) 
PAR (parent name): (4 characters) + "dash" + (generation number) + (living/dead status) + (number of children) // EXAMPLE: XLHS-0D2

POS (position): (x-pixel), (y-pixel)
DIR (direction): (360 degrees; Y-axis inverted)
VEL (velocity): (+- number)
ROT (rotation): (+- number)
HLTH (health): (+- number in range [-1, 1])
DTRI (deterioration): (represents mounting cell damage)

(COLUMN 2)
SMAX (Maximum creature size): (body diameter in pixels)
SIZE (current size): (body diameter in pixels)
SMIN (Minimum creature size): (body diameter in pixels)

ATK (attack): (+- float value)
HERB/CARN: (eat type)
EATR/G/B: (eat colour)
FNRG+: (max food energy)
FNRG-: (min food energy)

MUTA: (random mutation rate a)

->DMG: (Damage recieved)
DMG->: (Damage caused)
