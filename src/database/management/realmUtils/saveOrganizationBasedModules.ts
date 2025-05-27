import { UpdateMode } from 'realm';
import realmInstance from '../../../services/realm';

export const saveOrganizationBasedModules = (modulesData: any) => {
  try {
    realmInstance.write(() => {
      modulesData.forEach((module: any) => {
        realmInstance.create('OrganizationBasedModules', module, UpdateMode.All);
      });
    });
    console.log("✅ Done saving OrganizationBasedModules to Realm");
  } catch (error) {
    console.log("❌ Error saving OrganizationBasedModules to Realm:", error);
  }
};
