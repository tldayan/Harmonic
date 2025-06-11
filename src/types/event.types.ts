import { DocumentPickerResponse } from "@react-native-documents/picker";

export interface Event {
  EventUUID: string;
  EventName: string;
  EventDescription: string;
  EventIcon: string | null;
  EventBanner: string;
  EventStartDateTime: string;
  EventEndDateTime: string;
  CreatedBy: string
  PublishDateTime: string;
  EventStatus: string;
  StatusItemCode:  string;
  EventTypeUUID: string;
  EventType:  string;
  EventTypeCode: string;
  NoOfParticipants: number;
  HostFullName: string;
  LoggedInUserParticipationStatus: string | null;
  MaximumPlusOnesAllowedPerParticipant: number | null;
  AllowGuestToBringPlusOnes: boolean;
  MaxParticipantLimit: number | null;
  AllowQueueAfterMaxParticipantLimit: boolean;
  EventRegistrationDetailUUID: string;
  GetInterestBeforeRegistrationStart: boolean;
  AllowedMinimumAge: number | null;
  AllowedMaximumAge: number | null;
  EventRegistrationStartDateTime: string;
  EventRegistrationEndDateTime: string;
  InformationForRegisteredUsers: string | null;
  CanLeaveEvent: boolean;
}


export interface EventInformation {
  eventUUID: string;
  eventName: string;
  createdBy: string;
  eventType: {
    eventTypeName: string;
    eventTypeUUID: string;
  };
  participants: {memberName: string, memberUUID: string, profileURL: string}[];
  eventDescription: string;
  scheduledPublishDateTime: string;
  registrationStartDateTime: string;
  registrationEndDateTime: string;
  eventStartDateTime: string;
  eventEndDateTime: string
  prevEventBanner: string
  eventBanner: DocumentPickerResponse[]; 
  loading: boolean;
  InformationForRegisteredUsers: string
}


export type FormErrorKeys =
  | "eventName"
  | "eventType"
  | "eventDescription"
  | "eventBanner"

export type FormErrors = Partial<
  Record<FormErrorKeys, { hasError: boolean; message?: string }>
>;
