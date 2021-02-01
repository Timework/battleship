Readme

This is a battleship game where you can play against a computer AI with 4 difficulties available.

Rules

You cannot place ships next to each other.

If you land an attack or sink a ship you can attack again.

There are 5 ships, one ship that is 5 squares long, one ship that is 4 squares long, two ships that are 3 squares long and one ship that is 2 squares long.

Easy Difficulty

Shoots at random all the time regardless if it hits a ship or not.

Medium Difficulty

Shoots at random but if it hits a ship will hit around the area of the hit until the ship is sunk, is not smart enough to know what axis the ship is on based on the hits.

Hard Difficulty

Shoots at random but if it hits a ship will hit around the area of the hit until the ship is sunk, if it lands two hits will know what axis the ship is on and will not longer hit the sides of the ship

Very Hard Difficulty

Has two modes of attacking

First mode uses a weighted random system. The AI runs through all possible ship placements and then gives each spot a weight based on the number of possabilities of a ship being on them. For example if a square has a weight of 4 and another square has a weight of 16 then the second square has 4 times the chance of being selected than the first square. The weight is updated after every attack based on the remaining ships.

After half of all possible options (1040) have been eliminated the AI begins to attack the highest probablity square. If there is more than one square tied for the highest weight then the square is chosen at random amongst the high weighted squares.

Regardless of the attack mode the AI will not attack squares that have a zero possability of a ship being on them.

The AI is also able to determine the axis of the ship based on the successful attacks.

Furthermore the AI will be able to determine whether the ship could be along the axis as all and if it is not then it will not attack squares along that axis. For example, if the smallest ship yet to be sunk is 4 square long and the AI has landed a hit but the y-axis including the spot hit has only room for a 3 square ship then the AI will know that it is not possible for the ship to be along the y-axis and will only attack spots on the x-axis. 

The AI will also constantly check to see if the ship can fit on the axis after an attack fails. For example,if the smallest ship not yet sunk is 3 squares and if the x-axis is 5 squares long including the square hit but after a failed attack the x-axis only has room for a two squared ship then the AI will know that the ship cannot be on the x-axis and will only attack spots on the y-axis.

On all difficulties the AI places ships at random, the AI will never do illegal ship placement.

This project uses node and the following packages.

browserify link:https://www.npmjs.com/package/browserify

draggable link:https://www.npmjs.com/package/draggable


General Color Scheme is inspired by https://visme.co/blog/website-color-schemes/ 9. Deep Purples and Blues.

Button design is from https://1stwebdesigner.com/20-amazing-pure-css-animated-buttons/ 3. More Animated CSS Buttons.

Header font is from google fonts Press Start 2P.

Radio Button design is from https://freefrontend.com/css-radio-buttons/ CSS Styling Radio Buttons.

Input Text design is from https://freefrontend.com/css-input-text/ Form Label After Input Text.