import { Head } from "@/components/seo";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Container } from "@/components/ui/container";
import { Grid, GridItem } from "@/components/ui/grid";
import { Loader } from "@/components/ui/loader";
import { Message } from "@/components/ui/message";
import { Stack } from "@/components/ui/stack";
import { Heading, Typography } from "@/components/ui/typography";
import { useCommunity } from "@/features/communities/api/get-community";
import { CommunityButton } from "@/features/communities/components/community-button";
import { CommunityPostsView } from "@/features/posts/components/community-posts-view";
import { formatDate } from "@/utils/time";
import { Link } from "react-router-dom";

export const CommunityRoute = () => {
  const { community, isLoading, isFetching, error } = useCommunity();

  if (isLoading || isFetching) return <Loader />;
  if (error)
    return (
      <Message $variant="alert">
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
      <Head title={`${name}`} />
      <Container $variant="wide">
        <Grid>
          <GridItem $span={[12, 8, 8]}>
            <section>
              <Heading
                as="h2"
                $underlined
                $styles={{ marginBottom: [8, 10, 12] }}
              >
                {name}'s Posts
              </Heading>
              <CommunityPostsView />
            </section>
          </GridItem>
          <GridItem $span={[12, 4, 4]}>
            <Box as="section">
              <Stack $direction="vertical">
                <Avatar $styles={{ margin: "auto" }}>
                  <AvatarImage
                    $size="large"
                    src={thumbnailURL}
                    fallback={name}
                    alt={`${name}'s avatar`}
                  />
                </Avatar>
                <Stack $direction="vertical" $styles={{ textAlign: "center" }}>
                  <div>
                    <Heading as="h1">{name}</Heading>
                    <Stack
                      $styles={{
                        color: "colors.neutral.600",
                        justifyContent: "center",
                      }}
                    >
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
                  <Stack $styles={{ justifyContent: "center" }}>
                    <div>
                      <Typography as="span">{numPosts} </Typography>
                      Posts
                    </div>
                    <div>
                      <Typography as="span">{numMembers} </Typography>
                      Members
                    </div>
                  </Stack>
                  <Stack
                    $direction="vertical"
                    $spacing={1}
                    $styles={{ alignItems: "center" }}
                  >
                    <Typography
                      as="span"
                      $styles={{
                        color: "colors.neutral.600",
                      }}
                    >
                      Created by
                    </Typography>
                    <Link to={`/app/users/${creator.username}`}>
                      <Box
                        $styles={{
                          padding: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        <Avatar>
                          <AvatarImage
                            src={creator.avatarURL}
                            fallback={creator.username}
                            alt={`${creator.username}'s avatar`}
                          />
                        </Avatar>
                        <div>
                          <Typography>{creator.name}</Typography>
                          <Typography
                            $styles={{
                              fontSize: "font.size.xs",
                              color: "colors.neutral.600",
                              textAlign: "left",
                            }}
                          >
                            @{creator.username}
                          </Typography>
                        </div>
                      </Box>
                    </Link>
                  </Stack>
                </Stack>
              </Stack>
              <Typography
                $styles={{
                  marginBlock: 6,
                  textAlign: "center",
                }}
                as="p"
              >
                {description}
              </Typography>
              <CommunityButton role={role} />
            </Box>
          </GridItem>
        </Grid>
      </Container>
    </>
  );
};
