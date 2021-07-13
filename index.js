'use strict'

const net = require('net')
const WebSocketServer = require('ws').Server


module.exports = (server, sockets) => {
	let targets = []
	if(typeof(sockets) == "object"){
		sockets.forEach(t => {
			targets.push({
				host: t.uri.split(':')[0],
				port: t.uri.split(':')[1],
				connection: {},
				path: t.path
			})
		})
	}	 

	let clientAddr = null;
	for(let target of targets){
		let p = target.path;

		target.ws = new WebSocketServer({ noServer: true, p })

		target.ws.on('connection', (client, req) => {
			if(!clientAddr) clientAddr = client._socket.remoteAddress
			console.log(req ? req.url : client.upgradeReq.url)
			const log = msg => console.log(' ' + clientAddr + ': ' + msg)
			// log('WebSocket connection from : ' + clientAddr)
			// log('Version ' + client.protocolVersion + ', subprotocol: ' + client.protocol)
			let ended = true;
			if(target.connection._readableState){
			  ended = target.connection._readableState.ended
			}	
			if(ended){
				target.connection = net.createConnection(target.port, target.host, () => {
					target.active = true;
					log('connected to target')
				})
			}		
			  

			  target.connection.on('data', data => {
				try {
				  client.send(data)
				} catch (e) {
				  log("Client closed, cleaning up target")
				  target.connection.end()
				}
			  })
			  target.connection.on('end', () => {
				log('target disconnected')
				target.active = false;
				client.close()
			  })
			  target.connection.on('error', () => {
				log('target connection error')
				target.connection.end()
				client.close()
			  })
			  client.on('message', msg => {
				target.connection.write(msg)
			  })
			  client.on('close', (code, reason) => {
				log(`WebSocket client disconnected: ${code} [ ${reason} ]`)
				target.connection.end()
			  })
			  client.on('error', error => {
				log('WebSocket client error: ' + error)
				target.connection.end()
			  })
			
			
		});
		server.on('upgrade', (request, socket, head) => {
			if(request.url == target.path){
				target.ws.handleUpgrade(request, socket, head, (ws) => {
					target.ws.emit('connection', ws, request);
				});
			}
		});
	}
}
