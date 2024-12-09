import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/heading";
import { Grid, GridItem } from "@/components/ui/grid";
import { Box } from "@/components/ui/box";

import { PostsList } from "@/features/posts/components/posts-list";

export const HomeRoute = () => {
  return (
    <>
      <Head title="Home" />
      <section>
        <Container variant="narrow">
          <Heading as="h1" underlined>
            Home
          </Heading>
          <Grid styles={{ paddingBlock: [8, 10, 12] }}>
            <GridItem span={[12, 12, 12]}>
              <PostsList />
            </GridItem>
          </Grid>
        </Container>
      </section>
    </>
  );
};
