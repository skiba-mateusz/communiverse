import React from "react";
import styled, { css } from "styled-components";
import {
  FormProvider,
  useForm,
  SubmitHandler,
  FieldValues,
} from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { parseStyles } from "@/utils/styles";
import { Styles } from "@/types/styles";

interface FormStyles {
  $styles?: Styles;
}

interface FormProps<TFormValues extends FieldValues>
  extends React.PropsWithChildren,
    FormStyles {
  onSubmit: SubmitHandler<TFormValues>;
  schema: yup.AnyObjectSchema;
}

const StyledForm = styled.form<FormStyles>`
  ${({ theme, $styles }) => css`
    display: grid;
    gap: ${theme.spacing(2)};
    ${parseStyles({ ...$styles }, theme)}

    & > button {
      margin-top: ${theme.spacing(4)};
    }
  `}
`;

export const Form = <TFormValues extends Record<string, any>>({
  $styles,
  onSubmit,
  schema,
  children,
  ...restProps
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({ resolver: yupResolver(schema) });

  return (
    <FormProvider {...methods}>
      <StyledForm
        $styles={$styles}
        onSubmit={methods.handleSubmit(onSubmit)}
        noValidate
        {...restProps}
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
};
