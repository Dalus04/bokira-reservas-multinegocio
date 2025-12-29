import { AuthCard } from "@/features/auth/components/AuthCard";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthCard
            title="Crear cuenta"
            subtitle="Crea tu cuenta para reservar servicios o administrar tu negocio en Bokira."
            footerText="¿Ya tienes una cuenta?"
            footerHref="/login"
            footerLabel="Iniciar sesión"
        >
            <RegisterForm />
        </AuthCard>
    );
}
