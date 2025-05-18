import Realm from 'realm';
import UserProfile, { UserVerificationStatus } from "../database/entities/User";
import { ModuleOperation, OrganizationBasedModules } from "../database/entities/OrganizationBasedModules"; 
import UserAddress from '../database/entities/UserAddress';

const realmInstance = new Realm({
  schema: [UserProfile, ModuleOperation, OrganizationBasedModules, UserAddress, UserVerificationStatus],
  schemaVersion: 1,
});


export default realmInstance;
