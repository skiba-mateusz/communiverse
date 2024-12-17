import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/typography";
import { CommunitiesList } from "@/features/communities/components/communities-list";
import { useCommunities } from "@/features/communities/api/get-communities";
import { Loader } from "@/components/ui/loader";
import { Message } from "@/components/ui/message";

export const CommunitiesRoute = () => {
  const { communities, isLoading, error } = useCommunities();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="alert">
        There was en error trying to get communities
      </Message>
    );

  return (
    <>
      <Head title="Communities" />
      <section>
        <Container variant="wide">
          <Heading as="h1" underlined styles={{ marginBottom: [8, 10, 12] }}>
            Communities
          </Heading>
          <CommunitiesList communities={communities || []} />
        </Container>
      </section>
    </>
  );
};
