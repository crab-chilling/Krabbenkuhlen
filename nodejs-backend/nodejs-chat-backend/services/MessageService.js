import stompit from "stompit";

class MessageService {
  constructor() {
    this.host = 'localhost';
    this.port = 61613;
    this.destination = '/queue/fr.cpe.spring-app.in';
  }

  async postMessage(message) {
    return new Promise((resolve, reject) => {
      const connectOptions = {
        host: this.host,
        port: this.port
      };

      stompit.connect(connectOptions, (error, client) => {
        if (error) {
          return reject(`Connection error: ${error.message}`);
        }

        const sendOptions = {
          destination: this.destination,
        };

        const frame = client.send(sendOptions);

        frame.write(JSON.stringify(message));
        frame.end();

        client.disconnect();
      });
    });
  }
}

export default new MessageService();
