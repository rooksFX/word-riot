export const useWebSocket = () => {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onopen = () => {
  console.log('Connected to server');
  ws.send('Hello Server');
  };

  ws.onmessage = (message) => {
  console.log(`Received from server: ${message.data}`);
  };

  ws.onclose = () => {
  console.log('Disconnected from server');
  };

}