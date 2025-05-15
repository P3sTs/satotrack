
import { toast as toastOriginal } from "sonner";
import { useToast as useToastHook } from "@/components/ui/use-toast";

export const useToast = useToastHook;
export const toast = toastOriginal;

export type ToastProps = {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: "default" | "destructive" | "success";
};
