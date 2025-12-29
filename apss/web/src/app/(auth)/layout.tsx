import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-dvh grid lg:grid-cols-2">
            {/* Left */}
            <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-b from-background to-muted">
                <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition">
                    <Image src="/bokira-logo.svg" alt="Bokira" width={120} height={120} priority />
                </Link>

                <div className="space-y-3">
                    <h1 className="text-4xl font-bold tracking-tight">Reserva fácil. Todo en un solo lugar.</h1>
                    <p className="text-muted-foreground text-base max-w-md">
                        Descubre negocios, agenda servicios o gestiona tu propio negocio sin complicaciones.
                    </p>
                </div>

                <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Bokira</p>
            </div>

            {/* Right */}
            <div className="flex items-center justify-center p-6">
                <div className="w-full max-w-md">{children}</div>
            </div>
        </div>
    );
}
