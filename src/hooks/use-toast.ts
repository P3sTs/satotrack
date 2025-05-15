
// Export toast from the UI component directly to avoid circular dependencies
import { toast as toastOriginal } from "sonner"
import {
  toast as internalToast,
  useToast as internalUseToast,
} from "@/components/ui/use-toast"
import type { ToastProps, ToastActionElement } from "@/components/ui/toast"

export const useToast = internalUseToast
export const toast = internalToast

export type { ToastProps, ToastActionElement };
