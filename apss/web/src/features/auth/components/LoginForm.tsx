"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PasswordField } from "@/components/form/PasswordField";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useLoginMutation } from "../hooks/useLoginMutation";

const schema = z.object({
    email: z.string().email("Correo inválido"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    remember: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm() {
    const router = useRouter();
    const params = useSearchParams();
    const m = useLoginMutation();

    // si venían de /businesses/[slug]/book?..., se vuelve ahí
    const next = useMemo(() => params.get("next") || "", [params]);

    const form = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { email: "", password: "", remember: true },
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const res = await m.mutateAsync(values);

        if (next) {
            router.push(next);
            return;
        }

        // Nota: NO mostramos "admin" en UI, pero si eres admin te lleva al panel.
        if (res.user.globalRole === "ADMIN") router.push("/admin");
        else router.push("/my");
    });

    return (
        <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                    id="email"
                    autoComplete="email"
                    placeholder="user@bokira.dev"
                    {...form.register("email")}
                />
                {form.formState.errors.email && (
                    <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                )}
            </div>

            <PasswordField
                id="password"
                label="Contraseña"
                autoComplete="current-password"
                registration={form.register("password")}
                error={form.formState.errors.password?.message}
            />

            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Checkbox
                        checked={form.watch("remember")}
                        onCheckedChange={(v) => form.setValue("remember", Boolean(v))}
                    />
                    Mantener sesión
                </label>
            </div>

            {m.isError && <p className="text-sm text-destructive">{getApiErrorMessage(m.error)}</p>}

            <Button className="w-full" type="submit" disabled={m.isPending}>
                {m.isPending ? "Ingresando..." : "Ingresar"}
            </Button>
        </form>
    );
}
