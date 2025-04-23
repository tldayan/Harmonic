import { GroupMessageReceived, PrivateMessageReceived } from "../../types/chat-types";

export const convertToChatMessage = (
    message: PrivateMessageReceived | GroupMessageReceived,
    currentUserUUID: string,
    senderName: string
  ): ChatMessage => ({
    id: message.MessageId,
    SenderUUID: message.SenderUUID,
    Message: message.Message,
    MessageType: "user-generated", 
    Attachment: message.Attachment ?? "",
    AttachmentType: message.AttachmentType ?? "",
    Timestamp: new Date().toISOString(),
    Status: {
      DeliveredTo: [],
      ReadBy: [],
    },
    UserUUID: currentUserUUID,
    SenderFirstName: senderName ?? "",
    SenderLastName: message.SenderLastName ?? "",
  });
  