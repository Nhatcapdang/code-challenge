import { ComponentProps, ReactNode } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { FormBase, FormBaseFieldProps } from './FormBase';

type FormSelectProps<T extends FieldValues> = FormControlProps<T> &
  ComponentProps<typeof Select> & {
    control: Control<T>;
    children: ReactNode;
    placeholder?: string;
    leftIcon?: string | ReactNode;
    rightIcon?: string | ReactNode;
  };

export function FormSelect<T extends FieldValues = FieldValues>({
  control,
  name,
  children,
  placeholder,
  fieldProps,
  label,
  description,
  leftIcon,
  rightIcon,
  ...selectProps
}: FormSelectProps<T> & {
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
          {...fieldProps}
        >
          <Select
            onValueChange={field.onChange}
            value={field.value}
            {...selectProps}
          >
            <SelectTrigger
              aria-invalid={fieldState.invalid}
              id={name}
              onBlur={field.onBlur}
            >
              {leftIcon && (
                <span className="flex items-center text-muted-foreground ">
                  {leftIcon}
                </span>
              )}
              <div className="w-full [&>span]:inline-flex">
                <SelectValue placeholder={placeholder} />
              </div>
              {rightIcon && (
                <span className="flex items-center text-muted-foreground">
                  {rightIcon}
                </span>
              )}
            </SelectTrigger>
            <SelectContent>{children}</SelectContent>
          </Select>
        </FormBase>
      )}
    />
  );
}
