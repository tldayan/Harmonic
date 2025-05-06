import { DocumentPickerResponse } from "@react-native-documents/picker";

export interface EventInformation {
    eventUUID: string;
    eventName: string;
    createdBy: string;
    eventType: {
      eventTypeName: string;
      eventTypeUUID: string;
    };
    eventDescription: string;
    time: string;
    eventBanner: DocumentPickerResponse[]; 
    loading: boolean;
  }
  