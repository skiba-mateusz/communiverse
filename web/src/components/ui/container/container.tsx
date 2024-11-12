import styled from "styled-components";

interface  ContainerProps extends React.PropsWithChildren {
    variant?: "full" | "narrow"
}

const StyledContainer = styled.div<{variant: "full" | "narrow"}>`
    width: ${(props) => props.variant === "full" ? "calc(100% - 2rem)": "min(42rem, calc(100% - 2rem))"};
    margin-inline: auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
`

export const Container = ({children, variant=  "full"}: ContainerProps) => {
    return (
        <StyledContainer variant={variant}>
            {children}
        </StyledContainer>
    )
}