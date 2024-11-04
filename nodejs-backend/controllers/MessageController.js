import MessageService from "../services/MessageService.js";

class MessageController {
    constructor() {}

    async postMessage (request, response, next) {
        try {
            await MessageService.postMessage(request.body);
            response.sendStatus(200); // return empty response
        } catch (error) {
            next(error);
        }
    }
}

export default new MessageController();