# petri
A testing ground for genetic algorithms in a dynamic environment. Note that this program is subject to change as my experience progresses.

INSTRUCTIONS:

1: RUN IN FIREFOX!

2: Click "NEW RANDOM 100" to generate a random assortment of creatures.

3: Wait.

Petris require some time to deviate from a non-cyclic swimming pattern (rotating only CW/CCW). Deviations indicate that desirable behaviours are forming out of the chaos. By 30-45 minutes (Generation  ~10), fluxuations in speed, eye position, and stimuli response will become noticable- note that most of these actions will still be random/useless to the creature. Clicking on any creature will bring up several statics to the right of the terrarium. In order from top left to bottom right, those stats are:

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
