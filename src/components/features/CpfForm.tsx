
"use client";

import type React from 'react';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Unlock } from 'lucide-react';

const cpfSchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato XXX.XXX.XXX-XX"),
});

type CpfFormValues = z.infer<typeof cpfSchema>;

interface CpfFormProps {
  onSubmitSuccess: (cpf: string) => void;
}

const CpfForm: React.FC<CpfFormProps> = ({ onSubmitSuccess }) => {
  const [showValidationMessage, setShowValidationMessage] = useState(false);
  const form = useForm<CpfFormValues>({
    resolver: zodResolver(cpfSchema),
    defaultValues: {
      cpf: "",
    },
  });

  const onSubmit: SubmitHandler<CpfFormValues> = (data) => {
    setShowValidationMessage(true);
    setTimeout(() => {
      setShowValidationMessage(false);
      onSubmitSuccess(data.cpf);
    }, 2000); // Show validation message for 2 seconds
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 11) value = value.substring(0, 11); 

    let maskedValue = "";
    if (value.length > 9) {
      maskedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6, 9)}-${value.substring(9)}`;
    } else if (value.length > 6) {
      maskedValue = `${value.substring(0, 3)}.${value.substring(3, 6)}.${value.substring(6)}`;
    } else if (value.length > 3) {
      maskedValue = `${value.substring(0, 3)}.${value.substring(3)}`;
    } else {
      maskedValue = value;
    }
    
    form.setValue("cpf", maskedValue, { shouldValidate: true });
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-none border-none bg-transparent">
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="cpf" className="sr-only">Seu CPF:</FormLabel>
                  <FormControl>
                    <Input 
                      id="cpf"
                      placeholder="Digite seu CPF para verificar elegibilidade" 
                      {...field} 
                      onChange={handleCpfChange}
                      className="text-center text-lg p-4 h-14 border-2 border-primary/50 focus:border-accent text-foreground"
                      maxLength={14}
                      disabled={form.formState.isSubmitting || showValidationMessage}
                    />
                  </FormControl>
                  <FormMessage />
                  {showValidationMessage && (
                    <p className="text-sm font-medium text-accent text-center mt-2">
                      CPF válido! ✅ Verificando benefícios...
                    </p>
                  )}
                </FormItem>
              )}
            />
            <Button 
              type="submit" 
              variant="destructive"
              className="w-full h-16 text-xl font-bold text-destructive-foreground hover:bg-destructive/90 animate-pulse"
              disabled={form.formState.isSubmitting || showValidationMessage}
            >
              <Unlock className="mr-2 h-6 w-6" />
              {form.formState.isSubmitting || showValidationMessage ? "VERIFICANDO..." : "LIBERAR VERIFICAÇÃO IMEDIATA"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CpfForm;
