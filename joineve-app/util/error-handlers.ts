import { Toast } from "native-base";
import {
  FieldErrorData,
  GeneralErrorData,
  InternalAPIError,
  InternalStatus,
} from "../api";
import { ROUTES } from "../constants";

type Params = {
  error: InternalAPIError;
  fieldErrorHandler?: (error: FieldErrorData) => unknown;
  navigation?: any;
};

export const handleAPIError = ({
  error,
  fieldErrorHandler,
  navigation,
}: Params) => {
  if (error.internalStatus === InternalStatus.BODY_VALIDATION) {
    fieldErrorHandler?.(error.data as FieldErrorData);
  } else if (error.status !== -1) {
    const errorData = error.data as GeneralErrorData;

    Toast.show({ title: errorData.message });

    if (error.internalStatus === InternalStatus.UNAUTHORIZED)
      navigation?.navigate?.(ROUTES.LOGIN);
  } else {
    Toast.show({ title: "Internet connection problem" });
  }
};
