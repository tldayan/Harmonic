export interface CreatingPostState {
    state: boolean,
    action: string
}

export interface PollOption {
    optionId: number
    value: string
    errorMessage: string
}

export interface PostItemProps {
      MessageBoardUUID: string;     
      Message: string;               
      SharedMessageBoardUUID: string | null;
      ProfilePic: string;           
      FirstName: string;             
      LastName: string | null;      
      NoofLikes: number;              
      NoOfComments: number;           
      UserName: string | null;       
      CreatedDateTime: string;       
      HasLiked: boolean;           
      HasAttachment: boolean;        
      CreatedBy: string;            
      AllMBAttachments: any[];      
      AllMBCategoryItems: Array<{
        MessageBoardCategoryUUID: string;  
        CategoryItemUUID: string;     
        CategoryItemName: string;          
      }>;
  }

  export interface AttachmentData {
    MessageBoardAttachmentUUID: string;
    AttachmentUUID: string;
    Attachment: string;
    AttachmentTypeUUID: string;
    AttachmentType: string;
    CanBeDownloaded: boolean;
    AllowDownload: boolean;
  }

  export interface CommentItemProps {
    MessageBoardCommentUUID: string;
    Comment: string;
    TotalRepliesCount: number;
    CreatedDateTime: string;
    CreatedBy: string;
    UserName: string | null;
    FirstName: string;
    LastName: string | null;
    ProfilePicURL: string;
  }

  export interface ReplyItemProps {
    MessageBoardCommentUUID: string;
    Comment: string;
    TotalRepliesCount: number;
    CreatedDateTime: string;
    CreatedBy: string;
    UserName?: string | null;
    FirstName: string;
    LastName?: string | null;
    ProfilePicURL: string;
  }
  
  
  export interface MessageAttachmentData {
    Attachment: string,
    AttachmentType: string, 
    CanBeDownloaded: boolean,
    AllowDownload: boolean,
    IsDeleted: boolean,
    MessageBoardUUID: string | null,  
    LoggedInUserUUID: string | null, 
    AttachmentUUID: string | null, 
    AttachmentTypeUUID: string | null, 
    MessageBoardCommentUUID: string | null,
  }

  
  export interface CategoryProps {
    categoryUUID: string;
    categoryName: string;
  }