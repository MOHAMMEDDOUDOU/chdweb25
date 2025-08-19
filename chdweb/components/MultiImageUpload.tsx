"use client"
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Plus, Upload } from 'lucide-react';

interface MultiImageUploadProps {
  onImagesUploaded: (imageUrls: string[]) => void;
  currentImages?: string[];
  maxImages?: number;
  className?: string;
}

export default function MultiImageUpload({ 
  onImagesUploaded, 
  currentImages = [], 
  maxImages = 10,
  className = "" 
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previews, setPreviews] = useState<string[]>(currentImages);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // التحقق من عدد الصور
    if (previews.length + files.length > maxImages) {
      setError(`يمكنك إضافة ${maxImages} صور كحد أقصى`);
      return;
    }

    // التحقق من نوع الملفات
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        setError('يجب أن تكون جميع الملفات صور');
        return;
      }
      // تحقق من الحجم
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setError('حجم كل صورة يجب أن يكون أقل من 5MB');
        return;
      }
    }

    setError(null);
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        const formData = new FormData();
        formData.append('image', file);
        
        const response = await fetch('/api/upload-image', {
          method: 'POST',
          body: formData,
        });
        
        const data = await response.json();
        if (data.success) {
          uploadedUrls.push(data.imageUrl);
        } else {
          throw new Error(data.error || 'حدث خطأ أثناء رفع الصورة');
        }
      }

      const newPreviews = [...previews, ...uploadedUrls];
      setPreviews(newPreviews);
      onImagesUploaded(newPreviews);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'حدث خطأ في الاتصال');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);
    onImagesUploaded(newPreviews);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* عرض الصور المضافة */}
      {previews.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">الصور المضافة ({previews.length}/{maxImages})</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {previews.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`صورة ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* منطقة رفع الصور */}
      {previews.length < maxImages && (
        <div className="space-y-3">
          <div
            onClick={triggerFileSelect}
            className="w-full h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50 hover:bg-gray-100 transition-colors"
          >
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-gray-600 font-medium text-sm">اضغط لإضافة صور</p>
            <p className="text-gray-400 text-xs">
              {previews.length === 0 
                ? `يمكنك إضافة حتى ${maxImages} صور` 
                : `يمكنك إضافة ${maxImages - previews.length} صور أخرى`
              }
            </p>
          </div>
          
          <Button
            type="button"
            onClick={triggerFileSelect}
            variant="outline"
            className="w-full"
            disabled={uploading}
          >
            <Plus size={16} className="mr-2" />
            {uploading ? 'جاري الرفع...' : 'إضافة صور'}
          </Button>
        </div>
      )}

      {/* رسائل الحالة */}
      {uploading && (
        <div className="text-sm text-blue-600 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          جاري رفع الصور...
        </div>
      )}
      
      {error && (
        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
}
