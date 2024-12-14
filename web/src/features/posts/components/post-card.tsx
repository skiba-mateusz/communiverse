import { Link as RouterLink } from "react-router-dom";
import styled, { css } from "styled-components";
import Markdown from "react-markdown";
import { BiCommentDetail } from "react-icons/bi";
import { Post } from "@/types/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Flow } from "@/components/ui/flow";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Votes } from "@/components/ui/votes";
import { useVotePost } from "../api/vote-post";

interface PostCardProps {
  post: Post;
}

const Tag = styled.div`
  ${({ theme }) => css`
    display: inline-block;
    padding: ${theme.spacing(1)} ${theme.spacing(2)};
    margin-right: ${theme.spacing(2)};
    background-color: ${theme.colors.blue[500]};
    color: ${theme.colors.neutral[50]};
    font-weight: ${theme.font.weight.bold};
    border-radius: ${theme.border.radius.sm};
  `}
`;

const Origin = styled.div`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacing(2)};
    display: flex;
    align-items: center;
    gap: ${theme.spacing(2)};
  `}
`;

const ContentOverlay = styled.div`
  ${({ theme }) => css`
    position: relative;

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(
        to bottom,
        transparent,
        ${theme.colors.neutral[50]}
      );
    }
  `}
`;
const PostTags = ({ tags }: { tags: string[] }) => {
  return (
    <div aria-label="Tags">
      {tags.map((tag, i) => (
        <Tag key={i}>#{tag}</Tag>
      ))}
    </div>
  );
};

export const PostCard = ({ post }: PostCardProps) => {
  const { vote } = useVotePost();

  if (!post) {
    return null;
  }

  const {
    title,
    content,
    slug: postSlug,
    tags,
    votes,
    userVote,
    numComments,
    community,
    author,
  } = post;
  const {
    name,
    slug: communitySlug,
    thumbnailURL = "/thumbnail.svg",
  } = community;
  const { username, avatarURL } = author;

  const truncatedContent = content.split(" ").slice(0, 35).join(" ");

  return (
    <Card>
      <RouterLink to={`/communities/${communitySlug}/posts/${postSlug}`}>
        <CardHeader
          title={title}
          avatar={
            <Origin>
              <RouterLink
                to={`/communities/${communitySlug}`}
                aria-label={`Go to ${name} community`}
              >
                <Avatar
                  src={thumbnailURL || "/community.svg"}
                  alt={`${name}'s thumbnail`}
                  name={name}
                  styles={{ fontWeight: "font.weight.bold" }}
                />
              </RouterLink>
              <RouterLink
                to={`/users/${username}`}
                aria-label={`Go to ${username}'s profile`}
              >
                <Avatar
                  src={avatarURL || "/avatar.svg"}
                  alt={`${username}'s avatar`}
                  name={username}
                  styles={{ fontWeight: "font.weight.bold" }}
                />
              </RouterLink>
            </Origin>
          }
        />
        <CardContent>
          <Flow spacing={2}>
            <PostTags tags={tags} />
            <ContentOverlay>
              <Markdown>{truncatedContent + "..."}</Markdown>
            </ContentOverlay>
          </Flow>
        </CardContent>
      </RouterLink>
      <CardActions>
        <Votes
          initialVotes={votes}
          initialUserVote={userVote}
          onUpvote={(value) =>
            vote({
              communitySlug,
              postSlug,
              value,
            })
          }
          onDownvote={(value) =>
            vote({
              communitySlug,
              postSlug,
              value,
            })
          }
        />
        <Button
          size="small"
          variant="soft"
          to={`/communities/${communitySlug}/posts/${postSlug}#comments`}
          aria-label="View comments"
        >
          <BiCommentDetail />
          <span>{numComments}</span>
        </Button>
      </CardActions>
    </Card>
  );
};
