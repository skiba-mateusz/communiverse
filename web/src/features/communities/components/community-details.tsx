import { CommunitySummary } from "@/types/api";
import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Button } from "@/components/ui/button";
import { Heading, Typography } from "@/components/ui/typography";
import { Stack } from "@/components/ui/stack";

export const CommunityDetails = ({
  community,
}: {
  community: CommunitySummary;
}) => {
  const { name, description, thumbnailURL, numMembers, role } = community;
  const { name: roleName } = role;
  const isMember = roleName !== "Visitor";

  return (
    <Box as="section">
      <Stack styles={{ alignItems: "center" }}>
        <Avatar src={thumbnailURL || "/community.svg"} size="medium" />
        <Stack direction="vertical" spacing={0}>
          <Heading as="h4">{name}</Heading>
          <span>{numMembers} Members</span>
        </Stack>
      </Stack>
      <Typography styles={{ textAlign: "justify", marginBlock: 3 }}>
        {description}
      </Typography>
      <Button variant="outlined" full>
        {!isMember ? `Join ${name}` : "Already a Member"}
      </Button>
    </Box>
  );
};
