import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type AuthCardProps = {
    title: string;
    subtitle: string;
    children: React.ReactNode;
    footerText: string;
    footerHref: string;
    footerLabel: string;
};

export function AuthCard({
    title,
    subtitle,
    children,
    footerText,
    footerHref,
    footerLabel,
}: AuthCardProps) {
    return (
        <Card className="shadow-sm">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">{title}</CardTitle>
                <p className="text-sm text-muted-foreground">{subtitle}</p>
            </CardHeader>

            <CardContent className="space-y-4">
                {children}

                <p className="text-sm text-muted-foreground text-center">
                    {footerText}{" "}
                    <Link className="underline underline-offset-4 hover:text-foreground" href={footerHref}>
                        {footerLabel}
                    </Link>
                </p>
            </CardContent>
        </Card>
    );
}
