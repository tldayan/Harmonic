import { UpdateMode } from 'realm';
import realmInstance from "../../../services/realm";

export const saveUserProfileToRealm = (userProfileData: UserProfile) => {
  try {
    realmInstance.write(() => {
      realmInstance.create('UserProfile', userProfileData, UpdateMode.Modified);
    });

    const savedProfile = realmInstance
      .objects<UserProfile>('UserProfile')
      .filtered('UserUUID == $0', userProfileData.UserUUID)[0];

    console.log("✅ Saved UserProfile:", JSON.stringify(savedProfile, null, 2));
  } catch (error) {
    console.error("❌ Error saving user to Realm:", error);
  }
};
