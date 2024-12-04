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

interface FormProps<TFormValues extends FieldValues>
  extends React.PropsWithChildren {
  onSubmit: SubmitHandler<TFormValues>;
  schema: yup.AnyObjectSchema;
  styles?: Styles;
}

const StyledForm = styled.form<{ styles?: Styles }>`
  ${({ theme, styles }) => css`
    display: grid;
    gap: ${theme.spacing(2)};
    ${parseStyles({ ...styles })}

    & > button {
      margin-top: ${theme.spacing(4)};
    }
  `}
`;

export const Form = <TFormValues extends Record<string, any>>({
  onSubmit,
  schema,
  children,
  styles,
}: FormProps<TFormValues>) => {
  const methods = useForm<TFormValues>({ resolver: yupResolver(schema) });

  return (
    <FormProvider {...methods}>
      <StyledForm
        onSubmit={methods.handleSubmit(onSubmit)}
        styles={styles}
        noValidate
      >
        {children}
      </StyledForm>
    </FormProvider>
  );
};
