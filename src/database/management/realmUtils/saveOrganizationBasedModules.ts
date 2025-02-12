import { UpdateMode } from 'realm';
import realmInstance from '../../../services/realm';


export const saveOrganizationBasedModules = (modulesData: any) => {
  const realm = realmInstance;

  realm.write(() => {
    modulesData.forEach((module: any) => {
      realm.create(
        'OrganizationBasedModules', 
        module, 
        UpdateMode.All
      );
    });
  });
};
