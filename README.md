## How to Install/Start
Bash/CMD:

    #1. clone Keynode.JS Server:
    git clone https://github.com/AKSW/KeyNode.js.git -b server keynode.js.server
    cd keynode.js.server
    
    #2. install Required axtensions by running:
    npm install
    
    #3.a) copy configuration file (Bash)
    cp keynode.js.server_settings.js_sample keynode.js.server_settings.js
    #3.b) copy configuration file (Windows)
    copy keynode.js.server_settings.js_sample "keynode.js.server_settings.js"
    
    #4. start Server:
    node keynode.js.server

## Open Presenter

Go to <yourDomain.de>/presenter 

or for local installation [localhost/presenter](http://localhost/presenter)


## Configuration of the Server

[@ Github WIKI](https://github.com/AKSW/KeyNode.js/wiki/server)

# License

    Copyright (C) 2011 Alrik Hausdorf

    This file is part of KeyNode.JS.

    KeyNode.JS is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    KeyNode.JS is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with KeyNode.JS.  If not, see <http://www.gnu.org/licenses/>.