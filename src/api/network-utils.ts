
import { FirebaseAuthTypes } from "@react-native-firebase/auth"
import { userAuthType } from "../types/user-types";
import { apiClient } from "./api-client";
import { ENDPOINTS, STATUS_CODE } from "./endpoints";
import { AttachmentData, CategoryProps, MessageAttachmentData } from "../types/post-types";


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
      console.error(err)
    }

  }

  

  export const getMBMessageDetails = async(messageBoardUUID: string, loggedInUserUUID: string) => {

    try {

      const messageDetails = await apiClient(ENDPOINTS.SOCIAL.MBMESSAGE_DETAILS, {}, {}, "GET", {messageBoardUUID, loggedInUserUUID})
      console.log(messageDetails)
      return messageDetails.data.Payload

    } catch (err) {
      console.error(err)
    }

  }

  export const getListOfComments =  async(messageBoardUUID: string, startIndex: number) => {

    const bodyData = {
      "messageBoardUUID": messageBoardUUID,
      "startIndex": startIndex,
      "pageSize": "10"
    }

    try {

      const comments = await apiClient(ENDPOINTS.SOCIAL.COMMENTS, bodyData , {}, "POST")
      console.log(comments)
      return comments.data.Payload

    } catch (err) {
      console.error(err)
    }

  }


  export const getAllCategories = async(organizationUUID: string) => {

    
    const bodyData = {
      "OrganizationUUID": organizationUUID,
      "ParentCategoryUUID": null,
      "SearchExpression": "",
      "StartIndex": 0,
      "PageSize": 0,
      "ShowInFilter": true
    }

    try {

      const categories = await apiClient(ENDPOINTS.COMMON.CATEGORIES, bodyData, {}, "POST")
      /* console.log(categories.data.Payload) */
      return categories.data.Payload

    } catch(err) {
      console.error(err)
    }

  }


  export const getCategoryItemsForACategory = async(OragnizationUUID: string,CategoryItemUUId: string) => {

    const bodyData = {
        "OrganizationUUID": OragnizationUUID,
        "ParentCategoryItemUUID": "",
        "CategoryUUID": CategoryItemUUId,
        "SearchExpression": "",
        "StartIndex": 0,
        "PageSize": 5
    }

    try {

      const categoryItems = await apiClient(ENDPOINTS.COMMON.CATEGORY_ITEMS,  bodyData, {}, "POST")

      return categoryItems.data.Payload

    } catch (err) {
      console.error(err)
    }
    

  }


  export const saveMBMessage = async(message: string,imageUrls: string[] = [] ,OragnizationUUID: string, UserUUID: string, postCategories: CategoryProps[]) => {

    const allMBAttachments = imageUrls?.map((url) => ({
      Attachment: url, 
      AttachmentType: "image", 
      CanBeDownloaded: true,
      AllowDownload: true,
      IsDeleted: false,
      MessageBoardUUID: null,
      LoggedInUserUUID: UserUUID, 
      AttachmentUUID: null,
      AttachmentTypeUUID: null, 
      MessageBoardCommentUUID: null, 
  }));

  let allMBCategoryItems = postCategories.map((eachCategory) => {
    return {
      "CategoryItemUUID" : eachCategory.categoryUUID,
      "IsDeleted": false,
      "MessageBoardCategoryUUID" : null
    }
  })

    const bodyData = {
      "AllMBAttachments": allMBAttachments,
      "AllMBCategoryItems": allMBCategoryItems,
      "LoggedInUserUUID": UserUUID,
      "Message": message,
      "OrganizationUUID": OragnizationUUID,
      "SharedMessageBoardUUID": null
    }
    

    const response = await apiClient(ENDPOINTS.SOCIAL.SAVE_MBMESSAGE, bodyData, {}, "POST",{})
    console.log(response.data)
    return response.data.Status

  }



  export const getCommentReplies = async(messageBoardCommentUUID: string, startIndex: number) => {

    const bodyData = {
      "MessageBoardCommentUUID": messageBoardCommentUUID,
      "StartIndex": startIndex,
      "PageSize": 10,
    }

    try {
      const replies = await apiClient(ENDPOINTS.SOCIAL.COMMENT_REPLIES, bodyData, {} , "POST", {})
          
      return replies.data.Payload

    } catch (err) {
      console.error(err)
    }

  }


  export const saveMBMessageComment = async(comment: string, LoggedInUserUUID: string, MessageBoardUUID?: string, ReplyToMessageBoardCommentUUID?: string, PostUUID?: string) => {

    const bodyData = {
/*       "MessageBoardCommentId": null, */
      "MessageBoardCommentUUID": PostUUID ? PostUUID : null,
      "MessageBoardUUID": MessageBoardUUID,
      "Comment": comment,
      "ReplyToMessageBoardCommentUUID": ReplyToMessageBoardCommentUUID ? ReplyToMessageBoardCommentUUID : null,
      "LoggedInUserUUID": LoggedInUserUUID
  }

  try {

    const response = await apiClient(ENDPOINTS.SOCIAL.SAVE_MBMESSAGE_COMMENT, bodyData, {}, "POST")

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
      "IsDeleted" : LikedValue, //-- Liked = 0, Removed like = 1
    }

    try {

      const messageResponse = await apiClient(ENDPOINTS.SOCIAL.SAVE_MBMESSAGE_LIKE, bodyData, {}, "POST")
      console.log(messageResponse.data)
      return messageResponse.data.Payload

    } catch(err) {
      console.error(err)
    }
  }



export const deleteMBMessage = async(messageBoardUUID:string, loggedInUserUUID:string) => {
  try {

    const deleteMBCommentResponse = await apiClient(ENDPOINTS.SOCIAL.DELETE_MBMESSAGE, {}, {}, "GET", {messageBoardUUID, loggedInUserUUID})

    return deleteMBCommentResponse.data
    

  } catch (err) {
    console.error(err)
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


