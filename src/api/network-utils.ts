import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { userAuthType } from "../types/user-types";
import { apiClient } from "./api-client";
import { ENDPOINTS } from "./endpoints";
import { AttachmentData, CategoryProps } from "../types/post-types";


export const transformFirebaseUser =(authUser: FirebaseAuthTypes.User) => {
    return {
        FirebaseUserUID: authUser.uid,
        PhoneNumber: authUser.phoneNumber || "", 
        EmailAddress: authUser.email || "",
        FirstName: authUser.displayName ? authUser.displayName.split(" ")[0] : "",
        ProfilePicURL: authUser.photoURL || "",
        IsEmailVerified: authUser.emailVerified || false,
        OrganizationURL: "harmonic", 
        UserAuthenticationMaster: getAuthType(authUser.providerData) 
    }
}


  
  export const getAuthType = (providerData: { providerId: string }[]): string | null => {

    if (!providerData || providerData.length === 0) {
      return null; 
    }
  

    for (const profile of providerData) {
      if (profile.providerId === 'google.com') {
        return userAuthType.GOOGLE;
      } else if (profile.providerId === 'password') {
        return userAuthType.EMAIL;
      } else if (profile.providerId === 'phone') {
        return userAuthType.PHONE_NUMBER;
      } else if (profile.providerId === 'microsoft.com') {
        return userAuthType.MICROSOFT;
      } else {
        return 'Unknown'; 
      }
    }
  
    return 'Unknown';
  };
  

  export const getCountryCodes = async() => {

    try {

      const countryCodes = await apiClient(ENDPOINTS.ADDRESS.COUNTRY_CODES, {},{}, "GET")

      return countryCodes.data.Payload

    } catch (err) {
      console.error(err)
    }
    
  }


  export const getUserProfile = async(UserUUID: string) => {

    try {

      const response = await apiClient(ENDPOINTS.USER.PROFILE, {}, {}, "GET", {UserUUID: UserUUID ?? "", LoggedInUserUUID: UserUUID ?? ""})
      return response

    } catch (err) {
      console.log("Error fetching USER PROFILE")
    }

  }




  export const getOrganizationBasedModules = async(UserUUID: string, OrganizationUUID: string  ) => {
    
    try {

      const response = await apiClient(ENDPOINTS.ORGANIZATION.FETCH_MODULES, {}, {}, "GET", {userUUID: UserUUID ?? "", organizationUUID: OrganizationUUID ?? ""});
      return response

    } catch (error) {
      console.log("Error fetching organization based modules")
    }
  }


  export const getUuidBySignIn = async(authUser: FirebaseAuthTypes.User) => {
    
    try {

      const response = await apiClient(ENDPOINTS.AUTH.SIGN_IN, transformFirebaseUser(authUser), {}, 'POST');

      return {UserUUID: response.data.Payload.UserUUID, OrganizationUUID: response.data.Payload.OrganizationUUID}

    } catch (error) {
      console.log("Error fetching organization based modules")
      return { UserUUID: null, OrganizationUUID: null }
    }
  }


  export const getMBMessages = async(userUUID: string, organizationUUID: string, startIndex: number) => {
    try {
      const bodyData = {
        "organizationUUID": organizationUUID,
        "loggedInUserUUID": userUUID,
        "categoryItemUUIds": [],
        "isPrivate": false,
        "startIndex": startIndex,
        "pageSize": 10
      }

      const response = await apiClient(ENDPOINTS.SOCIAL.MBMESSAGES, bodyData,{} ,"POST")
      console.log(response.data.Payload)
      return response.data.Payload

    } catch(err) {
      console.error(err)
    }

  }

  export const getMBMessageAttacment = async(messageBoardUUID: string) => {

    try {

      const attachmentData = await apiClient(ENDPOINTS.SOCIAL.MBATTACHMENTS,{},{},"GET", {messageBoardUUID}) 

    if (attachmentData.data.Payload?.length) {
      return attachmentData.data.Payload;
    }

    return undefined;

    } catch(err) {
      throw err
    }

  }

  

  export const getMBMessageDetails = async(messageBoardUUID: string, loggedInUserUUID: string) => {
    
    try {

      const messageDetails = await apiClient(ENDPOINTS.SOCIAL.MBMESSAGE_DETAILS, {}, {}, "GET", {messageBoardUUID, loggedInUserUUID})
      console.log(messageDetails)
      return messageDetails.data.Payload

    } catch (err) {
      throw err
    }

  }

  export const getListOfComments =  async(messageBoardUUID: string, startIndex: number, getLatest?: boolean) => {

    const bodyData = {
      "messageBoardUUID": messageBoardUUID,
      "startIndex": getLatest ? 0 : startIndex,
      "pageSize": getLatest ? "1" : "10"
    }

    try {

      const comments = await apiClient(ENDPOINTS.SOCIAL.COMMENTS, bodyData , {}, "POST")
      console.log(comments)
      return comments.data.Payload

    } catch (err) {
      console.error(err)
    }

  }


  export const getAllCategories = async(organizationUUID: string, startIndex: number) => {

    
    const bodyData = {
      "OrganizationUUID": organizationUUID,
      "ParentCategoryUUID": null,
      "SearchExpression": "",
      "StartIndex": startIndex,
      "PageSize": 5,
      "ShowInFilter": true
    }

    try {

      const categories = await apiClient(ENDPOINTS.COMMON.CATEGORIES, bodyData, {}, "POST")
      /* console.log(categories.data.Payload) */
      return categories.data.Payload

    } catch(err) {
      throw err
    }

  }


  export const getCategoryItemsForACategory = async(OragnizationUUID: string,CategoryItemUUId: string, startIndex?: number) => {
    
    const bodyData = {
        "OrganizationUUID": OragnizationUUID,
        "ParentCategoryItemUUID": "",
        "CategoryUUID": CategoryItemUUId,
        "SearchExpression": "",
        "StartIndex": startIndex ? startIndex : 0,
        "PageSize": 5
    }

    try {

      const categoryItems = await apiClient(ENDPOINTS.COMMON.CATEGORY_ITEMS,  bodyData, {}, "POST")

      return categoryItems.data.Payload

    } catch (err) {
      console.error(err)
    }
    

  }


  export const saveMBMessage = async(message: string, attachmentUrls: { url: string, type: 'image' | 'video'}[] | AttachmentData[] = [] ,OragnizationUUID: string, UserUUID: string, postCategories: CategoryProps[], messageBoardUUID: string | null = null, postType: "edit" | "post") => {


    let allMBAttachments = attachmentUrls?.map((urlObj) => ({
        Attachment: "Attachment" in urlObj ? urlObj.Attachment : urlObj.url, 
        AttachmentType: "AttachmentType" in urlObj ? urlObj.AttachmentType : urlObj.type, 
        CanBeDownloaded: true,
        AllowDownload: true,
        ...(postType === "post" && {IsDeleted: false}), // Only add isDeleted false if posttype is post
        MessageBoardUUID: null,
        LoggedInUserUUID: UserUUID, 
        AttachmentUUID: "AttachmentUUID" in urlObj ? urlObj.AttachmentUUID : null,
        AttachmentTypeUUID: "AttachmentTypeUUID" in urlObj ? urlObj.AttachmentTypeUUID : null, 
      }));
    

  let allMBCategoryItems = postCategories.map((eachCategory) => {
    return {
      "CategoryItemUUID" : eachCategory.CategoryItemUUID,
      "IsDeleted": eachCategory.isDeleted,
      "MessageBoardCategoryUUID" : eachCategory.MessageBoardCategoryUUID ? eachCategory.MessageBoardCategoryUUID : null
    }
  })

  console.log(allMBCategoryItems)

    const bodyData = {
      "MessageBoardUUID": messageBoardUUID, 
      "AllMBAttachments": allMBAttachments,
      "AllMBCategoryItems": allMBCategoryItems,
      "LoggedInUserUUID": UserUUID,
      "Message": message,
      "OrganizationUUID": OragnizationUUID,
      "SharedMessageBoardUUID": null
    }
    

    const response = await apiClient(ENDPOINTS.SOCIAL.SAVE_MBMESSAGE, bodyData, {}, "POST",{})
    

    console.log(response)
    console.log(response.data)
    return response.data

  }






  export const deleteMBMessageAttachment = async(attachmentUUID: string, MessageBoardUUID: string, UserUUID: string) => {

    const deleteAttachmentBodyData = {
      "AttachmentUUID": attachmentUUID,
      "MessageBoardUUID": MessageBoardUUID,
      "LoggedInUserUUID": UserUUID
    }

    const deleteMBMessageAttachmentResponse = await apiClient(ENDPOINTS.SOCIAL.DELETE_MBMESSAGE_ATTACHMENT, deleteAttachmentBodyData, {}, "POST")
    console.log(deleteMBMessageAttachmentResponse)

    
  }



  export const getCommentReplies = async(messageBoardCommentUUID: string, startIndex: number, getlatest?: boolean) => {

    const bodyData = {
      "MessageBoardCommentUUID": messageBoardCommentUUID,
      "StartIndex": getlatest ? 0 : startIndex,
      "PageSize": getlatest ? 1 : 10,
    }

    try {
      const replies = await apiClient(ENDPOINTS.SOCIAL.COMMENT_REPLIES, bodyData, {} , "POST", {})
          
      return replies.data.Payload

    } catch (err) {
  /*     console.error(err) */
      throw err
    }

  }


  export const saveMBMessageComment = async(comment: string, LoggedInUserUUID: string, MessageBoardUUID?: string, ReplyToMessageBoardCommentUUID?: string, PostUUID?: string) => {

    const bodyData = {
      "MessageBoardCommentUUID": PostUUID ? PostUUID : null,
      "MessageBoardUUID": MessageBoardUUID,
      "Comment": comment,
      "ReplyToMessageBoardCommentUUID": ReplyToMessageBoardCommentUUID ? ReplyToMessageBoardCommentUUID : null,
      "LoggedInUserUUID": LoggedInUserUUID
  }

  try {

    const response = await apiClient(ENDPOINTS.SOCIAL.SAVE_MBMESSAGE_COMMENT, bodyData, {}, "POST")
    console.log(response)
    return response.data.Status
    
  } catch(err) {
    console.error(err)
  }

  }


  export const getOrganizationList = async(userUUID: string) => {

    let bodyData = {
      "UserUUID": userUUID,
      "SearchExpression": ""
    }

    try {

      const oragnizationList = await apiClient(ENDPOINTS.ORGANIZATION.ORGANIZATIONS_LIST, bodyData, {}, "POST")
      
      console.log(oragnizationList.data.Payload)
      return oragnizationList.data.Payload
      
    } catch(err) {
      console.error(err)
    }
    


  }



  export const saveMBMessageLike = async(MessageBoardUUID: string, LoggedInUserUUID: string, LikedValue: number) => {

    let bodyData = {
      "MessageBoardUUID": MessageBoardUUID, //-- Non-nullable
      "LoggedInUserUUID": LoggedInUserUUID, //- For UserUUID, CreatedBy, ModifiedBy
  /*     "IsDeleted" : LikedValue, //-- Liked = 0, Removed like = 1 */
    }

    try {

      const messageResponse = await apiClient(ENDPOINTS.SOCIAL.SAVE_MBMESSAGE_LIKE, bodyData, {}, "POST")
      console.log(messageResponse)
      return messageResponse.data.Payload

    } catch(err) {
      throw err
    }
  }



