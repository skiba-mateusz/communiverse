import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    :root {
        --clr-neutral-50: rgb(250, 250, 250);
        --clr-neutral-100: rgb(245, 245, 245);
        --clr-neutral-200: rgb(229, 229, 229);
        --clr-neutral-300: rgb(212, 212, 212);
        --clr-neutral-400: rgb(163, 163, 163);
        --clr-neutral-500: rgb(115, 115, 115);
        --clr-neutral-600: rgb(82, 82, 82);
        --clr-neutral-700: rgb(64, 64, 64);
        --clr-neutral-800: rgb(38, 38, 38);
        --clr-neutral-900: rgb(23, 23, 23);
        --clr-neutral-950: rgb(10, 10, 10);
      
        --clr-blue-500: rgb(59 130 246);

        --clr-red-400: rgb(248 113 113);
        --clr-red-600: rgb(220 38 38);
        --clr-red-950: rgb(69 10 10);

        --clr-green-400: rgb(74 222 128);
        --clr-green-600: rgb(22 163 74);
        --clr-green-950: rgb(5 46 22);

        --ff-primary: 'Lato', sans-serif;
      
        --fs-50: .9375rem;
        --fs-100: 1rem;
        --fs-200: 1.25rem;
        --fs-300: 1.5rem;
        --fs-400: 2rem;
        --fs-500: 2.5rem;
        --fs-600: 3rem;
        --fs-700: 3rem;
        --fs-800: 4rem;
        --fs-900: 5rem;
        
        --fs-body : var(--fs-100);

        --fs-h1: var(--fs-400);
        --fs-h2: var(--fs-300);
        --fs-h3: var(--fs-200);
        --fs-h4: var(--fs-100);
        --fs-h5: var(--fs-100);
        --fs-h6: var(--fs-50);
        
        --fs-btn-small: var(--fs-50);
        --fs-btn-medium: var(--fs-100);
        --fs-btn-large: var(--fs-200);
      
        --size-50: 0.25rem;
        --size-100: 0.5rem;
        --size-200: 0.75rem;
        --size-300: 1rem;
        --size-400: 1.25rem;
        --size-500: 1.5rem;
        --size-600: 2rem;
        --size-700: 2.5rem;
        --size-800: 3rem;
        --size-900: 4rem;
    }
    
    @media (max-width: 50em) {
        :root {
            --fs-body: var(--fs-50);
            
            --fs-h1: var(--fs-300);
            --fs-h2: var(--fs-200);
            --fs-h3: var(--fs-100);
            --fs-h4: var(--fs-100);
            --fs-h5: var(--fs-50);
            --fs-h6: var(--fs-50);
        }
    }
    
    *, *::before, *::after {
        box-sizing: border-box;
    }
    
    * {
        margin: 0;
        padding: 0;
    }
    
    body {
        font-family: var(--ff-primary);
        font-size: var(--fs-body);
        background: var(clr-neutral-50);
        color: var(--clr-neutral-800);
        line-height: 1.5;
    }
    
    img, picture, svg {
        display: block;
        max-width: 100%;
        object-fit: cover;
    }
    
    input, button, textarea, select {
        font: inherit;
    }
    
    button {
        cursor: pointer;
    }
    
    *:disabled {
        cursor: not-allowed;
    }
    
    p, h1, h2, h3, h4, h5, h6 {
        overflow-wrap: break-word;
    }
    
    ul, ol {
        list-style: none;
    }
    
    a {
        color: inherit;
        text-decoration: none;
    }
    
`;

export { GlobalStyle };
