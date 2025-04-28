
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
    LastMessage: string;
    LastMessageTimestamp: string;
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
    SenderFirstName?: string;
    SenderLastName?: string;
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

interface OrganizationUser {
  UserUUID: string;
  UserName: string | null;
  FullName: string;
  EmailAddress: string;
  ProfilePicURL: string;
  UserRole: string;
}


interface WorkOrder {
  WorkOrderUUID: string;
  WorkOrderNumber: string;
  WorkOrderTitle: string | null;
  ProblemDescription: string;
  WorkDescription: string;
  WorkPriorityName: string;
  AssetName: string;
  StatusItemName: string;
  StatusItemCode: string;
  ScheduleDateTimeFrom: string;
  ScheduleDateTimeTo: string;
  CreatedByFullName: string;
  CreatedDateTime: string;
  WorkOrderCategories: any[]; // Replace `any` with a proper type if available
  WorkOrderCategoryUUID: string | null;
  CategoryUUID: string | null;
  CategoryName: string | null;
  CategoryItemUUID: string | null;
  CategoryItemName: string | null;
  CategoryItemURL: string | null;
  WorkRequestUUID: string | null;
  WorkRequestNumber: string | null;
}

interface TaskInformationState {
  asset: { assetName: string; assetUUID: string };
  workOrderType: { workOrderTypeName: string; workOrderTypeUUID: string };
  taskDescription: string;
  workPriorityUUID: string;
  images: string[];
  imageDescription: string;
  creatorName: string;
  creatorEmail: string;
  creatorNumber: string;
  creatorLocation: string;
}



interface WorkPriority {
  WorkPriorityId: number;
  WorkPriorityUUID: string;
  WorkPriorityName: string;
  WorkPriorityDescription: string;
  IsDeleted: boolean;
}
