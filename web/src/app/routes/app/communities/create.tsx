import { Head } from "@/components/seo";
import { Container } from "@/components/ui/container";
import { Heading } from "@/components/ui/typography";
import { CreatePostForm } from "@/features/posts/components/create-post-form";

export const CreateRoute = () => {
  return (
    <>
      <Head title="Create Post" />
      <section>
        <Container $variant="narrow">
          <Heading $styles={{ marginBottom: [8, 10, 12] }} $underlined as="h1">
            Create Post
          </Heading>
          <CreatePostForm />
        </Container>
      </section>
    </>
  );
};
