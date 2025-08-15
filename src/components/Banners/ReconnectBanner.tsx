import { Alert, Box } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const ReconnectBanner = () => {
  const [state, setState] = useState({ connected: false, connecting: true });

  useEffect(() => {
    const delayBase = 3000 + Math.floor(Math.random() * 2000);
    // Assuming session token is available somehow, for now I will use a placeholder
    const token = 'mock-token';
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      auth: { token },
      reconnectionDelay: delayBase,
      reconnectionDelayMax: delayBase + 3000,
    });

    socket.on('connect', () => setState({ connected: true, connecting: false }));
    socket.on('disconnect', () => setState({ connected: false, connecting: true }));

    return () => {
      socket.disconnect();
    };
  }, []);

  if (state.connected) {
    return null;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Alert severity={state.connecting ? 'warning' : 'error'}>
        {state.connecting ? 'Connection lost. Reconnecting...' : 'Could not connect to the server.'}
      </Alert>
    </Box>
  );
};

export default ReconnectBanner;