export const deleteMBMessage = async(messageBoardUUID:string, loggedInUserUUID:string) => {
  try {

    const deleteMBCommentResponse = await apiClient(ENDPOINTS.SOCIAL.DELETE_MBMESSAGE, {}, {}, "GET", {messageBoardUUID, loggedInUserUUID})

    return deleteMBCommentResponse.data
    

  } catch (err) {
    throw err
  }

}


export const reportMBMessageInappropriate = async(loggedInUserUUID:string, MessageBoardUUID: string,reason: string, ) => {

  const bodyData = {
    "LoggedInUserUUID": loggedInUserUUID,
    "MessageBoardUUID": MessageBoardUUID,
    "Reason": reason,
  }

  try {
      const reportMBMessageResponse = await apiClient(ENDPOINTS.SOCIAL.REPORT_MBMESSAGE, bodyData, {}, "POST")
      console.log(reportMBMessageResponse)
    return reportMBMessageResponse.data.Status
  } catch(err) {
    console.log(err)
  }
}


export const reportMBCommentInappropriate = async(loggedInUserUUID:string, MessageBoardCommentUUID: string,reason: string) => {

  const bodyData = {
    "LoggedInUserUUID": loggedInUserUUID,
    "MessageBoardCommentUUID": MessageBoardCommentUUID,
    "Reason": reason,
  }

  try {
      const reportMBCommentResponse = await apiClient(ENDPOINTS.SOCIAL.REPORT_MBMESSAGE_COMMENT, bodyData, {}, "POST")
      console.log(reportMBCommentResponse)
    return reportMBCommentResponse.data.Status
  } catch(err) {
    console.log(err)
  }
}


