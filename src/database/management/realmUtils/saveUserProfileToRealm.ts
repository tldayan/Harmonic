import { UpdateMode } from 'realm';
import realmInstance from "../../../services/realm";


export const saveUserProfileToRealm = (userProfileData: any) => {
  const realm = realmInstance;


  realm.write(() => {
    realm.create(
      'UserProfile', 
      userProfileData, 
      UpdateMode.Modified
    );
  });
};
