import { Container } from "@/components/ui/container";
import { Head } from "@/components/seo";
import { Heading } from "@/components/ui/heading";
import { Grid, GridItem } from "@/components/ui/grid";
import { Box } from "@/components/ui/box";
import { Flow } from "@/components/ui/flow";

export const HomeRoute = () => {
  return (
    <>
      <Head title="Home" />
      <Container>
        <Heading as="h1">Home</Heading>
        <Grid styles={{ paddingBlock: [8, 10, 12] }}>
          <GridItem span={[12, 8, 9]}>
            <Box as="section">
              <Flow spacing={[4, 8, 12]}>
                <Heading as="h2">Grid Item 1 (1)</Heading>
                <Heading as="h2">Grid Item 1 (2)</Heading>
                <Heading as="h2">Grid Item 1 (3)</Heading>
              </Flow>
            </Box>
          </GridItem>
          <GridItem span={[12, 4, 3]}>
            <Box as="section">
              <Heading as="h2">Grid Item 1</Heading>
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};
