
import { toast as toastOriginal } from "sonner";
import { type ToastProps as ToastPropsOriginal } from "@/components/ui/toast";
import {
  useToast as useToastOriginal,
  type ToastActionElement,
} from "@/components/ui/use-toast";

export const useToast = useToastOriginal;
export const toast = toastOriginal;

export type ToastProps = ToastPropsOriginal & {
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive" | "success";
};
