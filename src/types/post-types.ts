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