export const deleteMBComment = async(messageBoardCommentUUID:string, loggedInUserUUID:string) => {

  try {

    const deleteMBCommentResponse = await apiClient(ENDPOINTS.SOCIAL.DELETE_MBMESSAGE_COMMENT, {}, {}, "GET", {messageBoardCommentUUID, loggedInUserUUID})

    return deleteMBCommentResponse.data
    
  } catch (err) {
    console.error(err)
  }

}

export const getListOfLikes = async(messageBoardUUID:string, startIndex: number) => {

  const bodyData = {
    "messageBoardUUID": messageBoardUUID,
    "startIndex": startIndex,
    "pageSize": 10,
    "searchExpression": ""
}

  try {

    const deleteMBCommentResponse = await apiClient(ENDPOINTS.SOCIAL.MESSAGE_LIKES_LIST, bodyData, {}, "POST")

    return deleteMBCommentResponse.data.Payload
    
  } catch (err) {
    console.error(err)
  }

}


export const getChatsList = async(userUUID: string) => {

  try {

    const getChatsListResponse = await apiClient(ENDPOINTS.SOCIAL.GET_CHATS_LIST, {}, {}, "GET", {userUUID})
    console.log(getChatsListResponse)
    return getChatsListResponse.data.Payload

  } catch(err) {
    console.error(err)
  }

}


