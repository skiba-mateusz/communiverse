import { Message } from "@/components/ui/message";
import { CommunitySummary } from "@/types/api";
import { CommunityCard } from "./community-card";
import { Grid, GridItem } from "@/components/ui/grid";

export const CommunitiesList = ({
  communities,
}: {
  communities: CommunitySummary[];
}) => {
  if (communities.length === 0) {
    <Message $variant="status">No communities available</Message>;
  }

  return (
    <Grid as="ul">
      {communities.map((community, index) => (
        <GridItem as="li" $span={[12, 6, 4]} key={index}>
          <CommunityCard community={community} />
        </GridItem>
      ))}
    </Grid>
  );
};
