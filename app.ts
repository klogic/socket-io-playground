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
  socketclient.on('connect', async () => {
    for (let i = 1; i < 50; i++) {
      const getUser = fetchUsers(socketclient, i);
    }
    res.json({ data: 'just hi' });
  });
});

io.on('connection', (socket: Socket) => {
  socket.on('my other event', (data) => {
    console.log('I got data. will running another function', data.count);
  });
});
const fetchUsers = (socketclient: SocketIOClient.Socket, incrementId: number) => {
  // fetch data and send response back to socket io.
  const fetchUsers = axios
    .get('https://jsonplaceholder.typicode.com/users')
    .then((result) => {
      socketclient.emit('my other event', { data: result.data, count: incrementId });
      return result.data;
    })
    .catch((error) => error.message);

  return fetchUsers;
};
server.listen(port, () => console.log(`Example app listening on port ${port}!`));
