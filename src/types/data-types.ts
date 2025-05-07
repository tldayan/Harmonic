
interface UserProfile {
  UserId: number
  UserUUID: string
  UserName: string
  FirstName: string
  LastName: string | null
  Description: string | null
  EmailAddress: string
  GenderUUID: string | null
  CountryUUID: string | null
  NationalityUUID: string | null
  PhoneCountryUUID: string | null
  PhoneNumber: string
  DateOfBirth: string
  CreatedBy: string | null
  CreatedDateTime: string
  ModifiedBy: string | null
  ModifiedDateTime: string | null
  ProfilePicURL: string
  BannerURL: string | null
}


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

interface WorkRequest {
  WorkRequestUUID: string;
  WorkRequestNumber: string;
  WorkRequestTitle: string | null;
  ProblemDescription: string;
  WorkRequestTypeName: string;
  WorkPriorityName: string;
  AssetName: string;
  StatusItemName: string;
  StatusItemCode: string;
  PrimaryRequestor: string;
  CountOfAdditionalUsers: number;
  WorkRequestCategories: any[];
  WorkRequestCategoryUUID: string | null;
  CategoryUUID: string | null;
  CategoryName: string | null;
  CategoryItemUUID: string | null;
  CategoryItemName: string | null;
  CategoryItemURL: string | null;
  WorkOrderUUID: string | null;
  WorkOrderNumber: string | null;
}

interface WorkRequestDetails {
  WorkRequestUUID?: string;
  WorkRequestNumber?: string;
  WorkRequestTitle?: string | null;
  ProblemDescription?: string;
  WorkRequestTypeUUID?: string;
  WorkRequestTypeName?: string;
  WorkPriorityUUID?: string;
  WorkPriorityName?: string;
  AssetUUID?: string;
  AssetName?: string;
  StatusItemUUID?: string;
  StatusItemName?: string;
  StatusItemCode?: string;
  PrimaryRequestorUserUUID?: string;
  WorkOrderUUID?: string | null;
  WorkOrderNumber?: string | null;
}

interface WorkRequestAttachment {
  WorkRequestUUID: string;
  WorkRequestAttachmentUUID: string;
  WorkRequestAttachmentName: string | null;
  WorkRequestAttachmentDescription: string | null;
  AttachmentUUID: string;
  Attachment: string;
  CanBeDownloaded: boolean;
  AllowDownload: boolean;
}

interface WorkRequestHistory {
  WorkRequestStatusUUID: string;
  WorkRequestUUID: string;
  StatusItemUUID: string;
  WorkRequestNoteUUID: string | null;
  CreatedDateTime: string; 
  ModifiedDateTime: string | null;
  StatusItemName: string;
  StatusItemCode: string;
  Note: string | null;
  CreatedByFullName: string;
  ModifiedByFullName: string | null;
}



interface WorkPriority {
  WorkPriorityId: number;
  WorkPriorityUUID: string;
  WorkPriorityName: string;
  WorkPriorityDescription: string;
  IsDeleted: boolean;
}


interface AssetCategory {
  AssetCategoryUUID: string;
  CategoryUUID: string;
  CategoryName: string;
  CategoryItemUUID: string;
  CategoryItemName: string;
  CategoryItemURL: string;
}

interface WorkAsset {
  AssetUUID: string;
  AssetURL: string;
  AssetName: string;
  AssetDescription: string;
  AssetTypeUUID: string;
  AssetTypeName: string;
  AssetIcon: string | null;
  ParentAssetUUID: string | null;
  StatusItemName: string;
  StatusItemCode: string;
  CurrentCustodianFullName: string | null;
  CurrentCustodianProfilePicURL: string | null;
  CreatedBy: string;
  CreatedByFullName: string;
  CreatedDateTime: string; // or `Date` if you plan to parse it
  NoOfChildren: number;
  HasChildren: number;
  AssetCategories: AssetCategory[];
  AssetCategoryUUID: string;
  CategoryUUID: string;
  CategoryName: string;
  CategoryItemUUID: string;
  CategoryItemName: string;
  CategoryItemURL: string;
  DepartmentUUID: string | null;
  DepartmentName: string | null;
  DepartmentIcon: string | null;
}

type WorkRequestType = {
  WorkRequestTypeUUID: string;
  WorkRequestTypeName: string;
  WorkRequestTypeDescription: string | null;
};


interface EventCategory {
  CategoryUUID: string | null;
  CategoryName: string | null;
  CategoryItemUUID: string | null;
  CategoryItemName: string | null;
  CategoryItemURL: string | null;
}

interface Event {
  EventUUID: string;
  EventName: string;
  EventDescription: string;
  EventIcon: string | null;
  EventBanner: string;
  EventStartDateTime: string;
  EventEndDateTime: string;
  PublishDateTime: string;
  MaxParticipantLimit: number | null;
  CanLeaveEvent: boolean;
  EventRegistrationStartDateTime: string;
  EventRegistrationEndDateTime: string;
  StatusItemCode: string;
  EventTypeUUID: string;
  EventType: string;
  EventTypeCode: string;
  NoOfParticipants: number;
  HostFullName: string;
  LoggedInUserParticipationStatus: string | null;
  EventCategories: EventCategory[];
  EventUserRoles: any[];
  EventDepartments: any[]; 
}

interface EventType {
  EventTypeId: number;
  EventTypeUUID: string;
  EventType: string;
  EventTypeCode: string;
  EventTypeDescription: string | null;
}

