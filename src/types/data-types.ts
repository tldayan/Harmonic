
interface Category {
  CategoryUUID: string;
  CategoryName: string;
  CategoryDescription: string | null;
  CategoryIcon: string | null;
  CategoryBanner: string | null;
  CategoryURL: string;
  ModuleCoreUUID: string | null;
  IsSystemCategory: boolean | null;
  IsEditable: boolean;
  ShowInFilter: boolean;
  ShowInFavorite: boolean;
  NoOfChildren: number;
  HasChildren: number;
  hasMoreChildCategories: boolean;
  nestedCategories: NestedCategory[];  // nested categories
}

interface NestedCategory {
    CategoryItemUUID: string;
    CategoryUUID: string;
    CategoryItemName: string;
    CategoryItemDescription: string | null;
    CategoryItemIcon: string | null;
    CategoryItemBanner: string | null;
    CategoryItemURL: string;
  }

  interface Organization {
    OrganizationUUID: string;
    OrganizationName: string;
    OrganizationURL: string;
    OrganizationLogo: string | null;
    OrganizationShortLogo: string | null;
    StatusItemUUID: string | null;
    StatusItemName: string | null;
    CreatedDateTime: string | null;
    ModifiedDateTime: string | null;
    IsDeleted: boolean;
  }


   interface ChatEntity {
    ChatMasterUUID: string;
    ChatMasterName: string;
    ChatMemberUserUUID: string;
    ChatProfilePictureURL: string | null;
    ChatTypeUUID: string;
    ChatTypeCode: "GROUP_CHAT" | string;
    CreatedDateTime: string; // ISO Date format
    ModifiedDateTime: string | null;
    UserUUID: string;
    LoggedInUserInviteStatusItemUUID: string;
    LoggedInUserInviteStatusItemCode: "APPROVED" | string;
  };


  

  interface MessageStatus {
    DeliveredTo: string[];
    ReadBy: string[];
  }
  
  interface ChatMessage {
    id: string;
    SenderUUID: string;
    Message: string;
    MessageType: "system-generated" | "user-generated";
    Attachment: string;
    AttachmentType: string;
    Timestamp: string;
    Status: {
      DeliveredTo: string[];
      ReadBy: string[];
    };
/*     IsRead: boolean; */
    UserUUID: string;
    SenderFirstName: string;
    SenderLastName: string;
  }
  
  
  
  

interface GroupDetails {
  ChatMasterUUID: string;
  ChatMasterName: string;
  ChatMasterDescription: string | null;
  ChatTypeUUID: string;
  ChatProfilePictureURL: string | null;
  CreatedDateTime: string;
  ChatMembers: ChatMembers[];
}

interface ChatMembers {
  ChatMemberUUID: string;
  ChatMemberTypeCode: string;
  ChatMemberTypeUUID: string;
  ChatMemberTypeName: string;
  UserUUID: string;
  CreatedDateTime: string;
  FirstName: string;
  LastName: string | null;
  UserName: string | null;
  ProfilePicURL: string;
}

interface Friend {
  UserUUID: string,
  UserName: string,
  FirstName: string,
  LastName: string,
  ProfilePicURL: string
}