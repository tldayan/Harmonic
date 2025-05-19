import Realm from 'realm';
import UserProfile, { UserVerificationStatus } from "../database/entities/User";
import { ModuleOperation, OrganizationBasedModules } from "../database/entities/OrganizationBasedModules"; 
import UserAddress from '../database/entities/UserAddress';

export const realmConfig = {
  schema: [UserProfile, ModuleOperation, OrganizationBasedModules, UserAddress, UserVerificationStatus],
  schemaVersion: 1,
};

const realmInstance = new Realm(realmConfig);


export const clearRealmData = async () => {
  const realm = await Realm.open(realmConfig); 
  realm.write(() => {
    realm.deleteAll();
  });

};

export default realmInstance;
