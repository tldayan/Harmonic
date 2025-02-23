export const BASE_URL = "https://myharmonic-dev.app/api";

export const ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${BASE_URL}/user/signInUser`,
  },
  ORGANIZATION: {
    FETCH_MODULES: `${BASE_URL}/organization/getOrganizationBasedModules`,
  },
  USER: {
    PROFILE: `${BASE_URL}/user/getUserProfile`
  },
  SOCIAL: {
    MBMESSAGES: `${BASE_URL}/social/getMBMessages`,
    MBATTACHMENTS: `${BASE_URL}/social/getAllMBMessageAttachments`,
    MBMESSAGE_DETAILS: `${BASE_URL}/social/getMBMessageDetails`,
    COMMENTS: `${BASE_URL}/social/getListOfComments`,
    SAVE_MBMESSAGE: `${BASE_URL}/social/saveMBMessage`
  },
  COMMON: {
    CATEGORIES: `${BASE_URL}/common/getAllCategories`,
    CATEGORY_ITEMS: `${BASE_URL}/common/getCategoryItemsForACategory`
  }
};
