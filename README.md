
# 2048
This repository contains the classic 2048 game made using React.</br>
### How to play the game -
2048 is a game where you combine numbered tiles in order to gain a higher numbered tile. In this game you start with two tiles, the lowest possible number available is two. Then you will play by combining the tiles with the same number to have a tile with the sum of the number on the two tiles
### --------------------------------------------Discussion Objective-----------------------

# Design principles used:- 
## 1.All the tiles on the board will be a power of 2 like 2, 4, 8, 16, 32, 64, 128,...., 2048.
## 2.There are 4 possible moves: left, right, top, bottom.
## 3.On each move, all the tiles slide in the direction of the move until they are stopped by another tile or an edge.
## 4.A random tile will be inserted at a random empty spot on the board after every move.
## 5.If after sliding, two tiles with the same values collide in the direction of the slide then they will merge into a tile with the value being the total of the collided tiles.
## 6.A merged tile will not merge with another tile in the same move.
## 7.In case 3 consecutive tiles have the same number then the farther tile in the direction of the move will merge. In case all four tiles have the same number then the first two and last two will merge.
## 8.The game is won if the board has a tile numbered 2048.
## 9.The game is lost if there are no possible moves left: No empty tile and no adjacent tiles with the same number.