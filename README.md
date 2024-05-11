# FBB/Box9 Ping Tool
## For Flash Bang Brass / Box 9


Ping Tool is a tool designed for the purpose of monitoring the responsiveness of Art-Net LED receivers on a network. It is a helper tool for [Box 9 Drumline](https://box9d.com) and [Flash Bang Brass](https://flashbangbrass.com) live performances to ensure LED receivers are performing as intended.

- Select predefined LED receivers you wish to monitor on the left
- Monitor their responsiveness on the right

## Features

- Easily see the state of each LED receiver. 
- Responsive design, for easy viewing on mobile devices as well as laptops.
- Pings all receivers once per second from a central control point (ie. laptop, raspberry pi, etc).
- Front-end layout is back-end driven, so the layout remains synchronised across all clients.
- Dockerised for easy installation and deployment across different systems

## ToDo

- Add ability to change the WiFi channel of Ruckus r500.  

## Tech

- Typescript, React, & Material UI for front-end
- Node.js for back-end 
- Express.js for HTML requests (receive list of devices, selected devices and groupings)
- Websockets for low-latency continuous communication between back-end and front-end

## Installation

- Clone this repository
- Make sure you have docker desktop installed
- Open a terminal in the root of the project and run:
```docker-compose up```
- Go to http://localhost:3000
