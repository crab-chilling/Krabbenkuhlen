import {Router} from "express";
import MessageController from "../controllers/MessageController.js";

const BASE_PATH = '/messages'

const MessageRouter = Router();

MessageRouter.route(BASE_PATH)
    .post(MessageController.postMessage);

export default MessageRouter;