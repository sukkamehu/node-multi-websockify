# node-multi-websockify fork of https://github.com/Simplemnt/node-websockify

[![npm version](https://badge.fury.io/js/%40sukkis%2Fnode-multi-websockify.svg)](https://badge.fury.io/js/%40sukkis%2Fnode-multi-websockify)



Difference of this version to Simplemnt's great work is that this fork adds support also for multiple simultanous WS session to be reached from one port only. Also configuring instance is slightly easier as just single line is required. Should handle also server request upgrading accordingly.


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
