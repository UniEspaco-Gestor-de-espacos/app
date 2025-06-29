import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';

type HeaderEspacoProps = {
    titulo: string;
    descricao: string;
    canSeeButton?: boolean;
    buttonText?: string;
    ButtonIcon?: React.ComponentType<{ className?: string }>;
    buttonLink?: string;
};

export default function GenericHeader({ canSeeButton, titulo, descricao, ButtonIcon, buttonText, buttonLink }: HeaderEspacoProps) {
    return (
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{titulo}</h1>
                <p className="text-muted-foreground">{descricao}</p>
            </div>
            {canSeeButton && (
                <Link href={buttonLink || '#'}>
                    <Button className="flex items-center gap-2">
                        ({ButtonIcon && <ButtonIcon className="h-4 w-4" />}){buttonText || 'N/A'}
                    </Button>
                </Link>
            )}
        </header>
    );
}
