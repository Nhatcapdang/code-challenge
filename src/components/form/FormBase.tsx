import { ComponentProps, ReactNode } from 'react';
import { FieldError as RHFFieldError, FieldValues } from 'react-hook-form';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '../ui/field';

export type FormBaseFieldProps = Omit<
  ComponentProps<typeof FormBase>,
  | 'label'
  | 'description'
  | 'name'
  | 'error'
  | 'isInvalid'
  | 'required'
  | 'children'
>;
type FormBaseProps<T extends FieldValues> = FormControlProps<T> & {
  children: ReactNode;
  horizontal?: boolean;
  controlFirst?: boolean;
  error?: RHFFieldError;
  isInvalid?: boolean;
  required?: boolean;
};

export function FormBase<T extends FieldValues = FieldValues>({
  children,
  label,
  description,
  controlFirst,
  horizontal,
  name,
  error,
  isInvalid = false,
  required = false,
  ...props
}: FormBaseProps<T> & ComponentProps<typeof Field>) {
  const labelElement = (
    <>
      <FieldLabel htmlFor={name} required={required}>
        {label}
      </FieldLabel>
      {description && <FieldDescription>{description}</FieldDescription>}
    </>
  );
  const errorElem = isInvalid && error && <FieldError errors={[error]} />;

  return (
    <Field
      data-invalid={isInvalid}
      orientation={horizontal ? 'horizontal' : undefined}
      {...props}
    >
      {controlFirst ? (
        <>
          {children}
          <FieldContent>
            {labelElement}
            {errorElem}
          </FieldContent>
        </>
      ) : (
        <>
          <FieldContent>{labelElement}</FieldContent>
          {children}
          {errorElem}
        </>
      )}
    </Field>
  );
}
