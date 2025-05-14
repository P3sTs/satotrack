
import { useToast as useToastOriginal, toast as toastOriginal } from "sonner";

export const useToast = useToastOriginal;
export const toast = toastOriginal;

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};
