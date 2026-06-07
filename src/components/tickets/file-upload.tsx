'use client';

import {
  useRef,
  useState,
} from 'react';

import {
  Button,
} from '@/components/ui/button';

import {
  supabase,
} from '@/lib/supabase';

type Props = {
  onUploadComplete: (
    url: string,
  ) => void;
};

export default function FileUpload({
  onUploadComplete,
}: Props) {
  const inputRef =
    useRef<HTMLInputElement>(null);

  const [uploading, setUploading] =
    useState(false);

  const [fileName, setFileName] =
    useState('');

  const handleFileChange =
    async (
      e: React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file =
        e.target.files?.[0];

      if (!file) return;

      try {
        setUploading(true);

        const filePath =
          `${Date.now()}-${file.name}`;

        const {
          error,
        } =
          await supabase.storage
            .from(
              'attachments',
            )
            .upload(
              filePath,
              file,
            );

        if (error) {
          throw error;
        }

        const {
          data,
        } =
          supabase.storage
            .from(
              'attachments',
            )
            .getPublicUrl(
              filePath,
            );

        setFileName(
          file.name,
        );

        onUploadComplete(
          data.publicUrl,
        );
      } catch (error) {
        console.error(
          error,
        );
      } finally {
        setUploading(
          false,
        );
      }
    };

  return (
    <div
      className="
        flex flex-col
        items-center
        gap-4
        text-center
      "
    >
      <input
        ref={inputRef}
        type="file"
        onChange={
          handleFileChange
        }
        className="hidden"
      />

      <Button
        type="button"
        onClick={() =>
          inputRef.current?.click()
        }
        disabled={
          uploading
        }
        className="
          h-11
          rounded-xl
          bg-black
          px-6
          text-white
          hover:bg-zinc-800

          dark:bg-white
          dark:text-black
          dark:hover:bg-zinc-200
        "
      >
        {uploading
          ? 'Uploading...'
          : 'Choose File'}
      </Button>

      <p
        className="
          text-sm
          text-zinc-500
        "
      >
        {fileName
          ? fileName
          : 'No file selected'}
      </p>
    </div>
  );
}