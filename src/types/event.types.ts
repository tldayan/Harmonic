import { DocumentPickerResponse } from "@react-native-documents/picker";



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
  eventStartDateTime: string;
  eventEndDateTime: string
  eventBanner: DocumentPickerResponse[]; 
  loading: boolean;
}
