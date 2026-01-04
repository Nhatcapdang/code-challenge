'use client';

import { cn } from '@/lib/utils';
import {
  AlertCircle,
  FileImage,
  Image as ImageIcon,
  Loader2,
  X,
} from 'lucide-react';
import Image from 'next/image';
import * as React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { DropzoneOptions, FileRejection, useDropzone } from 'react-dropzone';
import { Card, CardContent } from './card';

export interface ReactDropzoneProps extends Omit<DropzoneOptions, 'onDrop'> {
  /** Callback when files are accepted and dropped */
  onDrop?: (acceptedFiles: File[], fileRejections: FileRejection[]) => void;
  /** Callback when files are rejected */
  onReject?: (fileRejections: FileRejection[]) => void;
  /** Maximum file size in bytes */
  maxSize?: number;
  /** Accepted file types */
  accept?: Record<string, string[]>;
  /** Whether the dropzone is disabled */
  disabled?: boolean;
  /** Whether the dropzone is in loading state */
  loading?: boolean;
  /** Custom class name */
  className?: string;
  /** Whether to show image previews */
  showPreviews?: boolean;
  /** Maximum number of files to accept */
  maxFiles?: number;
  /** Initial preview URL(s) to display (e.g., existing image URLs) */
  initialPreview?: string | string[] | null;
  /** Callback when a preview is removed (clicking X button) */
  onPreviewRemove?: (previewUrl: string, index: number) => void;
  /** Custom text for different states */
  text?: {
    idle?: string;
    accept?: string;
    reject?: string;
    loading?: string;
  };
  /** Error message */
  error?: string;
}

/**
 * Memoized preview item component to prevent unnecessary re-renders
 */
interface PreviewItemProps {
  preview: string;
  index: number;
  onRemove: (preview: string, index: number) => void;
}

const PreviewItem = React.memo<PreviewItemProps>(
  ({ preview, index, onRemove }) => {
    const handleRemove = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onRemove(preview, index);
      },
      [preview, index, onRemove],
    );

    return (
      <div className="relative">
        <div className="w-16 h-16 rounded-full overflow-hidden">
          <Image
            src={preview}
            alt={`Preview ${index + 1}`}
            width={64}
            height={64}
            className="object-cover w-full h-full"
            unoptimized
          />
          <X
            className="h-5 w-5 absolute top-0 right-0 hover:bg-destructive border border-gray-300 rounded-full liquid-glass p-1 cursor-pointer"
            onClick={handleRemove}
          />
        </div>
      </div>
    );
  },
);

PreviewItem.displayName = 'PreviewItem';

/**
 * Optimized React Dropzone component with drag states, image previews, and accessibility
 *
 * @example
 * ```tsx
 * <ReactDropzone
 *   onDrop={(files) => console.log(files)}
 *   accept={{ 'image/*': ['.png', '.jpg', '.jpeg'] }}
 *   maxSize={5 * 1024 * 1024} // 5MB
 *   showPreviews
 * />
 * ```
 */
