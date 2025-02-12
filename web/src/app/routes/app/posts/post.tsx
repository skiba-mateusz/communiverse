import styled from "styled-components";
import Markdown from "react-markdown";
import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/typography";
import { usePost } from "@/features/posts/api/get-post";
import { Loader } from "@/components/ui/loader";
import { Message } from "@/components/ui/message";
import { Stack } from "@/components/ui/stack";
import { Grid, GridItem } from "@/components/ui/grid";
import { CommunityDetails } from "@/features/communities/components/community-details";
import { PostAuthorDetails } from "@/features/posts/components/post-author-details";
import { formatDate } from "@/utils/time";
import { PostTags } from "@/features/posts/components/post-card";
import { Separator } from "@/components/ui/separator";
import { PostVotes } from "@/features/posts/components/post-votes";
import { PostMarkdown } from "@/features/posts/components/post-markdown";

export const PostRoute = () => {
  const { post, isLoading, isFetching, error } = usePost();

  if (isLoading || isFetching) return <Loader $size="medium" />;
  if (error)
    return (
      <Message $variant="alert">There was an error trying to get post</Message>
    );
  if (!post) return null;

  const {
    title,
    content,
    slug: postSlug,
    tags,
    votes,
    userVote,
    community,
    author,
    createdAt,
  } = post;
  const { slug: communitySlug } = community;

  return (
    <>
      <Head title="Posts" />
      <section>
        <Container $variant="wide">
          <Grid>
            <GridItem $span={[12, 8, 8]}>
              <Heading as="h1" $underlined $styles={{ marginBottom: 4 }}>
                {title}
              </Heading>
              <PostTags tags={tags} />
            </GridItem>
            <GridItem $span={[12, 4, 4]}></GridItem>
          </Grid>
          <Grid>
            <GridItem
              $span={[12, 8, 8]}
              $styles={{ display: "flex", flexDirection: "column" }}
            >
              <PostMarkdown markdown={content} />
              <Separator $styles={{ marginBottom: 4 }} />
              <Stack
                $styles={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <PostVotes
                  initialUserVote={userVote}
                  initialVotes={votes}
                  communitySlug={communitySlug}
                  postSlug={postSlug}
                />
                <time>{formatDate(createdAt)}</time>
              </Stack>
            </GridItem>
            <GridItem $span={[12, 4, 4]}>
              <Stack
                $direction="vertical"
                $styles={{ position: "sticky", top: 0 }}
              >
                <CommunityDetails community={community} />
                <PostAuthorDetails author={author} />
              </Stack>
            </GridItem>
          </Grid>
        </Container>
      </section>
    </>
  );
};
