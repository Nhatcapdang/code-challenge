import { Control, Controller, FieldValues } from 'react-hook-form';
import { FormBase } from '.';
import { NumericFormat } from 'react-number-format';
import { Input } from '../ui';
import { ComponentProps, ReactNode } from 'react';

type NumberFormatterProps<T extends FieldValues> = FormControlProps<T> & {
  control: Control<T>;
  type?: string;
  placeholder?: string;
  leftIcon?: string | ReactNode;
  rightIcon?: string | ReactNode;
  required?: boolean;
} & ComponentProps<typeof NumericFormat>;

function NumberFormatter<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required,
  leftIcon,
  rightIcon,
  ...props
}: NumberFormatterProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormBase
          label={label}
          name={name}
          required={required}
          isInvalid={fieldState.invalid}
          description={description}
          error={fieldState.error}
        >
          <div className="relative flex items-center rounded-md border focus-within:ring-1 focus-within:ring-ring [&>*:first-child]:px-2 [&>*:last-child]:px-2 [&>input]:focus-visible:ring-0 [&>input]:border-0 [&>input]:shadow-none ">
            {leftIcon && (
              <span className="text-muted-foreground">{leftIcon}</span>
            )}
            <NumericFormat
              value={field.value}
              onValueChange={values => {
                field.onChange(values.floatValue);
              }}
              {...props}
              customInput={Input}
            />
            {rightIcon && (
              <span className="text-muted-foreground">{rightIcon}</span>
            )}
          </div>
        </FormBase>
      )}
    />
  );
}
export default NumberFormatter;
