import { NavigatorScreenParams } from "@react-navigation/native";
import { AttachmentData } from "./post-types"

export type RootStackParamList = {
    Tabs: NavigatorScreenParams<TabParamList>;
    Auth: undefined
    Hero: undefined
    Event: {eventUUID: string}
    Comments: {postUUID?: string, attachmentData?: AttachmentData[], createdBy: string}
    Profile: {userUUID: string}
    ChatScreen: {userUUID: string, chatMasterUUID: string, chatProfilePictureURL: string | null, chatMasterName: string, chatType: string, chatMemberUserUUID: string, createdDateTime: string}
    ChatInfo: {chatMasterUUID: string,chatType: string}
    TaskInfo: {workRequestUUID: string, workRequestNumber?:string}
    EditProfile: undefined
    ChatsScreen: undefined
    AddModal: undefined;
    ProfileForm: undefined
}

export type TabParamList = {
    Social: { 
        question?: string | null; 
        options?: { optionId: number; value: string; errorMessage: string }[] | null 
    };
    Assets: undefined;
    Tasks: undefined;
    Stores: undefined;
    Events: undefined
    Chat: undefined;
    More: undefined; // Modules
    Add: undefined // Add Post/task/event Button
};

