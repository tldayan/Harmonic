export interface CreatingPostState {
    state: boolean,
    action: string
}

export interface PollOption {
    optionId: number
    value: string
    errorMessage: string
}

interface BasePostProps {
  FirstName: string;
  LastName: string | null;
  UserName: string | null;
  CreatedDateTime: string;
  CreatedBy: string;
}

export interface PostLikeProps extends BasePostProps {
  MessageBoardLikeUUID: string;
  TotalLikesCount: number;
  ProfilePicURL: string; 
}

export interface PostItemProps extends BasePostProps {
  MessageBoardUUID: string;
  Message: string;
  SharedMessageBoardUUID: string | null;
  ProfilePic: string; 
  NoofLikes: number;
  NoOfComments: number;
  HasLiked: boolean;
  HasAttachment: boolean;
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
    isDeleted: boolean
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
/*     IsDeleted: boolean, */
    MessageBoardUUID: string | null,  
    LoggedInUserUUID: string | null, 
    AttachmentUUID: string | null, 
    AttachmentTypeUUID: string | null, 
    MessageBoardCommentUUID: string | null,
  }



  
  export interface CategoryProps {
      MessageBoardCategoryUUID?: string | null
      CategoryItemUUID: string;
      CategoryItemName: string;
      isDeleted?: boolean
      existing?: boolean
/*     categoryUUID: string;
    categoryName: string; */
  }

  export interface EditPostState  {
    state: boolean;
    updatedEdit: string;
    postUUID: string;
  };

  export interface FirebaseAttachment { 
    url: string,
    type: 'image' | 'video'
  }