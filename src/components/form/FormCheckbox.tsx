import { ComponentProps } from 'react';
import { Checkbox } from '../ui/checkbox';
import { FormBase, FormBaseFieldProps } from './FormBase';
import { Control, Controller, FieldValues } from 'react-hook-form';

type FormCheckboxProps<T extends FieldValues> = FormControlProps<T> & {
  control: Control<T>;
} & ComponentProps<typeof Checkbox>;

export function FormCheckbox<T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  description,
  fieldProps,
  ...checkboxProps
}: FormCheckboxProps<T> & {
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
          controlFirst
          horizontal
          {...fieldProps}
        >
          <Checkbox
            id={name}
            checked={field.value}
            onBlur={field.onBlur}
            onCheckedChange={field.onChange}
            aria-invalid={fieldState.invalid}
            {...checkboxProps}
          />
        </FormBase>
      )}
    />
  );
}
