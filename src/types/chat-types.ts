export type BaseMessage = {
    Message: string;
    SenderUUID: string;
    ChatUUID: string; 
    MessageId: string;
    Attachment: string | null;
    AttachmentType: string | null;
  };
  
export type PrivateMessageReceived = BaseMessage & {
    SenderFirstName: string;
    SenderLastName: string | null;
  };

  
export type GroupMessageReceived = BaseMessage & {
    SenderFirstName?: string;
    SenderLastName?: string;
  };
  