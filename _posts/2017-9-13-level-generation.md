---
layout: post
title: Level Generation in Prism
---

When we first developed Prism, we had only four weeks to complete the game. Although we came up with solid mechanics we realized that a puzzle game is only as good as its actual puzzles. It turns out making dozens of unique clever puzzles by hand is both time consuming and difficult. Looking at reviews of other puzzle games, we saw one of the things players consistently wanted was more levels. So we thought why spend our time making dozens of puzzles by hand when we might be able to generate thousands.  

**Early Attempts**  
The first approach we took to this problem was simple. We built a modified version of breadth first search to solve our puzzles. Then we started each level off with a blank grid, except for a player and an exit. First we added blocks until the level was unsolvable, then we added switches until it could again be solved. We repeated this procedure until we could not add anymore blocks without the level becoming complete unsolvable.  

Once we had the levels we wanted to decide how difficult each level was. At the time we decided that the best way to do this was to implement a heuristic function which walked along the shortest path and decided based on a combination of factors (such as number of switches pulled, length of path, etc) how difficult the level was.  

We then decided to put this heuristic back into the generation function. Instead of just using it to classify how difficult the level was, we tried to used it to make levels of certain difficulties. We would only add blocks or switches to the level if they helped move the heuristic towards its target value.  

This worked well for the first build of the game. However there were drawbacks to this approach. One large one was the time it took to generate a level. Our breadth first search algorithm which was run at every step of the generation algorithm was O(nm) where n is the width and m is the height of the level. Because we were adding blocks randomly until the path was blocked or unblocked, we may have to run this search anywhere from hundreds to thousands of times per generation. This made generating large levels (10x10 or more) very difficult.  


Another problem was that we would sometimes get repeat levels (especially for large levels).  

**Looking at Another Dimension of the Problem**  

![3d-puzzle-diagram]({{ site.baseurl }}/images/3d-puzzle-diagram.png)

When we came back to the level generation this year we decided to try to come up with a better generation process. One key insight into designing this new generator was that we could think of our levels as a bunch of 2D floors stacked on top of each other. These stacks form a 3D grid with color as the third dimension. With this approach each level becomes a 3D grid of dimension WxHx8 (8 is the total number of background colors). Moving from one floor to another can be thought of as hitting a switch of the appropriate color in the 2D view of the levels. For example moving from the blue floor to the purple floor is the same as hitting a red switch with a blue background. This makes a huge difference in how we can think about the problem intuitively. In the 2D puzzle each cell holds multiple pieces of data with many possibilities for their values. It can be an empty cell, a block, or a switch, and it must also have a color if it’s not an empty cell. The sheer complexity makes it a difficult problem to turn over in your head. In contrast, in the 3D model, each cell only has one boolean property - is it empty or blocked. The color can be follows from the floor and the type can be determined by looking at the entire column: what does the cell look like under every possible background color?  

**Turning the tables**  

The second insight was that we could apply standard maze generation techniques to our 3D grid if we applied just a few key restrictions. The basic idea of these algorithms is that we can "tunnel" around a grid to make a spanning tree. We realized that we had been thinking about how to add blocks to an empty grid in the previous approach when we could instead generate a level by carving a path out of a completely full 3D grid (all unpassable blocks). To turn it into a valid puzzle for Prism, we just need to smash all the floors together by mapping each column in the 3D puzzle to a block/switch type in the 2D puzzle. This is what makes Prism a challenging game; it’s a 3D puzzle compressed into 2D.  


**Current Algorithm**  

The biggest hurdle we needed to get over in order to generate levels was to translate the 3D structure into a graph structure - a set of a vertices and edges, where each vertex represents a square and each edge from a square to another means that is a valid move for the player to go from the first square to the other. Maze generation for a graph is really simple, and there are [plenty of solid and time-efficient algorithms](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Graph_theory_based_methods) for doing it. They work by generating spanning trees for the graph, which is a tree of vertices such that every possible cell is visited without creating any cycles. This tree carves out a maze through the 3D puzzle with a few nice properties.  
1. Since there are no cycles in the path, there are no possible shortcuts. If you pick two passable cells in the puzzle, there is always exactly one way to get from one cell to the other without backtracking.
	* A byproduct of this is that you will never need to visit the same square on the same floor twice. This makes sense intuitively - in the 2D puzzle, if you’re at the same square with the same background color, you’ve made no progress.
2. The tree explores as much as possible. Adding any unexplored vertex to the tree would result in a cycle.  

**Results**  

In contrast to the previous guess-check-repeat algorithm, which struggled to generate levels above 10x10, the graph-based algorithms runs in O(n^2) time and has no problem generating 100x100 levels extremely quickly. The levels generated are also very reliable, because they satisfy the properties of a spanning tree of a graph.	