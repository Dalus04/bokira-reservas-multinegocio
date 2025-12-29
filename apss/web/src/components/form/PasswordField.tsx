"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordFieldProps = {
    id: string;
    label: string;
    placeholder?: string;
    autoComplete?: string;
    registration: Record<string, unknown>;
    error?: string;
};

export function PasswordField({
    id,
    label,
    placeholder = "••••••••",
    autoComplete,
    registration,
    error,
}: PasswordFieldProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>

            <div className="relative">
                <Input
                    id={id}
                    type={show ? "text" : "password"}
                    placeholder={placeholder}
                    autoComplete={autoComplete}
                    {...registration}
                />

                <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                    {/* Ojo abierto = se ve */}
                    {show ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
    );
}
