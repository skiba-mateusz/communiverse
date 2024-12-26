import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardLink,
} from "@/components/ui/card";

import { Heading, Typography } from "@/components/ui/typography";
import { Roles } from "@/features/auth/constants";
import { CommunitySummary } from "@/types/api";

export const CommunityCard = ({
  community,
}: {
  community: CommunitySummary;
}) => {
  const { name, description, slug, thumbnailURL, role, numMembers } = community;
  const isMember = role.name === Roles.MEMBER || role.name === Roles.ADMIN;

  return (
    <Card
      $styles={{
        height: "100%",
      }}
    >
      <CardLink to={`/app/communities/${slug}`} />
      <CardHeader>
        <Avatar>
          <AvatarImage
            $size="medium"
            src={thumbnailURL}
            fallback={name}
            alt={`${name}'s avatar`}
          />
        </Avatar>
        <div>
          <Heading as="h3">{name}</Heading>
          <Typography $styles={{ fontWeight: "font.weight.semi" }}>
            {numMembers} members
          </Typography>
        </div>
      </CardHeader>
      <CardContent $styles={{ display: ["none", "block", "block"], flex: "1" }}>
        <Typography>{description}</Typography>
      </CardContent>
      <CardActions>
        <Button $variant="outlined" $full disabled={isMember}>
          {!isMember ? `Join` : "Member"}
        </Button>
      </CardActions>
    </Card>
  );
};
