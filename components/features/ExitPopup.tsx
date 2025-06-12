
"use client";

import type { FC } from 'react';
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
    // User chose to leave.
  };
  
  if (!isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="border-destructive border-2">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-headline text-2xl text-destructive">⚠️ TEM CERTEZA QUE QUER SAIR? ⚠️</AlertDialogTitle>
          <AlertDialogDescription className="text-lg text-foreground">
            Seus <strong className="text-accent font-bold">R$1.200,00</strong> serão cancelados se você sair agora!
            Esta é sua última chance de garantir o benefício.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel asChild>
            <Button variant="destructive" onClick={handleConfirmExit} className="text-lg p-6">
              SIM, QUERO SAIR E PERDER
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
             <Button variant="default" onClick={handleClose} className="text-lg p-6 bg-accent hover:bg-accent/90 text-accent-foreground">
              NÃO, QUERO GARANTIR MEU VALOR!
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ExitPopup;

    
