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