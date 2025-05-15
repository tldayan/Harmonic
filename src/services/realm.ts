import Realm from 'realm';
import UserProfile from "../database/entities/User";
import { ModuleOperation, OrganizationBasedModules } from "../database/entities/OrganizationBasedModules"; 

const realmInstance = new Realm({
  schema: [UserProfile, ModuleOperation, OrganizationBasedModules],
  schemaVersion: 1,
});


export default realmInstance;
