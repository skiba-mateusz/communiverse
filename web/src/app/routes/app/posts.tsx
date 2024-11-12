import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/heading";

export const PostsRoute = () => {
  return (
    <>
      <Head title="Posts" />
      <Container>
        <Heading as="h1">Posts</Heading>
      </Container>
    </>
  );
};
