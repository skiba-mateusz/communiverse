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
import { Votes } from "@/components/ui/votes";
import { useVotePost } from "@/features/posts/api/vote-post";
import { CommunityDetails } from "@/features/communities/components/community-details";
import { PostAuthorDetails } from "@/features/posts/components/post-author-details";
import { formatDate } from "@/utils/time";
import { PostTags } from "@/features/posts/components/post-card";

const StyledMarkdown = styled(Markdown)`
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

export const PostRoute = () => {
  const { post, isLoading, error } = usePost();
  const { vote } = useVotePost();

  if (isLoading) return <Loader size="medium" />;
  if (error)
    return (
      <Message variant="alert">There was an error trying to get post</Message>
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
        <Container variant="wide">
          <Grid>
            <GridItem span={[12, 8, 8]}>
              <Heading as="h1" underlined styles={{ marginBottom: 4 }}>
                {title}
              </Heading>
              <PostTags tags={tags} />
            </GridItem>
            <GridItem span={[12, 4, 4]}></GridItem>
          </Grid>
          <Grid>
            <GridItem
              span={[12, 8, 8]}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <StyledMarkdown>{content}</StyledMarkdown>
              <Stack
                style={{
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                <time>{formatDate(createdAt)}</time>
              </Stack>
            </GridItem>
            <GridItem span={[12, 4, 4]}>
              <Stack direction="vertical">
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
