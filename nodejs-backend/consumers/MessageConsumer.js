import stompit from 'stompit';

class MessageConsumer {
    constructor(io) {
        this.io = io;
        this.host = 'localhost';
        this.port = 61613;
        this.destination = process.env.ACTIVEMQ_QUEUE || '/queue/fr.cpe.nodejs-app.in';
    }

    start() {
        const connectOptions = {
            host: this.host,
            port: this.port
        };

        stompit.connect(connectOptions, (error, client) => {
            if (error) {
                return console.error(`Connection error: ${error.message}`);
            }

            const subscribeOptions = {
                destination: this.destination
            };

            client.subscribe(subscribeOptions, (error, message) => {
                if (error) {
                    console.error(`Subscribe error: ${error.message}`);
                    return;
                }

                message.readString('utf-8', (error, body) => {
                    if (error) {
                        return console.error(error);
                    }
                    this._handleMessage(body)
                });
            });
        });
    }

    _handleMessage(message) {
        const obj = JSON.parse(message);
        obj['node'] = 'OK';
        this.io.emit('notify', JSON.stringify(obj));
    }
}

export default MessageConsumer;
