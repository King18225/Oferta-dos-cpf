"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';

const ExitPopup: FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleMouseLeave = useCallback((event: MouseEvent) => {
    if (event.clientY <= 0 || event.clientX <=0 || event.clientX >= window.innerWidth || event.clientY >= window.innerHeight ) {
       if (!sessionStorage.getItem('exitPopupShown')) {
        setIsOpen(true);
        sessionStorage.setItem('exitPopupShown', 'true');
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirmExit = () => {
    setIsOpen(false);
    // User chose to leave, nothing specific to do here as browser handles actual exit.
    // For a real app, you might try to navigate away or close window if opened by script,
    // but this is generally blocked by browsers.
  };
  
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="border-destructive border-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-destructive">⚠️ ATENÇÃO! VOCÊ TEM CERTEZA? ⚠️</AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-foreground">
            Você está prestes a recusar <strong className="text-accent font-bold">R$1.200,00</strong> que já estão pré-aprovados para você!
            Esta é uma oportunidade única.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={handleClose} className="text-lg p-6">
              VOLTAR E GARANTIR
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
             <Button variant="destructive" onClick={handleConfirmExit} className="text-lg p-6">
              SAIR E PERDER
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitPopup;
