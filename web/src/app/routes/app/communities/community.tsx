import { Head } from "@/components/seo";
import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Container } from "@/components/ui/container";
import { Grid, GridItem } from "@/components/ui/grid";
import { Loader } from "@/components/ui/loader";
import { Message } from "@/components/ui/message";
import { Stack } from "@/components/ui/stack";
import { Heading, Typography } from "@/components/ui/typography";
import { useCommunity } from "@/features/communities/api/get-community";
import { CommunityButton } from "@/features/communities/components/community-button";
import { formatDate } from "@/utils/time";

export const CommunityRoute = () => {
  const { community, isLoading, error } = useCommunity();

  if (isLoading) return <Loader />;
  if (error)
    return (
      <Message variant="alert">
        There was an error trying to display community
      </Message>
    );
  if (!community) return null;

  const {
    name,
    description,
    slug,
    thumbnailURL,
    numMembers,
    numPosts,
    createdAt,
    role,
    creator,
  } = community;

  return (
    <>
      <Head title="Communities" />
      <Grid>
        <GridItem span={[12, 12, 12]}>
          <section>
            <Container variant="wide">
              <Stack
                styles={{
                  flexDirection: ["column", "column", "row"],
                  alignItems: "center",
                }}
              >
                <img
                  width={400}
                  height={225}
                  src={thumbnailURL}
                  style={{ borderRadius: ".5rem" }}
                />
                <Stack
                  direction="vertical"
                  styles={{ alignItems: ["center", "center", "start"] }}
                >
                  <div>
                    <Heading
                      as="h1"
                      styles={{ textAlign: ["center", "center", "left"] }}
                    >
                      {name}
                    </Heading>
                    <Stack styles={{ color: "colors.neutral.600" }}>
                      <span>@{slug}</span>
                      <time>
                        Created{" "}
                        {formatDate(createdAt, {
                          month: "short",
                          year: "numeric",
                        })}
                      </time>
                    </Stack>
                  </div>
                  <Stack>
                    <div>
                      <Typography
                        as="span"
                        styles={{ fontSize: "font.size.md" }}
                      >
                        {numPosts}{" "}
                      </Typography>
                      Posts
                    </div>
                    <div>
                      <Typography
                        as="span"
                        styles={{ fontSize: "font.size.md" }}
                      >
                        {numMembers}{" "}
                      </Typography>
                      Members
                    </div>
                  </Stack>
                  <Stack direction="vertical" spacing={1}>
                    <Typography
                      as="span"
                      styles={{
                        color: "colors.neutral.600",
                        textAlign: ["center", "center", "left"],
                      }}
                    >
                      Created by
                    </Typography>
                    <Box styles={{ padding: 2 }}>
                      <Avatar src={creator.avatarURL} name={creator.name} />
                    </Box>
                  </Stack>
                </Stack>
              </Stack>
              <Typography
                styles={{
                  marginBlock: 6,
                  maxWidth: "44ch",
                  textAlign: ["center", "center", "left"],
                  marginInline: ["auto", "auto", 0],
                }}
                as="p"
              >
                {description}
              </Typography>
              <CommunityButton role={role} />
            </Container>
          </section>
        </GridItem>
        <GridItem span={[12, 12, 12]}>
          <section>
            <Container variant="narrow">
              <Typography>TODO: community posts</Typography>
            </Container>
          </section>
        </GridItem>
      </Grid>
    </>
  );
};
