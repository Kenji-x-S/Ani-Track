'use client'; // Mark this component as a client-side component

import { useEffect, useState } from 'react';
// import { io, Socket } from 'socket.io-client';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  

// const socket: Socket = io('http://localhost:3001'); // Point to your Socket.IO server

interface OnlineUsers {
  mobile: number;
  web: number;
}

export default function ClientSocketComponent() {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUsers>({ mobile: 0, web: 0 });

  // useEffect(() => {
  //   // Emit that this user is a web user
  //   socket.emit('userType', 'web');

  //   // Listen for the online users update
  //   socket.on('onlineUsers', (data: OnlineUsers) => {
  //     setOnlineUsers(data);
  //   });

  //   return () => {
  //     socket.disconnect();
  //   };
  // }, []);

  console.log(onlineUsers.web)

  return (
        <Card className='mb-4'>
            <CardHeader>
                <CardTitle>Active users</CardTitle>
            </CardHeader>
            <CardContent>
                <h1>Web Users: {onlineUsers.web}</h1>
                <h1>Mobile Users: {onlineUsers.mobile}</h1>
            </CardContent>
        </Card>
  );
}
