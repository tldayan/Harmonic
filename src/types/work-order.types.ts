import { DocumentPickerResponse } from "@react-native-documents/picker";
import { Asset } from "react-native-image-picker";

export interface WorkOrderInformationState {
    workOrderUUID: string;
    asset: { assetName: string; assetUUID: string };
    workOrderType: { workOrderTypeName: string; workOrderTypeUUID: string };
    problemDescription: string;
    taskDescription: string;
    workPriority: {workPriorityUUID: string, workPriorityName: string};
    images: Asset[];
    attachments: DocumentPickerResponse[]
    attachmentCount: number;
    attachmentDescription: string;
    creatorName: string;
    creatorEmail: string;
    creatorNumber: string;
    creatorLocation: string;
    workOrderStartDate: string;
    crew: {
      fullName: string;
      OrganizationPersonnelUUID: string;
      timings: {
        date: string;         
        selectedTimings: string[];    
      }[];
    }[];     
    crewTimings: {
      [OrganizationPersonnelUUID: string]: {
        ScheduleDateTimeFrom: string;
        ScheduleDateTimeTo: string;
      }
    }
    blockedCrewTimings: {
      date: string;
      blockedTimings: string[];  
    }[]; 
    loading: boolean
  }


export interface Crew {
    UserUUID: string;
    OrganizationPersonnelUUID: string;
    FullName: string;
    EmailAddress: string;
    PhoneNumber: string;
    ProfilePicURL: string;
  }
  
  