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
    DELETE_MBMESSAGE: `${BASE_URL}/social/deleteMBMessage`
  },
  COMMON: {
    CATEGORIES: `${BASE_URL}/common/getAllCategories`,
    CATEGORY_ITEMS: `${BASE_URL}/common/getCategoryItemsForACategory`
  }
};
