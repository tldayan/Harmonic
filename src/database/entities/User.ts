import Realm from 'realm';

class UserProfile extends Realm.Object<UserProfile> {
  UserUUID!: string;
  FirstName?: string;
  LastName?: string;
  EmailAddress!: string;
  GenderUUID?: string;
  CountryUUID?: string;
  NationalityUUID?: string;
  PhoneCountryUUID?: string;
  PhoneNumber?: string;
  DateOfBirth?: string;
  CreatedDateTime!: string;
  ProfilePicURL?: string;
  BannerURL?: string;

  static schema = {
    name: 'UserProfile',
    primaryKey: 'UserUUID',
    properties: {
      UserUUID: 'string',
      FirstName: 'string?',
      LastName: 'string?',
      EmailAddress: 'string',
      GenderUUID: 'string?',
      CountryUUID: 'string?',
      NationalityUUID: 'string?',
      PhoneCountryUUID: 'string?',
      PhoneNumber: 'string?',
      DateOfBirth: 'string?',
      CreatedDateTime: 'string',
      ProfilePicURL: 'string?',
      BannerURL: 'string?',
    },
  };
}

export default UserProfile;
