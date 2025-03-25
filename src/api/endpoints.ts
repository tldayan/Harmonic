export const BASE_URL = "https://myharmonic-dev.app/api";

export const STATUS_CODE = {
  WARNING: 0,
  ERROR: 1,
  SUCCESS: 2
}

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${BASE_URL}/user/signInUser`,
  },
  ADDRESS: {
    COUNTRY_CODES: `${BASE_URL}/address/getAllCountries`
  },
  ORGANIZATION: {
    FETCH_MODULES: `${BASE_URL}/organization/getOrganizationBasedModules`,
    ORGANIZATIONS_LIST: `${BASE_URL}/organization/getOrganizationsList`
  },
  USER: {
    PROFILE: `${BASE_URL}/user/getUserProfile`
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
    GET_GROUP_DETAILS: `${BASE_URL}/social/getGroupDetails`
  },
  COMMON: {
    CATEGORIES: `${BASE_URL}/common/getAllCategories`,
    CATEGORY_ITEMS: `${BASE_URL}/common/getCategoryItemsForACategory`
  }
};
