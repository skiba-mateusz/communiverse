import { PostCard } from "./post-card";
import { Flow } from "@/components/ui/flow";
import { Message } from "@/components/ui/message";
import { Post } from "@/types/api";

export const PostsList = ({ posts }: { posts: Post[] }) => {
  if (posts?.length === 0) {
    <Message variant="status">No posts available</Message>;
  }

  return (
    <Flow as="ul">
      {posts?.map((post) => (
        <li>
          <PostCard post={post} />
        </li>
      ))}
    </Flow>
  );
};
