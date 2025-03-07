import { AttachmentData } from "./post-types"

export type RootStackParamList = {
    Tabs: undefined
    Auth: undefined
    Hero: undefined
    Comments: {postUUID?: string, attachmentData?: AttachmentData[], createdBy: string}
}

export type ProfileStackParamList = {
    Profile: undefined,
}

export type TabParamList = {
    Social: { 
        question?: string | null; 
        options?: { optionId: number; value: string; errorMessage: string }[] | null 
    };
    Assets: undefined;
    Tasks: undefined;
    Stores: undefined;
    Chat: undefined;
    More: undefined; // Modules
};

