import { UseFormSetError } from "react-hook-form";
import { useAlert } from "../notifications/AlertContext";

type ErrorResponse = {
  extensions?: { field?: string };
  message: string;
};

export const useHandleErrors = <T>() => {
  const { showAlert } = useAlert();

  const handleErrors = (errors: ErrorResponse[], setError: UseFormSetError<T>) => {
    const fieldErrors: Record<string, string> = {};

    errors.forEach((error) => {
      const field = error.extensions?.field as string | undefined;
      const message = error.message;
      if (field) {
        fieldErrors[field] = message;
        setError(field as keyof T, { type: "manual", message });
      }
    });

    // Alert the first error message
    const firstErrorMessage = errors[0]?.message;
    if (firstErrorMessage) {
      showAlert(firstErrorMessage || "Something went wrong", "error");
    }

    console.error("Mapped field errors:", fieldErrors);
  };

  const handleCatchError = (error: any) => {
    if (error?.message) {
      showAlert(error.message, "error");
    } else {
      showAlert("An unexpected error occurred", "error");
      console.error("Unhandled error:", error);
    }
  };

  return { handleErrors, handleCatchError };
};