const ReactDropzone = React.memo<ReactDropzoneProps>(
  ({
    onDrop,
    onReject,
    maxSize = 10 * 1024 * 1024, // 10MB default
    accept = { 'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'] },
    disabled = false,
    loading = false,
    className,
    showPreviews = true,
    maxFiles = 5,
    initialPreview,
    onPreviewRemove,
    text = {},
    error,
    ...dropzoneOptions
  }) => {
    const [previews, setPreviews] = useState<string[]>([]);
    // Track blob URLs separately for cleanup
    const blobUrlsRef = useRef<Set<string>>(new Set());

    // Sync initialPreview with previews state
    React.useEffect(() => {
      if (initialPreview) {
        const previewArray = Array.isArray(initialPreview)
          ? initialPreview
          : [initialPreview];
        // Only set if different to avoid unnecessary updates
        setPreviews(prev => {
          const normalized = previewArray.filter(Boolean);
          if (
            prev.length !== normalized.length ||
            !prev.every((p, i) => p === normalized[i])
          ) {
            return normalized;
          }
          return prev;
        });
      } else {
        // Clear previews if initialPreview is removed, but preserve blob URLs
        // (which are from dropped files, not initial preview)
        setPreviews(prev => {
          const blobUrls = prev.filter(p => p.startsWith('blob:'));
          return blobUrls;
        });
      }
    }, [initialPreview]);

    // Memoized onDrop handler
    const handleDrop = useCallback(
      (acceptedFiles: File[], fileRejections: FileRejection[]) => {
        if (onDrop) {
          onDrop(acceptedFiles, fileRejections);
        }
        if (onReject && fileRejections.length > 0) {
          onReject(fileRejections);
        }

        // Generate previews for accepted files (replaces existing previews)
        if (showPreviews && acceptedFiles.length > 0) {
          // Cleanup old blob URLs before replacing
          setPreviews(prev => {
            prev.forEach(preview => {
              if (preview.startsWith('blob:')) {
                URL.revokeObjectURL(preview);
                blobUrlsRef.current.delete(preview);
              }
            });
            return [];
          });

          const newPreviews = acceptedFiles
            .filter(file => file.type.startsWith('image/'))
            .map(file => {
              const url = URL.createObjectURL(file);
              blobUrlsRef.current.add(url);
              return url;
            })
            .slice(0, maxFiles);
          setPreviews(newPreviews);
        }
      },
      [onDrop, onReject, showPreviews, maxFiles],
    );

    // Memoized dropzone configuration
    const dropzoneConfig = useMemo(
      () => ({
        onDrop: handleDrop,
        accept,
        maxSize,
        maxFiles,
        disabled: disabled || loading,
        multiple: maxFiles > 1,
        ...dropzoneOptions,
      }),
      [
        handleDrop,
        accept,
        maxSize,
        maxFiles,
        disabled,
        loading,
        dropzoneOptions,
      ],
    );

    const {
      getRootProps,
      getInputProps,
      isDragActive,
      isDragAccept,
      isDragReject,
      fileRejections,
      acceptedFiles,
    } = useDropzone(dropzoneConfig);

    // Memoized drag state
    const dragState = useMemo(() => {
      if (loading) return 'loading';
      if (isDragReject) return 'reject';
      if (isDragAccept) return 'accept';
      if (isDragActive) return 'idle';
      return 'idle';
    }, [isDragActive, isDragAccept, isDragReject, loading]);

    // Memoized error messages
    const errorMessages = useMemo(() => {
      return fileRejections.map(({ file, errors }) => ({
        file: file.name,
        errors: errors.map(error => error.message),
      }));
    }, [fileRejections]);

    // Cleanup blob URLs on unmount
    React.useEffect(() => {
      const blobUrls = blobUrlsRef.current;
      return () => {
        blobUrls.forEach(url => {
          URL.revokeObjectURL(url);
        });
        blobUrls.clear();
      };
    }, []);

    // Memoized state classes
    const stateClasses = useMemo(() => {
      const baseClasses = 'transition-all duration-200 ease-in-out';

      switch (dragState) {
        case 'loading':
          return cn(baseClasses, 'border-primary bg-primary/5');
        case 'accept':
          return cn(
            baseClasses,
            'border-green-500 bg-green-50 dark:bg-green-950/20',
          );
        case 'reject':
          return cn(baseClasses, 'border-destructive bg-destructive/5');
        default:
          return cn(baseClasses, 'border-border hover:border-primary/50');
      }
    }, [dragState]);

    // Memoize text merge and accept string formatting
    const currentText = useMemo(() => {
      const defaultText = {
        idle: 'Drag & drop files here, or click to select',
        accept: 'Drop files here',
        reject: 'File type not supported',
        loading: 'Processing files...',
      };
      return { ...defaultText, ...text };
    }, [text]);

    const acceptString = useMemo(() => {
      if (!accept || Object.keys(accept).length === 0) return '';
      return Object.values(accept).flat().join(', ');
    }, [accept]);

    const maxSizeString = useMemo(() => {
      if (!maxSize) return '';
      return ` • Max size: ${(maxSize / (1024 * 1024)).toFixed(1)}MB`;
    }, [maxSize]);

    // Memoized preview removal handler
    const handlePreviewRemove = useCallback(
      (previewUrl: string, idx: number) => {
        // Call the callback if provided (for form field updates)
        if (onPreviewRemove) {
          onPreviewRemove(previewUrl, idx);
        }
        // Only revoke object URLs (blob URLs), not regular HTTPS URLs
        if (previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(previewUrl);
          blobUrlsRef.current.delete(previewUrl);
        }
        setPreviews(prev => prev.filter((_, i) => i !== idx));
      },
      [onPreviewRemove],
    );

    // Memoized content based on state
    const renderContent = useMemo(() => {
      if (loading) {
        return (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">
              {currentText.loading}
            </p>
          </div>
        );
      }

      if (isDragReject) {
        return (
          <div className="flex flex-col items-center gap-3">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <p className="text-sm text-destructive font-medium">
              {currentText.reject}
            </p>
          </div>
        );
      }

      if (isDragAccept) {
        return (
          <div className="flex flex-col items-center gap-3">
            <ImageIcon className="h-8 w-8 text-green-500" />
            <p className="text-sm text-green-600 dark:text-green-400 font-medium">
              {currentText.accept}
            </p>
          </div>
        );
      }

      return (
        <div className="flex flex-col items-center gap-3">
          <ImageIcon className="h-8 w-8 text-muted-foreground" />
          <div className="text-center">
            <p className="text-sm font-medium">{currentText.idle}</p>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptString && <>Supports: {acceptString}</>}
              {maxSizeString}
            </p>
          </div>
        </div>
      );
    }, [
      loading,
      isDragReject,
      isDragAccept,
      currentText,
      acceptString,
      maxSizeString,
    ]);

    return (
      <div className={cn('w-full', className)}>
        <Card
          {...getRootProps()}
          data-loading={loading}
          data-accept={isDragAccept}
          data-reject={isDragReject}
          data-idle={!isDragActive && !loading}
          className={cn(
            'cursor-pointer border-2 border-dashed p-6 text-center',
            stateClasses,
            {
              'cursor-not-allowed opacity-50': disabled || loading,
              'border-destructive bg-destructive/5': error,
            },
          )}
          role="button"
          tabIndex={disabled || loading ? -1 : 0}
          aria-label="File drop zone"
          aria-describedby="dropzone-description"
        >
          <input {...getInputProps()} />
          {showPreviews && previews.length > 0 ? (
            <div className="flex flex-wrap justify-center items-center gap-3">
              {previews.map((preview, index) => (
                <PreviewItem
                  key={`${preview}-${index}`}
                  preview={preview}
                  index={index}
                  onRemove={handlePreviewRemove}
                />
              ))}
            </div>
          ) : (
            <CardContent className="p-0">{renderContent}</CardContent>
          )}
        </Card>

        {/* Error Messages */}
        {errorMessages.length > 0 && (
          <div className="mt-4 space-y-2">
            {errorMessages.map((error, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md"
              >
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-destructive">{error.file}</p>
                  <ul className="text-xs text-destructive/80 mt-1">
                    {error.errors.map((err, errIndex) => (
                      <li key={errIndex}>• {err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Accepted Files List */}
        {acceptedFiles.length > 0 && !showPreviews && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-3">Selected Files</h4>
            <div className="space-y-2">
              {acceptedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-2 bg-muted rounded-md"
                >
                  <FileImage className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{file.name}</span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hidden description for screen readers */}
        <div id="dropzone-description" className="sr-only">
          File drop zone.{' '}
          {loading
            ? 'Processing files'
            : 'Drag and drop files here or click to browse'}
        </div>
      </div>
    );
  },
);

ReactDropzone.displayName = 'ReactDropzone';

export default ReactDropzone;
export { ReactDropzone };
