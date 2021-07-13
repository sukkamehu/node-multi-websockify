# node-multi-websockify fork of https://github.com/Simplemnt/node-websockify inspired by [@maximegris/node-websockify](https://github.com/maximegris/node-websockify)

WebSocket-to-TCP proxy/bridge in NodeJS


It is very similar to the aformentioned [@maximegris/node-websockify](https://github.com/maximegris/node-websockify), but the big difference is that library spins up a standalone web server. If you are already using a http server, you would be out of luck. This package lets you do that! Difference of this version to Simplemnt's great work is that this fork adds support also for multiple simultanous WS session to be reached from one port only.


## Installation 

```
npm install --save @sukkis/node-multi-websockify
```

## Usage

```javascript
const websockify = require('@sukkis/node-multi-websockify')
 ...
 ...
websockify(server, [{target: 'localhost:5900', path: '/path1'},{target: 'localhost:5900', path: '/path2'}]) // create websockify servers in array of objects
```
### Express

```javascript
const express = require('express')
const app = express()
const server = require('http').Server(app)

const port = process.env.PORT || 8080

const websockify = require('@sukkis/node-multi-websockify')

server.listen(port, () =>  console.log('listening on *:' + port))
websockify(server, [{target: 'localhost:5900', path: '/path1'},{target: 'localhost:5900', path: '/path2'}]) // create websockify servers in array of objects
```

### http (untested)
```javascript
const http = require('http')

const port = process.env.PORT || 8080

const websockify = require('@sukkis/node-multi-websockify')

const server = http.createServer()
server.listen(port)
websockify(server, [{target: 'localhost:5900', path: '/path1'},{target: 'localhost:5900', path: '/path2'}]) // create websockify servers in array of objects
```
