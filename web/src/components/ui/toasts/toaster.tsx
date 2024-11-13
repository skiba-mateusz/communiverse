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
    .toast-progress-bar {
      background-color: var(--clr-red-400);
    }
    svg {
      color: var(--clr-red-400);
    }
  `,
  success: css`
    .toast-progress-bar {
      background-color: var(--clr-green-400);
    }
    svg {
      color: var(--clr-green-400);
    }
  `,
};

const StyledToaster = styled.div`
  position: fixed;
  top: 2rem;
  left: 50%;
  right: 50%;
  transform: translateX(-50%);
  max-width: 18rem;
  width: 100%;
  display: grid;
  gap: var(--size-400);
  z-index: 1000;
`;

const StyledToast = styled.div<{ type: ToastType }>`
  position: relative;
  padding: var(--size-200);
  display: flex;
  align-items: center;
  gap: var(--size-200);
  background-color: var(--clr-neutral-50);
  font-weight: 600;
  box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.1);
  border-radius: var(--size-100);
  overflow: hidden;
  ${({ type }) => types[type]}

  span {
    flex: 1;
  }
`;

const DismissBtn = styled.button`
  align-self: flex-start;
  background-color: transparent;
  border: none;

  svg {
    height: 1rem;
    width: 1rem;
    color: var(--clr-neutral-800);
  }
`;

const ProgressBar = styled.div<{ duration: number }>`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  animation: ${({ duration }) => `shrink ${duration}ms linear`};

  @keyframes shrink {
    0% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
`;

const MotionStyledToast = motion.create(StyledToast);

const Toast = ({ toast, duration }: { toast: IToast; duration: number }) => {
  const { removeToast } = useToast();
  const timerId = useRef<number | undefined>(undefined);

  const { id, message, type } = toast;

  const handleDismiss = () => {
    removeToast(id);
    clearTimeout(timerId.current);
  };

  useEffect(() => {
    timerId.current = setTimeout(() => handleDismiss(), duration);

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
      <span>{message}</span>
      <DismissBtn onClick={handleDismiss}>
        <AiOutlineClose />
      </DismissBtn>
      <ProgressBar duration={duration} className="toast-progress-bar" />
    </MotionStyledToast>
  );
};

export const Toaster = ({ duration = 5000 }: { duration?: number }) => {
  const { toasts } = useToast();

  return (
    <StyledToaster>
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} duration={duration} />
        ))}
      </AnimatePresence>
    </StyledToaster>
  );
};
