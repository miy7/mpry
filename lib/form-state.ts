import type { FieldErrors, ServerActionState } from "@/lib/view-models";

export const initialServerActionState: ServerActionState = {
  status: "idle",
};

export function buildActionError(
  message: string,
  fieldErrors?: FieldErrors,
): ServerActionState {
  return {
    status: "error",
    message,
    fieldErrors,
    issuedAt: Date.now(),
  };
}

export function buildActionSuccess(message: string): ServerActionState {
  return {
    status: "success",
    message,
    issuedAt: Date.now(),
  };
}
