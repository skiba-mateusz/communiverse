import { createGlobalStyle, css } from "styled-components";

const GlobalStyle = createGlobalStyle`
    ${({ theme }) => css`
      *,
      *::before,
      *::after {
        box-sizing: border-box;
      }

      * {
        margin: 0;
        padding: 0;
      }

      body {
        font-family: ${theme.font.family.primary}, sans-serif;
        font-size: ${theme.font.size.sm};
        background: ${theme.colors.neutral[50]};
        color: ${theme.colors.neutral[800]};
        line-height: 1.5;
      }

      img,
      picture,
      svg {
        display: block;
        max-width: 100%;
        object-fit: cover;
      }

      svg {
        font-size: 1.5em;
      }

      input,
      button,
      textarea,
      select {
        font: inherit;
        color: inherit;
      }

      button {
        cursor: pointer;
      }

      *:disabled {
        cursor: not-allowed;
      }

      p,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        overflow-wrap: break-word;
      }

      ul,
      ol {
        list-style: none;
      }

      a {
        color: inherit;
        text-decoration: none;
      }

      @media (max-width: ${theme.breakpoints.md}) {
        body {
          font-size: ${theme.font.size.xs};
        }
      }
    `}
`;

export { GlobalStyle };
