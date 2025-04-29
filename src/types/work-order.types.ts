import { Asset } from "react-native-image-picker";

export interface TaskInformationState {
    asset: { assetName: string; assetUUID: string };
    workOrderType: { workOrderTypeName: string; workOrderTypeUUID: string };
    taskDescription: string;
    workPriority: {workPriorityUUID: string, workPriorityName: string};
    images: Asset[];
    imageDescription: string;
    creatorName: string;
    creatorEmail: string;
    creatorNumber: string;
    creatorLocation: string;
    loading: boolean
  }