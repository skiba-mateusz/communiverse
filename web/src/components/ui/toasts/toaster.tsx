import { useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import {
  AiOutlineExclamationCircle,
  AiOutlineCheckCircle,
  AiOutlineClose,
} from "react-icons/ai";
import { motion, AnimatePresence } from "framer-motion";
import { Toast as IToast, ToastType, useToast } from "./toast-context";

const getType = (theme: any, type: ToastType) => {
  switch (type) {
    case "error":
      return css`
        .toast-progress-bar {
          background-color: ${theme.colors.red[400]};
        }
        svg {
          color: ${theme.colors.red[400]};
        }
      `;
    case "success":
      return css`
        .toast-progress-bar {
          background-color: ${theme.colors.green[400]};
        }
        svg {
          color: ${theme.colors.green[400]};
        }
      `;
    default:
      throw new Error(`unknown type ${type}`);
  }
};

const StyledToaster = styled.div`
  ${({ theme }) => css`
    position: fixed;
    top: 2rem;
    left: 50%;
    right: 50%;
    transform: translateX(-50%);
    max-width: 18rem;
    width: 100%;
    display: grid;
    gap: ${theme.spacing(4)};
    z-index: 1000;
  `}
`;

const StyledToast = styled.div<{ $type: ToastType }>`
  ${({ theme, $type }) => css`
    position: relative;
    padding: ${theme.spacing(2)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    background-color: ${theme.colors.neutral[50]};
    border: 1px solid ${theme.colors.neutral[300]};
    font-weight: ${theme.font.weight.semi};
    border-radius: ${theme.border.radius.md};
    overflow: hidden;
    ${getType(theme, $type)}

    span {
      flex: 1;
    }
  `}
`;

const DismissBtn = styled.button`
  ${({ theme }) => css`
    align-self: flex-start;
    background-color: transparent;
    border: none;

    svg {
      height: 1rem;
      width: 1rem;
      color: ${theme.colors.neutral[800]};
    }
  `}
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
      $type={type}
      aria-live="polite"
      aria-atomic={true}
    >
      {type == "error" ? (
        <AiOutlineExclamationCircle />
      ) : type === "success" ? (
        <AiOutlineCheckCircle />
      ) : null}
      <span>{message}</span>
      <DismissBtn aria-label="Dismiss notification" onClick={handleDismiss}>
        <AiOutlineClose />
      </DismissBtn>
      <ProgressBar duration={duration} className="toast-progress-bar" />
    </MotionStyledToast>
  );
};

export const Toaster = ({ duration = 5000 }: { duration?: number }) => {
  const { toasts } = useToast();

  return (
    <StyledToaster role="region" aria-label="Notifications">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} duration={duration} />
        ))}
      </AnimatePresence>
    </StyledToaster>
  );
};
