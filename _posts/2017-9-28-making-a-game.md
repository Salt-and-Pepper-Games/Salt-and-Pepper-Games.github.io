---
layout: post
title: Making a Game
---

We’re making a game. Rather, we made a game. And now are remaking it. That game is (was) Prism. In our second blog post (written ages ago, it seems) we talked a little about history. Our history, Prism's history, all sorts of history. What the game was. But now that it's got a little more meat on its bones, maybe we can talk more about what it's becoming.

We decided to write Prism using a combination of [React](https://reactjs.org/), [Redux](http://redux.js.org/), and [HTML5 canvas elements](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API). Part of this was because we just learned React and Redux and were excited about them. But that's not it! The React-Redux combo offers a simple and extremely customizable UI framework. When we built the game in [Unity](https://unity3d.com/), that was one of our biggest problems: dealing with the weird drag and drop Unity editor, then manipulating UI elements with code was a huge pain. Maybe that was because we were (and still are) Unity rookies. But whatever. React gave us way more control over what our UI looked like, and Redux a way to easily manage that UI.

{% include image.html url="../images/inside-old-level-pack.png" description="Old menus. Not quite wack, but not that nice." %}

{% include image.html url="../images/inside-new-level-pack.png" description="New menus. Way nicer, definitely not wack." %}

Ok great, so we used React and Redux to build the UI for a web app. Big whoop. Everyone does that. That's what it's for! Ok ok, we get it. But you didn't let me finish. One of the good things about working in Unity was that it is, by nature, a game engine. It was built so that people could use to make games. That means it makes it simple to implement a game, with a game lifecycle, start states, end states, sprites, the whole works. So, we had to come up with a way to replicate that functionality ourselves. 

**The Process**

At first, we thought maybe we could keep everything in just React and Redux. After all, then there would be a clear relationship between the game state and the game rendering in the inherent relationship between React and Redux. We could represent the squares with cleverly rendered JSX/HTML elements, and figure out animations through a combination of CSS and JS. This solution presented some problems. It seemed bound to get sloppy, especially if our animations became more sophisticated. Having to keep track of, update, and animate dynamically changing HTML elements would be tricky, especially on bigger game boards with a lot of moving parts.

We came up with a dual-edged solution: first, add a reducer to our existing Redux store to keep track of the state of the game. Second, handle the rendering of the game using an HTML5 canvas element. By subscribing the canvas to the store and giving it access to the store's dispatch, rendering and maintaining game state became connected, much in the way Redux connects to React components. And we used [Konva](https://konvajs.github.io/) to manage our in-game objects, allowing them to be continually updated to represent the current state - or at least to *eventually* render the current state, after animations. Ultimately, we were left with a design where UI and game logic were completely separate, connected only by Redux, the single source of state for the entire application.

This made adding back end storage using [Firebase](https://firebase.google.com/) pretty straightforward. Since the entire application state was in one place, data which was loaded from Firebase and added to the Redux store could then be used both in-game and in the UI. And all the data which we might want to store in Firebase would first be collected in the Redux store. This hugely simplified the two-way communication between the application and Firebase; the only communication required is with the store.

~~~~
             +-----------------+
             |     Firebase    |
             +---+-------^-----+
                 |       |
                 |       |
             +---v-------+-----+      +-----------------+
             |   Redux store   <------+  Input listener |
             +--+--------^----++      +-----------------+
                |        |    |
                |        |    |
+---------------v--+     | +--v-------------+
|   Konva canvas   |     +-+    React UI    |
+------------------+       +----------------+


~~~~

So there it is. With this insight, you can go forth and build a nice game to call your own. In the meantime, we're hoping to have something for you very soon. Stay tuned.

*--Salt and Pepper Games*
