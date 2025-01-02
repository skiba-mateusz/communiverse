import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import styled from "styled-components";

const StyledReactMakrdown = styled(ReactMarkdown)`
  margin-block: 1rem;
  flex: 1;
  * {
    margin-bottom: 1em;
    text-align: justify;
  }
  pre {
    scrollbar-width: thin;
    overflow-x: auto;
  }
`;

export const PostMarkdown = ({ markdown }: { markdown: string }) => {
  return (
    <StyledReactMakrdown
      components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || "");
          return !inline && match ? (
            <SyntaxHighlighter
              style={dracula}
              PreTag="div"
              language={match[1]}
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          );
        },
      }}
    >
      {markdown}
    </StyledReactMakrdown>
  );
};
