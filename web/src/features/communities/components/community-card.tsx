import { Button } from "@/components/ui/button";
import {
  Card,
  CardActions,
  CardContent,
  CardLink,
  CardMedia,
} from "@/components/ui/card";
import { Stack } from "@/components/ui/stack";
import { Typography } from "@/components/ui/typography";
import { CommunitySummary } from "@/types/api";

export const CommunityCard = ({
  community,
}: {
  community: CommunitySummary;
}) => {
  const { name, description, slug, thumbnailURL, role, numMembers } = community;
  const { name: roleName } = role;
  const isMember = roleName !== "Visitor";

  return (
    <Card styles={{ display: ["flex", "block", "block"] }}>
      <CardLink to={`/app/communities/${slug}`} />
      <CardMedia
        src={thumbnailURL || "/community.svg"}
        alt={`${name} community thumbnail`}
        styles={{ maxWidth: ["6rem", "100%", "100%"], width: "100%" }}
      />
      <CardContent styles={{ width: "100%", marginBlock: "auto" }}>
        <Stack direction="vertical" spacing={2}>
          <Typography
            styles={{
              width: "100%",
              fontWeight: "font.weight.bold",
              fontSize: "font.size.md",
            }}
          >
            {name}
          </Typography>
          <Typography styles={{ fontWeight: "font.weight.semi" }}>
            {numMembers} members
          </Typography>
          <Typography styles={{ display: ["none", "block", "block"] }}>
            {description}
          </Typography>
        </Stack>
      </CardContent>
      <CardActions>
        <Button full disabled={isMember}>
          {!isMember ? `Join` : "Member"}
        </Button>
      </CardActions>
    </Card>
  );
};
