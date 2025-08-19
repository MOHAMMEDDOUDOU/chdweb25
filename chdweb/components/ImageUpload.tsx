"use client"
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImageUrl?: string;
  className?: string;
}

export default function ImageUpload({ onImageUploaded, currentImageUrl, className = "" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // تحقق من نوع الملف
    if (!file.type.startsWith('image/')) {
      setError('يجب أن يكون الملف صورة');
      return;
    }
    // تحقق من الحجم
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('حجم الصورة يجب أن يكون أقل من 5MB');
      return;
    }
    setError(null);
    // معاينة
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    // رفع
    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch('/api/upload-image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        onImageUploaded(data.imageUrl);
      } else {
        setError(data.error || 'حدث خطأ أثناء رفع الصورة');
        setPreview(null);
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال');
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setPreview(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageUploaded('');
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        {preview ? (
          <div className="relative group">
            <img
              src={preview}
              alt="معاينة الصورة"
              className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
            />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 left-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              ×
            </button>
          </div>
        ) : (
          <div
            onClick={triggerFileSelect}
            className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
          >
            <span className="text-gray-400 mb-2" style={{fontSize: 40}}>📤</span>
            <p className="text-gray-600 font-medium">اضغط لاختيار صورة</p>
            <p className="text-gray-400 text-sm">JPG, PNG, WebP - حتى 5MB</p>
          </div>
        )}
        {uploading && (
          <div className="mt-2 text-sm text-blue-600">جاري رفع الصورة...</div>
        )}
        {error && (
          <div className="mt-2 text-sm text-red-600">{error}</div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
      </div>
      {!preview && !uploading && (
        <Button
          type="button"
          onClick={triggerFileSelect}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={uploading}
        >
          اختيار صورة
        </Button>
      )}
    </div>
  );
}
