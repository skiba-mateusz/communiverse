import { Link, LinkProps } from "react-router-dom";
import styled from "styled-components";

const StyledCardLink = styled(Link)`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`;

export const CardLink = ({ ...props }: LinkProps) => {
  return <StyledCardLink {...props} />;
};
