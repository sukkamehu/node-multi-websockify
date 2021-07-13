'use strict'

const net = require('net');
const WebSocketServer = require('ws').Server;

const log = msg => console.log(new Date(), msg);

module.exports = (server, sockets) => {
	let targets = [];
	if(typeof(sockets) == "object"){
		sockets.forEach(t => {
			targets.push({
				host: t.target.split(':')[0],
				port: t.target.split(':')[1],
				connection: {},
				path: t.path
			});
		});
	};

	let clientAddr = null;
	for(let target of targets){

		target.ws = new WebSocketServer({ noServer: true, ...target.path });

		target.ws.on('connection', (client, req) => {
			let cId = Date.now();
			if(!clientAddr) clientAddr = client._socket.remoteAddress;

			target.connection[cId] = net.createConnection(target.port, target.host, () => {
			    log(`${clientAddr} -> Connected to target on ${target.host}:${target.port}`)
			});	
			  
			target.connection[cId].on('data', data => {
				try {
					client.send(data)
				} catch (e) {
					log(`${clientAddr} -> Client closed, cleaning up target`)					
					target.connection[cId].end()
				};
			});
			
			target.connection[cId].on('end', () => {
			    log(`${clientAddr} -> Target disconnected`)					
				client.close()
			});
			
			target.connection[cId].on('error', () => {
			    log(`${clientAddr} -> Connection error`)					
				target.connection[cId].end()
				client.close()
			});

			client.on('message', msg => {
				target.connection[cId].write(msg)
			});

			client.on('close', (code, reason) => {
				log(`WebSocket client disconnected: ${code} [ ${reason} ]`);
				target.connection[cId].end();
			});

			client.on('error', error => {
			    log(`${clientAddr} -> WS Client error`);			
				target.connection[cId].end();
			});

		});
		server.on('upgrade', (request, socket, head) => {
			if(request.url == target.path){
				target.ws.handleUpgrade(request, socket, head, (ws) => {
					target.ws.emit('connection', ws, request);
				});
			};
		});
	}
}
