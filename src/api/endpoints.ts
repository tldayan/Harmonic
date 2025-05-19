export const BASE_URL = "https://myharmonic-dev.app/api";

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${BASE_URL}/user/signInUser`,
  },
  ADDRESS: {
    COUNTRY_CODES: `${BASE_URL}/address/getAllCountries`,
    GET_USER_ADDRESS: `${BASE_URL}/address/getUserAddress`,
    GET_ALL_COUNTRIES: `${BASE_URL}/address/getAllCountries`,
    GET_ALL_STATES_FOR_COUNTRY: `${BASE_URL}/address/getAllStatesForCountry`,
    GET_ALL_CITIES_FOR_COUNTRY_AND_STATE: `${BASE_URL}/address/getAllCitiesForCountryAndState`,
    SAVE_USER_ADDRESS: `${BASE_URL}/address/saveUserAddress`
  },
  ORGANIZATION: {
    FETCH_MODULES: `${BASE_URL}/organization/getOrganizationBasedModules`,
    ORGANIZATIONS_LIST: `${BASE_URL}/organization/getOrganizationsList`,
    GET_ORGANIZATION_USERS: `${BASE_URL}/organization/getOrganizationUsers`
  },
  USER: {
    PROFILE: `${BASE_URL}/user/getUserProfile`,
    UPDATE_USER_PROFILE: `${BASE_URL}/user/updateUserProfile`,
  },
  SOCIAL: {
    MBMESSAGES: `${BASE_URL}/social/getMBMessages`,
    MBATTACHMENTS: `${BASE_URL}/social/getAllMBMessageAttachments`,
    MBMESSAGE_DETAILS: `${BASE_URL}/social/getMBMessageDetails`,
    COMMENTS: `${BASE_URL}/social/getListOfComments`,
    SAVE_MBMESSAGE: `${BASE_URL}/social/saveMBMessage`,
    COMMENT_REPLIES: `${BASE_URL}/social/getAllCommentReplies`,
    SAVE_MBMESSAGE_COMMENT: `${BASE_URL}/social/saveMBMessageComment`,
    SAVE_MBMESSAGE_LIKE: `${BASE_URL}/social/saveMBMessageLike`,
    DELETE_MBMESSAGE: `${BASE_URL}/social/deleteMBMessage`,
    DELETE_MBMESSAGE_ATTACHMENT: `${BASE_URL}/social/deleteMBMessageAttachment`,
    REPORT_MBMESSAGE: `${BASE_URL}/social/reportMBMessageInappropriate`,
    REPORT_MBMESSAGE_COMMENT: `${BASE_URL}/social/reportMBCommentInappropriate`,
    DELETE_MBMESSAGE_COMMENT: `${BASE_URL}/social/deleteMBComment`,
    MESSAGE_LIKES_LIST: `${BASE_URL}/social/getListOfLikes`,
    GET_CHATS_LIST: `${BASE_URL}/social/getChatsList`,
    GET_MESSAGES: `${BASE_URL}/social/getMessages`,
    GET_GROUP_DETAILS: `${BASE_URL}/social/getGroupDetails`,
    ADD_GROUP_MEMBERS: `${BASE_URL}/social/addMembersToGroup`,
    GET_GROUP_MESSAGES: `${BASE_URL}/social/getGroupMessages`,
    BLOCK_USER: `${BASE_URL}/social/blockUser`,
    UNBLOCK_USER: `${BASE_URL}/social/unblockUser`,
    GET_FRIENDS_LIST: `${BASE_URL}/social/getFriendsList`,
    ADD_MEMBERS_TO_GROUP: `${BASE_URL}/social/addMembersToGroup`,
    ADD_ADMIN_TO_GROUP: `${BASE_URL}/social/addAdminToGroup`,
    REMOVE_ADMIN_FROM_GROUP: `${BASE_URL}/social/removeMemberFromAdmin`,
    REMOVE_GROUP_MEMBERS: `${BASE_URL}/social/removeGroupMembers`,
    SAVE_GROUP: `${BASE_URL}/social/saveGroup`,
    INVITE_MEMBERS_TO_CHAT: `${BASE_URL}/social/inviteMembersToChat`,
    RESPOND_TO_CHAT_INVITE: `${BASE_URL}/social/respondToChatInvite`,
  },
  WORK_ORDER: {
    GET_WORK_ORDER_LIST: `${BASE_URL}/work-order/getWorkOrderList`,
    GET_WORK_ORDER_TYPES: `${BASE_URL}/work-order/getWorkOrderTypes`,
    SAVE_WORK_ORDER: `${BASE_URL}/work-order/saveWorkOrder`,
    SAVE_WORK_ORDER_ATTACHMENTS: `${BASE_URL}/work-order/saveWorkOrderAttachments`
  },
  WORK_REQUEST: {
    GET_WORK_REQUEST_DETAILS: `${BASE_URL}/work-request/getWorkRequestDetails`,
    GET_WORK_REQUEST_TYPES: `${BASE_URL}/work-request/getWorkRequestTypes`,
    GET_PENDING_WORK_REQUEST_COUNT: `${BASE_URL}/work-request/getPendingWorkRequestCount`,
    GET_WORK_REQUEST_LIST: `${BASE_URL}/work-request/getWorkRequestList`,
    GET_WORK_REQUEST_ATTACHMENTS: `${BASE_URL}/work-request/getWorkRequestAttachments`,
    GET_WORK_REQUEST_HISTORY: `${BASE_URL}/work-request/getWorkRequestHistory`,
    SAVE_WORK_REQUEST_NOTE: `${BASE_URL}/work-request/saveWorkRequestNote`,
    SAVE_WORK_REQUEST: `${BASE_URL}/work-request/saveWorkRequest`,
    SAVE_WORK_REQUEST_ATTACHMENTS: `${BASE_URL}/work-request/saveWorkRequestAttachments`,
    APPROVE_WORK_REQUEST: `${BASE_URL}/work-request/approveWorkRequest`,
  },
  ASSET: {
    GET_ASSET_LIST: `${BASE_URL}/asset/getAssetList`,
  },
  EVENT: {
    GET_EVENT_LIST: `${BASE_URL}/event/getEventList`,
    GET_EVENT_TYPES: `${BASE_URL}/event/getEventTypes`,
    GET_EVENT_DETAILS: `${BASE_URL}/event/getEventDetails`,
    SAVE_EVENT_DETAILS: `${BASE_URL}/event/saveEventDetails`,
    SAVE_EVENT_CONFIGURATION: `${BASE_URL}/event/saveEventConfiguration`,
    SAVE_EVENT_SCHEDULE: `${BASE_URL}/event/saveEventSchedule`,
    PUBLISH_EVENT: `${BASE_URL}/event/publishEvent`,
    JOIN_EVENT: `${BASE_URL}/event/joinEvent`,
    CANCEL_EVENT: `${BASE_URL}/event/cancelEvent`
  },
  ALERT : {
    GET_CHAT_INVITE_DETAILS: `${BASE_URL}/alert/getChatInviteDetails`
  },  
  COMMON: {
    CATEGORIES: `${BASE_URL}/common/getAllCategories`,
    CATEGORY_ITEMS: `${BASE_URL}/common/getCategoryItemsForACategory`,
    GET_WORK_PRIORITIES: `${BASE_URL}/common/getWorkPriorities`,

  }
};
