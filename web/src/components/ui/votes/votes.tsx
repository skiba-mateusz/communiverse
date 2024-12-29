import styled, { css } from "styled-components";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { VoteValue } from "@/types/api";

interface VotesProps {
  initialVotes: number;
  initialUserVote: VoteValue;
  onUpvote?: (vote: VoteValue) => void;
  onDownvote?: (vote: VoteValue) => void;
}

const StyledVotes = styled.div`
  ${({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
    font-weight: ${theme.font.weight.semi};
  `}
`;

const UpvoteButton = styled.button<{ $isActive: boolean }>`
  ${({ theme, $isActive }) => css`
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: ${theme.border.radius.md};
    background: transparent;
    transition: 200ms;

    &:hover {
      background-color: ${theme.colors.green[200]};
      color: ${theme.colors.green[600]};
    }

    color: ${$isActive ? theme.colors.green[600] : "inherit"};
  `}
`;

const DownvoteButton = styled.button<{ $isActive: boolean }>`
  ${({ theme, $isActive }) => css`
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    border-radius: ${theme.border.radius.md};
    background: transparent;
    transition: 200ms;

    &:hover {
      background-color: ${theme.colors.red[200]};
      color: ${theme.colors.red[600]};
    }

    color: ${$isActive ? theme.colors.red[600] : "inherit"};
  `}
`;

export const Votes = ({
  initialVotes,
  initialUserVote,
  onDownvote,
  onUpvote,
}: VotesProps) => {
  const isUpvoted = initialUserVote === 1;
  const isDownvoted = initialUserVote === -1;

  return (
    <StyledVotes aria-label="Votes">
      <UpvoteButton
        $isActive={isUpvoted}
        aria-label="Upvote"
        onClick={() => onUpvote?.(isUpvoted ? 0 : 1)}
        aria-pressed={isUpvoted}
      >
        <AiFillLike />
      </UpvoteButton>
      <span>{initialVotes}</span>
      <DownvoteButton
        $isActive={isDownvoted}
        aria-label="Downvote"
        onClick={() => onDownvote?.(isDownvoted ? 0 : -1)}
        aria-pressed={isDownvoted}
      >
        <AiFillDislike />
      </DownvoteButton>
    </StyledVotes>
  );
};
