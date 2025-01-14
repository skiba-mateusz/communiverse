import { Link as RouterLink } from "react-router-dom";
import styled, { css } from "styled-components";
import { BiCommentDetail } from "react-icons/bi";
import { PostSummary } from "@/types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Stack } from "@/components/ui/stack";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardLink,
} from "@/components/ui/card";
import { Heading } from "@/components/ui/typography";
import { PostVotes } from "./post-votes";
import { PostMarkdown } from "./post-markdown";

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
    <Stack aria-label="Tags">
      {tags.map((tag, i) => (
        <Tag key={i}>#{tag}</Tag>
      ))}
    </Stack>
  );
};

export const PostCard = ({ post }: PostCardProps) => {
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
  const { name: communityName, slug: communitySlug, thumbnailURL } = community;
  const { username, avatarURL } = author;

  const truncatedContent = content.split(" ").slice(0, 50).join(" ");

  return (
    <Card>
      <CardLink to={`/app/communities/${communitySlug}/posts/${postSlug}`} />
      <CardHeader>
        <Stack $styles={{ flexGrow: "1", width: "100%" }} $spacing={2}>
          <RouterLink
            to={`/app/communities/${communitySlug}`}
            aria-label={`Go to ${communityName}'s community`}
            title={communityName}
          >
            <Avatar>
              <AvatarImage
                src={thumbnailURL}
                fallback={communityName}
                alt={`${communityName}'s avatar`}
              />
            </Avatar>
          </RouterLink>
          <RouterLink
            to={`/users/${username}`}
            aria-label={`Go to ${username}'s profile`}
            title={username}
          >
            <Avatar>
              <AvatarImage
                src={avatarURL}
                fallback={username}
                alt={`${username}'s avatar`}
              />
            </Avatar>
          </RouterLink>
        </Stack>
        <Heading as="h3">{title}</Heading>
      </CardHeader>
      <CardContent>
        <Stack $spacing={2} $direction="vertical">
          <PostTags tags={tags} />
          <ContentOverlay>
            <PostMarkdown markdown={truncatedContent} />
          </ContentOverlay>
        </Stack>
      </CardContent>
      <CardActions>
        <PostVotes
          initialVotes={votes}
          initialUserVote={userVote}
          postSlug={postSlug}
          communitySlug={communitySlug}
        />
        <Button
          $variant="transparent"
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
