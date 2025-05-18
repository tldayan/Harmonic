import { UpdateMode } from 'realm';
import realmInstance from "../../../services/realm";

export const saveUserProfileToRealm = (userProfileData: UserProfile) => {
  try {
    realmInstance.write(() => {
      realmInstance.create('UserProfile', userProfileData, UpdateMode.Modified);
    });
    console.log("✅ Done saving user to Realm");
  } catch (error) {
    console.error("❌ Error saving user to Realm:", error);
  }
};
