export function createOptimisticWorkRequest(info: {
    WorkRequestUUID:string
    WorkRequestNumber?: string;
    ProblemDescription?: string;
    WorkRequestTypeName?: string;
    AssetName?: string;
    PrimaryRequestor?: string;
    WorkPriorityName?: string
  }): WorkRequest {
    return {
      WorkRequestUUID: info.WorkRequestUUID,
      WorkRequestNumber: info.WorkRequestNumber ?? "N/A",
      WorkRequestTitle: "",
      ProblemDescription: info.ProblemDescription ?? "N/A",
      WorkRequestTypeName: info.WorkRequestTypeName ?? "N/A",
      WorkPriorityName: info.WorkPriorityName ?? "N/A",
      AssetName: info.AssetName ?? "N/A",
      StatusItemName: "Pending",
      StatusItemCode: "PENDING",
      PrimaryRequestor: info.PrimaryRequestor ?? "N/A",
      CountOfAdditionalUsers: 0,
      WorkRequestCategories: [],
      WorkRequestCategoryUUID: null,
      CategoryUUID: null,
      CategoryName: null,
      CategoryItemUUID: null,
      CategoryItemName: null,
      CategoryItemURL: null,
      WorkOrderUUID: null,
      WorkOrderNumber: "N/A"
    };
  }
  