import { Avatar } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading, Typography } from "@/components/ui/typography";
import { Stack } from "@/components/ui/stack";
import { UserSummary } from "@/types/api";
import { Link } from "react-router-dom";

export const PostAuthorDetails = ({ author }: { author: UserSummary }) => {
  const { name, username, bio, avatarURL } = author;
  return (
    <Box as="section">
      <Stack styles={{ alignItems: "center" }}>
        <Link to={`/app/communities/${username}`}>
          <Avatar src={avatarURL || "/avatar.svg"} size="medium" />
        </Link>
        <Stack direction="vertical" spacing={0}>
          <Heading as="h4">{name}</Heading>
          <span>{username}</span>
        </Stack>
      </Stack>
      <Typography styles={{ textAlign: "justify", marginTop: 3 }}>
        {bio}
      </Typography>
    </Box>
  );
};
