import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/typography";
import { useCurrentUserFeed } from "@/features/users/api/get-current-user-feed";
import { FeedView } from "@/features/posts/components/feed-view";

export const HomeRoute = () => {
  return (
    <>
      <Head title="Home" />
      <section>
        <Container variant="narrow">
          <Heading as="h1" underlined styles={{ marginBottom: [8, 10, 12] }}>
            Home
          </Heading>
          <FeedView />
        </Container>
      </section>
    </>
  );
};
