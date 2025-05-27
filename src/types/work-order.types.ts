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
    crew: {fullName: string, userUUID: string}[]
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
  
  