import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/typography";
import { PostsView } from "@/features/posts/components/posts-view";

export const PostsRoute = () => {
  return (
    <>
      <Head title="Posts" />
      <section>
        <Container $variant="narrow">
          <Heading as="h1" $underlined $styles={{ marginBottom: [8, 10, 12] }}>
            Posts
          </Heading>
          <PostsView />
        </Container>
      </section>
    </>
  );
};
