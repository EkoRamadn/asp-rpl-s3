'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useError } from '@/hooks/useError';
import { Icon } from '@iconify/react';

export function ErrorDialog() {
  const { message, clearError } = useError();

  return (
    <AlertDialog open={!!message}>
      <AlertDialogContent className="dark:bg-[#27272A]">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center justify-center gap-3">
            <Icon icon="line-md:alert-circle" width="24" height="24" /> <span>Error</span>
          </AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogAction onClick={clearError}>OK</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
