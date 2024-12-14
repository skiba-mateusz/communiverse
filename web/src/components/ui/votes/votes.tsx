import styled, { css } from "styled-components";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import { useState } from "react";
import { VoteValue } from "@/types/api";
import { Loader } from "../loader";

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
    background-color: ${theme.colors.neutral[200]};
    font-weight: ${theme.font.weight.semi};
    border-radius: ${theme.border.radius.md};
    overflow: hidden;
  `}
`;

const UpvoteButton = styled.button<{ isActive: boolean }>`
  ${({ theme, isActive }) => css`
    padding: ${theme.spacing(2)};
    border: none;
    background: transparent;
    transition: 200ms;

    &:hover {
      background-color: ${theme.colors.green[200]};
      color: ${theme.colors.green[600]};
    }

    color: ${isActive ? theme.colors.green[600] : "inherit"};
  `}
`;

const DownvoteButton = styled.button<{ isActive: boolean }>`
  ${({ theme, isActive }) => css`
    padding: ${theme.spacing(2)};
    border: none;
    background-color: transparent;
    transition: 200ms;

    &:hover {
      background-color: ${theme.colors.red[200]};
      color: ${theme.colors.red[600]};
    }

    color: ${isActive ? theme.colors.red[600] : "inherit"};
  `}
`;

export const Votes = ({
  initialVotes,
  initialUserVote,
  onDownvote,
  onUpvote,
}: VotesProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState<VoteValue>(initialUserVote);

  const handleUpvote = () => {
    if (userVote === 1) {
      setVotes(votes - 1);
      setUserVote(0);
      onUpvote?.(0);
    } else {
      setVotes(userVote === -1 ? votes + 2 : votes + 1);
      setUserVote(1);
      onUpvote?.(1);
    }
  };

  const handleDownvote = () => {
    if (userVote === -1) {
      setVotes(votes + 1);
      setUserVote(0);
      onDownvote?.(0);
    } else {
      setVotes(userVote === 1 ? votes - 2 : votes - 1);
      setUserVote(-1);
      onDownvote?.(-1);
    }
  };

  const isUpvoted = userVote === 1;
  const isDownvoted = userVote === -1;

  return (
    <StyledVotes aria-label="Votes">
      <UpvoteButton
        aria-label="Upvote"
        onClick={handleUpvote}
        aria-pressed={isUpvoted}
        isActive={isUpvoted}
      >
        <AiFillLike />
      </UpvoteButton>
      <span>{votes}</span>
      <DownvoteButton
        aria-label="Downvote"
        onClick={handleDownvote}
        aria-pressed={isDownvoted}
        isActive={isDownvoted}
      >
        <AiFillDislike />
      </DownvoteButton>
    </StyledVotes>
  );
};
