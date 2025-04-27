import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import useNotificationAlert from "./useNotificationAlert";

type ErrorResponse = {
  extensions?: { field?: string };
  message: string;
};

export const useHandleErrors = <T extends FieldValues>() => {
  const { showErrorNotification } = useNotificationAlert();
  const handleErrors = (errors: ErrorResponse[], setError: UseFormSetError<T>) => {
    const fieldErrors: Record<string, string> = {};

    errors.forEach((error) => {
      const field = error.extensions?.field as string | undefined;
      const message = error.message;
      if (field) {
        fieldErrors[field] = message;
        setError(field as unknown as Path<T>, { type: "manual", message });
      }
    });

    // Alert the first error message
    const firstErrorMessage = errors[0]?.message;
    if (firstErrorMessage) {
      showErrorNotification(firstErrorMessage || "Something went wrong");
    }

    console.error("Mapped field errors:", fieldErrors);
  };

  const handleCatchError = (error: any) => {
    if (error?.message) {
      showErrorNotification(error.message);
    } else {
      showErrorNotification("An unexpected error occurred");
      console.error("Unhandled error:", error);
    }
  };

  return { handleErrors, handleCatchError };
};