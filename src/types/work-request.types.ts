import { DocumentPickerResponse } from "@react-native-documents/picker";
import { Asset } from "react-native-image-picker";

export interface WorkRequestInformationState {
    workRequestUUID: string;
    asset: { assetName: string; assetUUID: string };
    workRequestType: { workRequestTypeName: string; workRequestTypeUUID: string };
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
    loading: boolean
  }