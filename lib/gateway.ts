// Gateway connection utilities
export class GatewayClient {
  private ws: WebSocket | null = null;
  private url: string;
  private token: string;
  private listeners: Map<string, Function[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(url: string, token: string) {
    this.url = url;
    this.token = token;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Convert http/https to ws/wss
        const wsUrl = this.url
          .replace(/^https/, 'wss')
          .replace(/^http/, 'ws');

        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('Gateway connected');
          this.reconnectAttempts = 0;
          // Send auth
          this.send({
            type: 'auth',
            token: this.token,
          });
          resolve();
        };

        this.ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          this.emit(data.type, data);
        };

        this.ws.onerror = (error) => {
          console.error('Gateway error:', error);
          reject(error);
        };

        this.ws.onclose = () => {
          console.log('Gateway disconnected');
          this.attemptReconnect();
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private attemptReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      console.log(`Reconnecting in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    }
  }

  send(data: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(cb => cb(data));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}
