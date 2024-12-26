import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Box } from "@/components/ui/box";
import { Heading, Typography } from "@/components/ui/typography";
import { Stack } from "@/components/ui/stack";
import { UserSummary } from "@/types/api";
import { Link } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

export const PostAuthorDetails = ({ author }: { author: UserSummary }) => {
  const { name, username, bio, avatarURL } = author;

  return (
    <Box as="section">
      <Link to={`/app/users/${username}`}>
        <Stack
          $styles={{ alignItems: "center", justifyContent: "center" }}
          $spacing={2}
        >
          <Avatar>
            <AvatarImage
              src={avatarURL}
              fallback={username.charAt(0).toUpperCase()}
              $size="medium"
              alt={`${username}'s avatars`}
            />
          </Avatar>
          <div>
            <Heading as="h4">{name}</Heading>
            <Typography $styles={{ color: "colors.neutral.600" }}>
              @{username}
            </Typography>
          </div>
        </Stack>
      </Link>
      <Separator $styles={{ marginBlock: 4 }} />
      <Typography $styles={{ textAlign: "center", marginTop: 3 }}>
        {bio}
      </Typography>
    </Box>
  );
};
