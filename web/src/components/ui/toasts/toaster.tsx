import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import {
  AiOutlineExclamationCircle,
  AiOutlineCheckCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Toast as IToast, ToastType, useToast } from "./toast-provider";

const types = {
  error: css`
    background-color: var(--clr-red-400);
    color: var(--clr-red-950);
  `,
  success: css`
    background-color: var(--clr-green-400);
    color: var(--clr-green-950);
  `,
};

const StyledToaster = styled.div`
  position: fixed;
  top: 2rem;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  max-width: 16rem;
  width: 100%;
  display: grid;
  gap: var(--size-400);
  z-index: 1000;
`;

const StyledToast = styled.div<{ type: ToastType }>`
  padding: var(--size-100);
  display: flex;
  align-items: center;
  gap: var(--size-200);
  font-weight: 600;
  ${({ type }) => types[type]}
  border-radius: var(--size-100);
`;

const DismissBtn = styled.button`
  margin-left: auto;
  background-color: transparent;
  border: none;
`;

const MotionStyledToast = motion.create(StyledToast);

const Toast = ({ toast }: { toast: IToast }) => {
  const { removeToast } = useToast();
  const timerId = useRef<number | undefined>(undefined);

  const { id, message, type } = toast;

  const handleDismiss = () => {
    removeToast(id);
    clearTimeout(timerId.current);
  };

  useEffect(() => {
    timerId.current = setTimeout(() => handleDismiss(), 5000);

    return () => clearTimeout(timerId.current);
  }, []);

  return (
    <MotionStyledToast
      initial={{ opacity: 0, y: "-100%" }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      exit={{ opacity: 0, y: "-100%" }}
      type={type}
    >
      {type == "error" ? (
        <AiOutlineExclamationCircle />
      ) : type === "success" ? (
        <AiOutlineCheckCircle />
      ) : null}
      {message}
      <DismissBtn onClick={handleDismiss}>
        <AiOutlineClose />
      </DismissBtn>
    </MotionStyledToast>
  );
};

export const Toaster = () => {
  const { toasts } = useToast();

  return (
    <StyledToaster>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </StyledToaster>
  );
};
