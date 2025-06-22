import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "../store/store";

export const useCreds = () => {
  return useSelector(
    (state: RootState) => ({
      userUUID: state.auth.userUUID,
      organizationUUID: state.auth.organizationUUID,
    }),
    shallowEqual
  );
};
