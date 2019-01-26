import axios from 'axios';
import express, { Request, Response } from 'express';
import ioserver, { Socket } from 'socket.io';
import ioclient from 'socket.io-client';
const app = express();
const server = require('http').Server(app);
const port = 3000;
const io = ioserver(server);

app.get('/', (req: Request, res: Response) => {
  const socketclient = ioclient('http://localhost:' + port);
  socketclient.on('connect', () => {
    socketclient.emit('my other event', { my: 'data' });
  });
  axios
    .get('https://jsonplaceholder.typicode.com/users')
    .then((result) => res.json(result.data))
    .catch((error) => res.json(error.message));
});

io.on('connection', (socket: Socket) => {
  socket.on('my other event', (data) => {
    console.log(data);
  });
});
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