export const getMessages = async(userUUID: string, ChatMasterUUID: string, timestamp: string) => {

  const bodyData = { 
    "UserUUID": userUUID,
    "ChatMasterUUID": ChatMasterUUID,
    "PageSize": 20,
    "LastMessageTimestamp": timestamp
  }

  try {

    const getMessagesListResponse = await apiClient(ENDPOINTS.SOCIAL.GET_MESSAGES, bodyData, {}, "POST")
    console.log(getMessagesListResponse)
    return getMessagesListResponse.data.Payload

  } catch(err) {
    console.error(err)
  }

}


export const getGroupDetails = async(chatMasterUUID: string) => {

  try {
    const getGroupDetailsResponse = await apiClient(ENDPOINTS.SOCIAL.GET_GROUP_DETAILS, {}, {}, "GET", {chatMasterUUID})
    console.log(getGroupDetailsResponse.data)
    return getGroupDetailsResponse.data.Payload

  } catch(err) {
    console.error(err)
  }

}

export const getGroupMessages = async(userUUID: string, chatMasterUUID: string, timestamp: string) => {
  
  const bodyData = {
    "SenderUUID": userUUID,
    "ChatMasterUUID": chatMasterUUID,
    "PageSize": 20,
    "LastMessageTimestamp": timestamp
  }

  try {
    const getGroupMessagesResponse = await apiClient(ENDPOINTS.SOCIAL.GET_GROUP_MESSAGES, bodyData, {}, "POST")
    return getGroupMessagesResponse.data.Payload

  } catch(err) {
    console.error(err)
  }

}



