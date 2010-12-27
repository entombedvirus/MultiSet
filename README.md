MultiSet
========

This project was born out of my desire to learn [node.js](http://nodejs.org). Only tested on [Google Chrome](http://www.google.com/chrome)

Interesting Bits
================

1. Play in real time with your friends! You can see the cards other players are selecting as they click!
2. Uses websockets to communicate in real time with the server.
3. Degrades to using flash & xhr when websocket is not available. Thanks, [socket.io](http://socket.io)!
2. Chat functionality to talk to fellow players.

Prerequisites
=============

1. [Node v.0.2.5](http://nodejs.org)

Instructions
============

You can run the server using from the project root dir:

    $ node src/server.js

You can access the game at http://localhost:8124/

TODO
====

1. Surface user scores.
2. Leader board of players.
3. Better UX for when you select a non-set.
4. Better UX for when the board is reset.

License
=======

`MultiSet` is released under the MIT License.