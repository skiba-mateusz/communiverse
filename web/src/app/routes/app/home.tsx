import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/heading";

export const HomeRoute = () => {
  return (
    <>
      <Head title="Home" />
      <Container>
        <div>
          <Heading as="h1">Home</Heading>
        </div>
      </Container>
    </>
  );
};
