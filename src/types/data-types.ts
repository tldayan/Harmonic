interface Category {
  CategoryUUID: string;
  CategoryName: string;
  CategoryDescription: string | null;
  CategoryIcon: string | null;
  CategoryBanner: string | null;
  CategoryURL: string;
  ModuleCoreUUID: string | null;
  IsSystemCategory: boolean | null;
  IsEditable: boolean;
  ShowInFilter: boolean;
  ShowInFavorite: boolean;
  NoOfChildren: number;
  HasChildren: number;
  nestedCategories: NestedCategory[];  // nested categories
}

interface NestedCategory {
    CategoryItemUUID: string;
    CategoryUUID: string;
    CategoryItemName: string;
    CategoryItemDescription: string | null;
    CategoryItemIcon: string | null;
    CategoryItemBanner: string | null;
    CategoryItemURL: string;
  }

  interface Organization {
    OrganizationUUID: string;
    OrganizationName: string;
    OrganizationURL: string;
    OrganizationLogo: string | null;
    OrganizationShortLogo: string | null;
    StatusItemUUID: string | null;
    StatusItemName: string | null;
    CreatedDateTime: string | null;
    ModifiedDateTime: string | null;
    IsDeleted: boolean;
  }
  
  