export const blockUser = async(chatMemberUserUUID: string, userUUID: string, BlockReason: string) => {
  
  const bodyData = {
    "UserUUID": userUUID ,
    "BlockUserUUID": chatMemberUserUUID,
    "BlockReason": BlockReason ? BlockReason : "Block" 
  }

  try {
    const blockResponse = await apiClient(ENDPOINTS.SOCIAL.BLOCK_USER, bodyData, {}, "POST")
    console.log(blockResponse)
    return blockResponse.data.Status

  } catch(err) {
    console.error(err)
  }

}

export const unblockUser = async(chatMemberUserUUID: string, userUUID: string) => {
  
  const bodyData = {
    "UserUUID": userUUID ,
    "BlockUserUUID": chatMemberUserUUID,
  }

  try {
    const unblockResponse = await apiClient(ENDPOINTS.SOCIAL.UNBLOCK_USER, bodyData, {}, "POST")
    return unblockResponse.data.Status

  } catch(err) {
    console.error(err)
  }

}

export const addMembersToGroup = async(chatMasterUUID: string, UserUUID: string, chatMembers: {memberName: string, memberUUID: string}[], organizationUUID: string) => {

  let chatMemberUserUUIDs = chatMembers.map((eachMember) => eachMember.memberUUID)

  const bodyData = {
    "chatMasterUUID": chatMasterUUID ,
    "loggedInUserUUID": UserUUID,
    "chatMemberUserUUIDs": chatMemberUserUUIDs,
    "organizationUUID": organizationUUID,
  }

  try {
    const addGroupMembersResponse = await apiClient(ENDPOINTS.SOCIAL.ADD_GROUP_MEMBERS, bodyData, {}, "POST")
    console.log(addGroupMembersResponse)
    return addGroupMembersResponse.data.Status

  } catch(err) {
    console.error(err)
  }

}

export const getFriendsList = async(userUUID: string) => {

  try {
    const getFriendsListResponse = await apiClient(ENDPOINTS.SOCIAL.GET_FRIENDS_LIST, {}, {}, "GET", {userUUID})
    return getFriendsListResponse.data

  } catch(err) {
    console.error(err)
  }

}


export const getOrganizationUsers = async(organizationUUID: string, searchExpression: string) => {

  const bodyData = {
    "OrganizationUUID": organizationUUID,
    "Count": 15,
    "StartIndex": 0,
    "SearchExpression": searchExpression ? `(RU.FirstName LIKE '%${searchExpression}%' OR RU.LastName LIKE '%${searchExpression}%')` : ""
  }


  try {
    const getOrganizationUsersResponse = await apiClient(ENDPOINTS.ORGANIZATION.GET_ORGANIZATION_USERS, bodyData, {}, "POST")
    console.log(getOrganizationUsersResponse)
    return getOrganizationUsersResponse.data

  } catch(err) {
    console.error(err)
  }

}


export const addAdminToGroup = async(chatMasterUUID: string, userUUID: string, chatMemberUserUUIDs: string[]) => {

  const bodyData = {
    "chatMemberUUIDs": chatMemberUserUUIDs,
    "chatMasterUUID": chatMasterUUID,
    "loggedInUserUUID": userUUID
}

console.log(bodyData)
  try {
    const addAdminToGroupResponse = await apiClient(ENDPOINTS.SOCIAL.ADD_ADMIN_TO_GROUP, bodyData, {}, "POST")
    console.log(addAdminToGroupResponse)
    return addAdminToGroupResponse.data

  } catch(err) {
    console.error(err)
  }

}

