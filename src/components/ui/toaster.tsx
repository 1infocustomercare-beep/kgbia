import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";

export const Toaster = React.forwardRef<
  React.ElementRef<typeof ToastViewport>,
  React.ComponentPropsWithoutRef<typeof ToastViewport>
>(({ ...props }, ref) => {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...toastProps }) {
        return (
          <Toast key={id} {...toastProps}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport ref={ref} {...props} />
    </ToastProvider>
  );
});

Toaster.displayName = "Toaster";
