
"use client";

import type React from 'react';
import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";

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
    onSubmitSuccess(data.cpf); 
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="cpf"
          render={({ field }) => (
            <FormItem>
              <label htmlFor="cpf" className="block text-sm font-medium text-foreground mb-1">
                CPF
              </label>
              <FormControl>
                <Input 
                  id="cpf"
                  placeholder="Digite seu CPF" 
                  {...field} 
                  onChange={handleCpfChange}
                  className="text-base p-3 h-12 border-input focus:border-primary text-foreground"
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
          variant="default" 
          className="w-full h-12 text-base font-medium rounded-full" 
          disabled={form.formState.isSubmitting || showValidationMessage}
        >
          {form.formState.isSubmitting || showValidationMessage ? "VERIFICANDO..." : "Continuar"}
        </Button>
      </form>
    </Form>
  );
};

export default CpfForm;
