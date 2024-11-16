import React from "react";
import styled from "styled-components";
import {
  FormProvider,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const StyledForm = styled.form`
  display: grid;
  gap: var(--size-100);
`;

interface FormProps<TFormValues extends FieldValues>
  extends React.PropsWithChildren {
  onSubmit: SubmitHandler<TFormValues>;
  schema: yup.AnyObjectSchema;
}

export const Form = <TFormValues extends Record<string, any>>({
  onSubmit,
  schema,
  children,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({ resolver: yupResolver(schema) });

  return (
    <FormProvider {...methods}>
      <StyledForm onSubmit={methods.handleSubmit(onSubmit)} noValidate>
        {children}
      </StyledForm>
    </FormProvider>
  );
};
