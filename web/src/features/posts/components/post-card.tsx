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
  if (!post) {
    return null;
  }

  const { community, author } = post;
  const thumbnailURL = community?.thumbnailURL || "/community.svg";
  const avatarURL = author?.avatarURL || "/avatar.svg";

  const truncatedContent = post?.content.split(" ").slice(0, 35).join(" ");

  return (
    <RouterLink to={`/communities/${community.slug}/posts/${post?.slug}`}>
      <Card>
        <CardHeader
          title={post?.title || "Untitled Post"}
          avatar={
            <Origin>
              <RouterLink
                to={`/communities/${community?.slug}`}
                aria-label={`Go to ${community?.name || "unknown"} community`}
              >
                <Avatar
                  src={thumbnailURL}
                  alt={`${community?.name || "Unknown"}'s thumbnail`}
                  name={community?.name}
                />
              </RouterLink>
              <RouterLink
                to={`/users/${author?.username}`}
                aria-label={`Go to ${author?.username || "unknown"}'s profile`}
              >
                <Avatar
                  src={avatarURL}
                  alt={`${author?.username || "Unknown"}'s avatar`}
                  name={author?.username}
                />
              </RouterLink>
            </Origin>
          }
        />
        <CardContent>
          <Flow spacing={2}>
            <PostTags tags={post?.tags} />
            <ContentOverlay>
              <Markdown>{truncatedContent + "..."}</Markdown>
            </ContentOverlay>
          </Flow>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            variant="soft"
            to={`/communities/${community?.slug}/posts/${post?.slug}#comments`}
            aria-label="View comments"
          >
            <BiCommentDetail />
            <span>{post?.numComments || 0}</span>
          </Button>
        </CardActions>
      </Card>
    </RouterLink>
  );
};
