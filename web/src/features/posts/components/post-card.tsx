import { Link as RouterLink } from "react-router-dom";
import styled, { css } from "styled-components";
import Markdown from "react-markdown";
import { BiCommentDetail } from "react-icons/bi";
import { PostSummary } from "@/types/api";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Votes } from "@/components/ui/votes";
import { useVotePost } from "../api/vote-post";

interface PostCardProps {
  post: PostSummary;
}

const Tag = styled.div`
  ${({ theme }) => css`
    padding: ${theme.spacing(1)} ${theme.spacing(2)};
    background-color: ${theme.colors.blue[500]};
    color: ${theme.colors.neutral[50]};
    font-weight: ${theme.font.weight.bold};
    border-radius: ${theme.border.radius.sm};
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
export const PostTags = ({ tags }: { tags: string[] }) => {
  return (
    <Stack aria-label="Tags" style={{ flexWrap: "wrap" }}>
      {tags.map((tag, i) => (
        <Tag key={i}>#{tag}</Tag>
      ))}
    </Stack>
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
      <RouterLink to={`/app/communities/${communitySlug}/posts/${postSlug}`}>
        <CardHeader
          title={title}
          avatar={
            <Stack style={{ marginBottom: 4 }}>
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
            </Stack>
          }
        />
        <CardContent>
          <Stack spacing={2} direction="vertical">
            <PostTags tags={tags} />
            <ContentOverlay>
              <Markdown>{truncatedContent + "..."}</Markdown>
            </ContentOverlay>
          </Stack>
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
          to={`/app/communities/${communitySlug}/posts/${postSlug}#comments`}
          aria-label="View comments"
        >
          <BiCommentDetail />
          <span>{numComments}</span>
        </Button>
      </CardActions>
    </Card>
  );
};
