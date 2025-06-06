"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ShieldCheck, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const cpfSchema = z.object({
  cpf: z.string().regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF inválido. Use o formato 000.000.000-00"),
});

type CpfFormValues = z.infer<typeof cpfSchema>;

const CpfForm: FC = () => {
  const { toast } = useToast();
  const form = useForm<CpfFormValues>({
    resolver: zodResolver(cpfSchema),
    defaultValues: {
      cpf: "",
    },
  });

  const onSubmit: SubmitHandler<CpfFormValues> = (data) => {
    console.log("CPF Submetido:", data.cpf);
    toast({
      title: "🚀 Processando Liberação!",
      description: `Seu CPF ${data.cpf} está sendo verificado. Aguarde...`,
      variant: "default",
    });
    // Simulate API call
    setTimeout(() => {
       toast({
        title: "✅ Dinheiro Liberado!",
        description: "R$1.200 foram creditados em sua conta. Verifique seu extrato.",
        variant: "default", // Success is not a variant, using default
      });
    }, 3000);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Remove non-digits
    if (value.length > 11) value = value.substring(0, 11); // Max 11 digits

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
    <Card className="w-full max-w-md mx-auto shadow-2xl border-2 border-primary">
      <CardHeader className="text-center">
        <CardTitle className="font-headline text-3xl text-primary">CONSULTA RÁPIDA E SEGURA</CardTitle>
        <CardDescription>Insira seu CPF abaixo para liberar seu benefício AGORA MESMO!</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="cpf" className="text-lg font-semibold text-primary">Seu CPF:</FormLabel>
                  <FormControl>
                    <Input 
                      id="cpf"
                      placeholder="000.000.000-00" 
                      {...field} 
                      onChange={handleCpfChange}
                      className="text-center text-xl p-4 h-14 border-2 focus:border-accent"
                      maxLength={14}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <Button 
              type="submit" 
              className="w-full h-16 text-xl font-bold bg-accent text-accent-foreground hover:bg-accent/90 animate-pulse"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? "LIBERANDO..." : "🚀 LIBERAR MEU R$1.200 AGORA!"}
            </Button>
          </CardContent>
        </form>
      </Form>
      <CardFooter className="flex flex-col items-center space-y-3 pt-6 border-t">
        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
          <div className="flex items-center">
            <Lock className="w-4 h-4 mr-1 text-accent" />
            <span>Dados Criptografados</span>
          </div>
          <div className="flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1 text-accent" />
            <span>Sistema Integrado GOV.BR</span>
          </div>
        </div>
         <p className="text-xs text-center text-muted-foreground/80">
           Este sistema utiliza tecnologias de ponta para garantir a segurança dos seus dados.
        </p>
      </CardFooter>
    </Card>
  );
};

export default CpfForm;
