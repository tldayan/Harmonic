import Realm from 'realm';

export class UserVerificationStatus extends Realm.Object<UserVerificationStatus> {
  IsEmailVerified?: boolean;
  IsPhoneNumberVerfied?: boolean | null;

  static schema = {
    name: 'UserVerificationStatus',
    embedded: true,
    properties: {
      IsEmailVerified: 'bool?',
      IsPhoneNumberVerfied: 'bool?',
    },
  };
}


class UserProfile extends Realm.Object<UserProfile> {
  UserUUID!: string;
  UserName?: string;
  FirstName?: string;
  LastName?: string;
  Description?: string;
  EmailAddress!: string;
  GenderUUID?: string | null;
  CountryUUID?: string | null;
  NationalityUUID?: string | null;
  PhoneCountryUUID?: string | null;
  PhoneNumber?: string | null;
  DateOfBirth?: string | null;
  CreatedBy?: string | null;
  CreatedDateTime!: string;
  ModifiedBy?: string | null;
  ModifiedDateTime?: string | null;
  BannerURL?: string | null;
  ProfilePicURL?: string | null;
  UserVerificationStatus?: {
    IsEmailVerified?: boolean;
    IsPhoneNumberVerfied?: boolean | null;
  };
  PhoneNumberWithCode?: string | null;

  static schema = {
    name: 'UserProfile',
    primaryKey: 'UserUUID',
    properties: {
      UserUUID: 'string',
      UserName: 'string?',
      FirstName: 'string?',
      LastName: 'string?',
      Description: 'string?',
      EmailAddress: 'string',
      GenderUUID: 'string?',
      CountryUUID: 'string?',
      NationalityUUID: 'string?',
      PhoneCountryUUID: 'string?',
      PhoneNumber: 'string?',
      DateOfBirth: 'string?',
      CreatedBy: 'string?',
      CreatedDateTime: 'string',
      ModifiedBy: 'string?',
      ModifiedDateTime: 'string?',
      BannerURL: 'string?',
      ProfilePicURL: 'string?',
      UserVerificationStatus: 'UserVerificationStatus?', // embedded object
      PhoneNumberWithCode: 'string?',
    },
  };
}

export default UserProfile;
