import { messageModel } from "./messager.model.js";

class ChatManager {
    async getMessages() {
        return await messageModel.find().lean();
    }

    async createMessage(messages) {
        return await messageModel.create(messages);
    }
}

export default ChatManager;