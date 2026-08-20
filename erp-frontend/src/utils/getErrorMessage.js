export default function getErrorMessage(error) {
  const data = error?.response?.data;

  // No response from server
  if (!data) {
    return error?.message || "Something went wrong.";
  }

  // Backend returned a plain string
  if (typeof data === "string") {
    return data;
  }

  // Common DRF formats
  if (data.detail) {
    return data.detail;
  }

  if (data.message) {
    return data.message;
  }

  if (data.error) {
    return data.error;
  }

  // DRF non-field errors
  if (Array.isArray(data.non_field_errors)) {
    return data.non_field_errors.join(", ");
  }

  // DRF field validation errors
  const fieldErrors = Object.entries(data).flatMap(
    ([field, messages]) => {
      if (Array.isArray(messages)) {
        return messages.map((message) => `${field}: ${message}`);
      }

      if (typeof messages === "string") {
        return `${field}: ${messages}`;
      }

      return [];
    }
  );

  if (fieldErrors.length > 0) {
    return fieldErrors.join(", ");
  }

  return "Something went wrong.";
}