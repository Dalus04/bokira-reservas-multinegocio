import { AuthCard } from "@/features/auth/components/AuthCard";
import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
    return (
        <AuthCard
            title="Iniciar sesión"
            subtitle="Accede a tu cuenta para reservar servicios o gestionar tu negocio."
            footerText="¿No tienes una cuenta?"
            footerHref="/register"
            footerLabel="Crear cuenta"
        >
            <LoginForm />
        </AuthCard>
    );
}
