
export type RootStackParamList = {
    Tabs: undefined
    Auth: undefined
    Hero: undefined
}

export type ProfileStackParamList = {
    Profile: undefined,
    Wishist: undefined,
    Reviews: undefined
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

