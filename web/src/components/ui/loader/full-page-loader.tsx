import styled from "styled-components";
import { Loader } from "./loader";

const StyledFullPageLoader = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  gap: var(--size-400);
  align-items: center;
  justify-content: center;
`;

export const FullPageLoader = () => {
  return (
    <StyledFullPageLoader>
      <Loader size="large" />
    </StyledFullPageLoader>
  );
};
