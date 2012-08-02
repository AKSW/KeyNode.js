# KeyNode.js - Node.js Server

Broadcast the events sent by the presenter to each client watching the presentation.

## Start the Server

Start it with:

	`node ./server/keynode.js.server.js`

	
## How to set up the Server

All configurations are located in `keynode.js.server_settings.js`

- `preTag<type>` - this is written before each \<type\> of the server

- `standardPassword` - the default password for the presentations

- `Server_Port` - the port the server listens on

- `allow_new_presentations` - whether the server should accept new presentations or not

- `debug` - if it runs in debug mode (more logging)

## Requirements

- `fs` file functions for node

- `nodemailer` Mailerfunctions (only for public use)	 
- `request` requestfunctions (only for public use)	 
