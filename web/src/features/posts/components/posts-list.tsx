import { PostCard } from "./post-card";
import { Stack } from "@/components/ui/stack";
import { Message } from "@/components/ui/message";
import { PostSummary } from "@/types/api";

export const PostsList = ({ posts }: { posts: PostSummary[] }) => {
  if (posts.length === 0) {
    <Message $variant="status">No posts available</Message>;
  }

  return (
    <Stack as="ul" $direction="vertical">
      {posts.map((post) => (
        <li>
          <PostCard post={post} />
        </li>
      ))}
    </Stack>
  );
};
