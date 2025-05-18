import Realm from 'realm';

class UserAddress extends Realm.Object<UserAddress> {
  UserAddressUUID!: string;
  AddressUUID!: string;
  IsDefault!: boolean;
  UseForCommunication!: boolean;
  UseForBilling!: boolean;
  FullName?: string | null;
  PhoneCountryId?: number | null;
  PhoneCountryName?: string | null;
  PhoneNumber?: string | null;
  CountryId?: number | null;
  CountryName?: string | null;
  StateId?: number | null;
  StateName?: string | null;
  CityId?: number | null;
  CityName?: string | null;
  StreetId?: number | null;
  StreetName?: string | null;
  PostCode?: string | null;
  AddressLine1?: string | null;
  AddressLine2?: string | null;
  NearestLandmark?: string | null;

  static schema = {
    name: 'UserAddress',
    primaryKey: 'UserAddressUUID',
    properties: {
      UserAddressUUID: 'string',
      AddressUUID: 'string',
      IsDefault: 'bool',
      UseForCommunication: 'bool',
      UseForBilling: 'bool',
      FullName: 'string?',
      PhoneCountryId: 'int?',     
      PhoneCountryName: 'string?',
      PhoneNumber: 'string?',
      CountryId: 'int?',            
      CountryName: 'string?',
      StateId: 'int?',              
      StateName: 'string?',
      CityId: 'int?',               
      CityName: 'string?',
      StreetId: 'int?',             
      StreetName: 'string?',
      PostCode: 'string?',
      AddressLine1: 'string?',
      AddressLine2: 'string?',
      NearestLandmark: 'string?',
    },
  };
}

export default UserAddress;
