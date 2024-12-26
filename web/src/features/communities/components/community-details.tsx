import { Link } from "react-router-dom";
import { CommunitySummary } from "@/types/api";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Heading, Typography } from "@/components/ui/typography";
import { Separator } from "@/components/ui/separator";
import { Stack } from "@/components/ui/stack";
import { Roles } from "@/features/auth/constants";

export const CommunityDetails = ({
  community,
}: {
  community: CommunitySummary;
}) => {
  const { name, slug, description, thumbnailURL, role } = community;
  const isMember = role.name === Roles.MEMBER || role.name === Roles.ADMIN;

  return (
    <Box as="section">
      <Link to={`/app/communities/${slug}`}>
        <Stack
          $styles={{ alignItems: "center", justifyContent: "center" }}
          $spacing={2}
        >
          <Avatar>
            <AvatarImage
              src={thumbnailURL}
              fallback={name}
              $size="medium"
              alt={`${name}'s avatar`}
            />
          </Avatar>
          <Stack $direction="vertical" $spacing={0}>
            <Heading as="h4">{name}</Heading>
            <Typography as="span" $styles={{ color: "colors.neutral.600" }}>
              @{slug}
            </Typography>
          </Stack>
        </Stack>
      </Link>
      <Separator $styles={{ marginBlock: 4 }} />
      <Typography $styles={{ textAlign: "center", marginBottom: 4 }}>
        {description}
      </Typography>
      <Button $variant="outlined" $full disabled={isMember}>
        {!isMember ? `Join` : "Member"}
      </Button>
    </Box>
  );
};
