// fragments/ImageUpload.tsx
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export interface ImageWithPreview {
    file: File;
    preview: string;
}

interface ImageUploadProps {
    imagesWithPreviews: ImageWithPreview[];
    setImagesWithPreviews: React.Dispatch<React.SetStateAction<ImageWithPreview[]>>;
    mainImageIndex: number | undefined;
    setData: (key: 'imagens' | 'main_image_index', value: any) => void;
    processing: boolean;
    errors: { imagens?: string };
}

export function ImageUpload({
    imagesWithPreviews,
    setImagesWithPreviews,
    mainImageIndex,
    setData,
    processing,
    errors,
}: ImageUploadProps) {
    const handleImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newImagePreviews: ImageWithPreview[] = [];
        const newImageFiles: File[] = [];

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) {
                toast.warning(`Arquivo ${file.name} não é uma imagem.`);
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                toast.warning(`Arquivo ${file.name} excede o limite de 5MB.`);
                return;
            }
            newImagePreviews.push({ file, preview: URL.createObjectURL(file) });
            newImageFiles.push(file);
        });

        setImagesWithPreviews(prev => {
            const updatedPreviews = [...prev, ...newImagePreviews];
            setData('imagens', updatedPreviews.map(p => p.file));
            if (mainImageIndex === undefined && updatedPreviews.length > 0) {
                setData('main_image_index', 0);
            }
            return updatedPreviews;
        });
    };

    const handleRemoveImage = (index: number) => {
        const removedImage = imagesWithPreviews[index];
        URL.revokeObjectURL(removedImage.preview);

        const updatedPreviews = imagesWithPreviews.filter((_, i) => i !== index);
        setImagesWithPreviews(updatedPreviews);
        setData('imagens', updatedPreviews.map(p => p.file));

        if (mainImageIndex !== undefined) {
            if (index === mainImageIndex) {
                setData('main_image_index', updatedPreviews.length > 0 ? 0 : undefined);
            } else if (index < mainImageIndex) {
                setData('main_image_index', mainImageIndex - 1);
            }
        }
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="images">Imagens do Espaço</Label>
                <Input id="images" type="file" accept="image/*" multiple onChange={handleImagesUpload} disabled={processing} />
                {errors.imagens && <p className="mt-1 text-sm text-red-500">{errors.imagens}</p>}
            </div>

            {imagesWithPreviews.length > 0 ? (
                <div className="mt-4">
                    <h4 className="mb-2 text-sm font-medium">Imagens selecionadas:</h4>
                    {/* ... (código da galeria mantido como no original) ... */}
                </div>
            ) : (
                <Alert><AlertDescription>Adicione imagens do espaço. Tamanho máximo: 5MB por imagem.</AlertDescription></Alert>
            )}
        </div>
    );
}
