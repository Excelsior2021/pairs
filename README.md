<div align="center">

  <h1>Pairs</h1>
  
  <p>
    An interactive card game for the web.
  </p>

<h4>
    <a href="https://pairs-card-game.vercel.app">View Project</a>
</div>

<br />

<img src="./assets/battleship-demo.png" alt="battleship demo" />

<!-- About the Project -->

## Motivation

When I decided to learn Programming, Python was the first langauge I picked up. Python is a great language, however, building dynamic and interactive applications with a graphical user interface that is easily accessible can prove challenging. Pairs started out initially as a terminal-based game built in Python to showcase and test my Python skills. However, who wants to play a game in the terminal? I didn't even know that was possible until I started the project.

I wanted to make the application interative with a user interface that was easy to use and could be shared easily on the web. This is how I fell into JavaScript and web development. Pairs has been through many iterations, UI/UX design changes, refactoring code for performance and best practices, adding new features. I continue to work on the project with these implementations to test new programming and web development concepts.

The tech stack has changed over these iterations also, from a pure Python application to React => React + TypeScript + SASS => SolidJS + TypeScript + SASS. An express server was also implemented for the multiplayer feature, which uses the Socket.IO library which enables real-time, bi-directional communication between web clients and servers, a prominent feature for online multiplayer games.

<!-- TechStack -->

## Tech Stack (Current)

### Client

- SolidJS
- SASS
- TypeScript

### [Server](https://github.com/Excelsior2021/pairs-server)

- Express
- TypeScript
- Socket.IO

### Dev

- Jest
- Solid Testing Library

## Approach

The current approach for this project on the frontend is to model the game elements as objects following the object-oriented programming paradigm. Previous iterations took a more functional approach. Being a game, I thought it made more sense to model the elements as objects. The application is also event-driven, being a game.

SolidJS was implemented in order to learn the framework. It's in my opinion a better version than React, it's more performant and easier to work with. TypeScript was also implemented for learning. It has however, made me think more about what the code does and improvements have been made because of TypeScript.

I was doing a lot of manual testing to test the application but have realised the importance of automated tests as an application scales and/or becomes more complex. Testing using Jest and Solid Testing library have been implemented to test the frontend, Vitest was used on the backend.

## Deployment

The frontend for Pairs is deployed on Vercel.

## Enhancements

This project can be enhanced with the following features:

- An improved algorithm for the single player computer, for deciding what card to choose.
- Improved UX for multiplayer.
- Improve on the game's logic.
