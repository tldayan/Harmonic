export interface FirebaseUser {
    uid?: string; 
    displayName?: string | null; 
    email?: string; 
    phoneNumber?: string | null; 
    userAuthenticationMaster?: string; 
    photoURL?: string | null; 
    emailVerified?: boolean;
    OrganizationURL?: string;
}

export const userAuthType = {
    EMAIL: "EMAIL",
    GOOGLE: "GOOGLE",
    MICROSOFT: "MICROSOFT",
    PHONE_NUMBER: "PHONENUMBER",
  } as const;


export interface UserSignInRequest {
    UserId?: number;
    UserUUID?: string;
    FirstName?: string;
    EmailAddress?: string;
    PhoneNumber?: string;
    UserAuthenticationMaster?: string;
    FirebaseUserUID?: string;
    ProfilePicURL?: string;
    IsEmailVerified?: boolean;
    OrganizationURL?: string;
  }

  export type UserInfo = {
    profilePic: string;
    userName: string;
    firstName: string;
    lastName: string;
    description: string;
    email: string;
    phoneNumber: string;
    department: string;
    designation: string;
    address: string;
    residingSince: string;
    tenantOf: string;
  };
  