import { ComponentProps } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { Textarea } from '../ui/textarea';
import { FormBase, FormBaseFieldProps } from './FormBase';

type FormTextareaProps<T extends FieldValues> = FormControlProps<T> &
  ComponentProps<typeof Textarea> & {
    control: Control<T>;
  } & ComponentProps<typeof Textarea>;

export function FormTextarea<T extends FieldValues = FieldValues>({
  control,
  name,
  placeholder,
  rows = 3,
  fieldProps,
  label,
  description,
  required,
  ...textareaProps
}: FormTextareaProps<T> & {
  fieldProps?: FormBaseFieldProps;
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormBase
          label={label}
          description={description}
          name={name}
          error={fieldState.error}
          isInvalid={fieldState.invalid}
          required={required}
          {...fieldProps}
        >
          <Textarea
            {...field}
            id={name}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={fieldState.invalid}
            {...textareaProps}
          />
        </FormBase>
      )}
    />
  );
}
