import { Votes } from "@/components/ui/votes";
import { useVotePost } from "../api/vote-post";
import { VoteValue } from "@/types/api";
import { useEffect, useState } from "react";

interface PostVotesProps {
  initialVotes: number;
  initialUserVote: VoteValue;
  communitySlug: string;
  postSlug: string;
}

export const PostVotes = ({
  initialVotes,
  initialUserVote,
  communitySlug,
  postSlug,
}: PostVotesProps) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);
  const { vote } = useVotePost();

  // keep in sync with the server response
  useEffect(() => {
    setVotes(initialVotes);
    setUserVote(initialUserVote);
  }, [initialVotes, initialUserVote]);

  // optimistic update
  const handleVote = (value: VoteValue) => {
    setVotes(votes + value - userVote);
    setUserVote(value);
    vote(
      { communitySlug, postSlug, value },
      {
        onError: () => {
          setVotes((prevVotes) => prevVotes - value + userVote);
          setUserVote(userVote);
        },
      }
    );
  };

  return (
    <Votes
      initialVotes={votes}
      initialUserVote={userVote}
      onUpvote={handleVote}
      onDownvote={handleVote}
    />
  );
};
