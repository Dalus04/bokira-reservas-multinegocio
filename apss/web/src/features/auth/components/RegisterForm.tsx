"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordField } from "@/components/form/PasswordField";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useRegisterMutation } from "../hooks/useRegisterMutation";

const schema = z
    .object({
        name: z.string().min(2, "Nombre requerido"),
        phone: z.string().optional(),
        email: z.string().email("Correo inválido"),
        password: z.string().min(8, "Mínimo 8 caracteres"),
        confirmPassword: z.string().min(8, "Confirma tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

type FormValues = z.infer<typeof schema>;

export function RegisterForm() {
    const router = useRouter();
    const m = useRegisterMutation();

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: "",
            phone: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const { confirmPassword, ...payload } = values;
        await m.mutateAsync(payload);
        router.push("/login");
    });

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">Nombre</Label>
                    <Input id="name" placeholder="Daniel Suárez" autoComplete="name" {...form.register("name")} />
                    {form.formState.errors.name && (
                        <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" placeholder="999888777" autoComplete="tel" {...form.register("phone")} />
                    {form.formState.errors.phone && (
                        <p className="text-sm text-destructive">{form.formState.errors.phone.message}</p>
                    )}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input id="email" placeholder="user@bokira.dev" autoComplete="email" {...form.register("email")} />
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
            </div>

            <PasswordField
                id="password"
                label="Contraseña"
                autoComplete="new-password"
                registration={form.register("password")}
                error={form.formState.errors.password?.message}
            />

            <PasswordField
                id="confirmPassword"
                label="Confirmar contraseña"
                autoComplete="new-password"
                registration={form.register("confirmPassword")}
                error={form.formState.errors.confirmPassword?.message}
            />

            {m.isError && <p className="text-sm text-destructive">{getApiErrorMessage(m.error)}</p>}

            <Button className="w-full" type="submit" disabled={m.isPending}>
                {m.isPending ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
        </form>
    );
}
