import { ComponentProps, useCallback } from 'react';
import { FileRejection } from 'react-dropzone';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { ReactDropzone } from '../ui/react-dropzone';
import { FormBase, FormBaseFieldProps } from './FormBase';

type FormFileProps<T extends FieldValues> = FormControlProps<T> &
  Omit<ComponentProps<typeof ReactDropzone>, 'onDrop' | 'initialPreview'> & {
    control: Control<T>;
  };

/**
 * Checks if a value is a valid HTTPS URL
 */
function isValidHttpsUrl(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return url.protocol === 'https:';
  } catch {
    return false;
  }
}

export function FormFile<T extends FieldValues = FieldValues>({
  control,
  name,
  accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
  maxSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 1,
  disabled = false,
  showPreviews = true,
  label,
  description,
  fieldProps,
  ...reactDropzoneProps
}: FormFileProps<T> & {
  fieldProps?: FormBaseFieldProps;
}) {
  const handleDrop = useCallback(
    (
      acceptedFiles: File[],
      _fileRejections: FileRejection[],
      onChange: (value: File | string | undefined) => void,
    ) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }
      // On rejection, keep the previous value (don't change it)
    },
    [],
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Check if field value is a valid HTTPS URL for preview
        const value = field.value;
        const initialPreview = isValidHttpsUrl(value) ? value : null;

        // Handle preview removal (when X is clicked)
        const handlePreviewRemove = (
          previewUrl: string,
          _index: number,
        ): void => {
          // If the removed preview was the initial URL preview, clear the field
          if (isValidHttpsUrl(field.value) && field.value === previewUrl) {
            field.onChange(null);
          }
        };

        return (
          <FormBase
            label={label}
            description={description}
            name={name}
            error={fieldState.error}
            isInvalid={fieldState.invalid}
            {...fieldProps}
          >
            <ReactDropzone
              onDrop={(acceptedFiles, fileRejections) =>
                handleDrop(acceptedFiles, fileRejections, field.onChange)
              }
              accept={accept}
              maxSize={maxSize}
              maxFiles={maxFiles}
              disabled={disabled}
              showPreviews={showPreviews}
              initialPreview={initialPreview}
              onPreviewRemove={handlePreviewRemove}
              error={fieldState.error?.message}
              {...reactDropzoneProps}
            />
          </FormBase>
        );
      }}
    />
  );
}