export const removeMemberFromAdmin = async(chatMasterUUID: string, userUUID: string, chatMemberUserUUIDs: string[]) => {

  const bodyData = {
    "chatMemberUUIDs": chatMemberUserUUIDs,
    "chatMasterUUID": chatMasterUUID,
    "loggedInUserUUID": userUUID
}

console.log(bodyData)

  try {
    const removeAdminFromGroup = await apiClient(ENDPOINTS.SOCIAL.REMOVE_ADMIN_FROM_GROUP, bodyData, {}, "POST")
    console.log(removeAdminFromGroup)
    return removeAdminFromGroup.data

  } catch(err) {
    console.error(err)
  }

}


export const removeGroupMembers = async(chatMasterUUID: string, userUUID: string, chatMemberUserUUIDs: string[]) => {

  const bodyData = {
    "chatMemberUUIDs": chatMemberUserUUIDs,
    "chatMasterUUID": chatMasterUUID,
    "loggedInUserUUID": userUUID
}

console.log(bodyData)

  try {
    const removeGroupMembersResponse = await apiClient(ENDPOINTS.SOCIAL.REMOVE_GROUP_MEMBERS, bodyData, {}, "POST")
    console.log(removeGroupMembersResponse)
    return removeGroupMembersResponse.data

  } catch(err) {
    console.error(err)
  }

}


export const saveGroup = async(groupName: string, userUUID: string, chatMasterUUID?: string, groupImageURL?: string) => {

  const bodyData = {
    "ChatMasterUUID": chatMasterUUID ? chatMasterUUID : null,
    "ChatMasterName": groupName,
    "ChatMemberLimit": 30,
    "ChatMasterDescription": null,
    "ChatProfilePictureURL": groupImageURL ? groupImageURL : null,
    "ChatProfilePictureURLPercentage": groupImageURL ? 100 : 0,
    "LoggedInUserUUID": userUUID,
    "ChatMembers": []
  }


  try {
    const saveGroupResponse = await apiClient(ENDPOINTS.SOCIAL.SAVE_GROUP, bodyData, {}, "POST")
    console.log(saveGroupResponse)
    return saveGroupResponse.data

  } catch(err) {
    console.error(err)
  }

}


export const inviteMembersToChat = async(userUUID: string,organizationUUID: string,chatMemberUserUUIDs: string[]) => {

  const bodyData = {
    "userUUID": userUUID,
    "chatMembers": chatMemberUserUUIDs,
    "organizationUUID": organizationUUID
  }

  try {
    const inviteMembersToChatResponse = await apiClient(ENDPOINTS.SOCIAL.INVITE_MEMBERS_TO_CHAT, bodyData, {}, "POST")
    console.log(inviteMembersToChatResponse)
    return inviteMembersToChatResponse.data

  } catch(err) {
    console.error(err)
  }

}


export const respondToChatInvite = async(userUUID: string,inviteUUID:string, statusItemCode: string,chatMasterUUID?: string) => {

  const bodyData = {
    "InviteUUID": inviteUUID,
    "InviteFor": chatMasterUUID,
    "StatusCode": "INVITE_STATUS",
    "StatusItemCode": statusItemCode,
    "LoggedInUserUUID": userUUID
}

  try {
    const repondToChatInvite = await apiClient(ENDPOINTS.SOCIAL.RESPOND_TO_CHAT_INVITE, bodyData, {}, "POST")
    console.log(repondToChatInvite)
    return repondToChatInvite.data

  } catch(err) {
    console.error(err)
  }

}

export const getChatInviteDetails = async(LoggedInUserUUID: string, ChatMasterUUID: string) => {

  try {
    const getChatInviteDetails = await apiClient(ENDPOINTS.ALERT.GET_CHAT_INVITE_DETAILS, {}, {}, "GET",{ChatMasterUUID,LoggedInUserUUID})
    console.log(getChatInviteDetails)
    return getChatInviteDetails.data

  } catch(err) {
    console.error(err)
  }

}

