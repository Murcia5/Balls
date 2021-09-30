const WebSocket = require('ws');
//const { v4: uuidv4 } = require('uuid');

const wss = new WebSocket.Server({ port: 8080 });

const clients = new Map();

wss.on('connection', (ws) => {
    const id = uuidv4();
    const color = Math.floor(Math.random() * 360);
    const metadata = { id, color };
	console.log((new Date()) + ' New user connected with id ' + id);
    clients.set(ws, metadata);
    
    ws.on('message', (messageAsString) => {
		const message = JSON.parse(messageAsString);
      	const metadata = clients.get(ws);

      	message.sender = metadata.id;
      	message.color = metadata.color;
      	
      	//console.log((new Date()) + ' Message received from user ' + id + ' = ' + messageAsString);
      	
    	const outbound = JSON.stringify(message);

      	[...clients.keys()].forEach((client) => {
        	client.send(outbound);
      	});
    });
    
    ws.on("close", () => {
      clients.delete(ws);
      	console.log((new Date()) + ' User ' + id + ' disconnected');
      	[...clients.keys()].forEach((client) => {
        	client.send(JSON.stringify({ kill: id }));
      	});
    });
    
    ws.send(JSON.stringify({ pid: id }));
    
    /*clients.forEach((value,key)=>{
    	if (value.id != id)
    	{
    		console.log((new Date()) + ' New user ' + id + ' sent!');
			key.send(JSON.stringify({ new_player: id }));;
		}
	})*/
    
})

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

console.log((new Date()) + ' Server is listening on port 8080');

