# KeyNode.js - Node.js Server

broadcast the events send by the presenter tu each client watching the Presentation.

## Start the Server

start it with:

	`node ./server/keynode.js.server.js`

	
## How to set up the Server

all configurations where make in the `keynode.js.server_settings.js`

- `preTag<type>` - this is written before each <type> of the Server

- `standardPassword` - the dafault Password for the presentations

- `Server_Port` - the port the server listen on

- `allow_new_presentations` - does the server accept new Presentations

- `debug` - if it runs in debug mode (more logging)