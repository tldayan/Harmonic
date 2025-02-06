import Realm from 'realm';
import UserProfile from "../database/entities/User";
import { ModuleOperation, OrganizationBasedModules } from "../database/entities/OrganizationBasedModules"; 

const realmInstance = new Realm({ 
  schema: [UserProfile, ModuleOperation , OrganizationBasedModules]
});

export default realmInstance;
