import Realm from 'realm';

class ModuleOperation extends Realm.Object<ModuleOperation> {
  ModuleOperationUUID!: string;
  ModuleOperation!: string;
  IsDeleted!: boolean;
  IsPermitted!: boolean;

  static schema = {
    name: 'ModuleOperation',
    primaryKey: 'ModuleOperationUUID',
    properties: {
      ModuleOperationUUID: 'string',
      ModuleOperation: 'string',
      IsDeleted: 'bool',
      IsPermitted: 'bool',
    },
  };
}

class OrganizationBasedModules extends Realm.Object<OrganizationBasedModules> {
  ModuleCoreUUID!: string;
  ParentModuleCoreUUID?: string;
  OrganizationModuleUUID!: string;
  ParentOrganizationModuleUUID?: string;
  ModuleName!: string;
  ModuleURL!: string;
  ModuleCoreURL!: string;
  ModuleIcon?: string;
  IsHiddenInMenu!: boolean;
  IsDefault!: boolean;
  Order!: number;
  ModuleOperations!: ModuleOperation[];
  children!: OrganizationBasedModules[];

  static schema = {
    name: 'OrganizationBasedModules', 
    primaryKey: 'ModuleCoreUUID',
    properties: {
      ModuleCoreUUID: 'string',
      ParentModuleCoreUUID: 'string?',  
      OrganizationModuleUUID: 'string',
      ParentOrganizationModuleUUID: 'string?',  
      ModuleName: 'string',
      ModuleURL: 'string',
      ModuleCoreURL: 'string',
      ModuleIcon: 'string?',  
      IsHiddenInMenu: 'bool',
      IsDefault: 'bool',
      Order: 'int',
      ModuleOperations: 'ModuleOperation[]',  
      children: 'OrganizationBasedModules[]', 
    },
  };
}


export { OrganizationBasedModules, ModuleOperation };
