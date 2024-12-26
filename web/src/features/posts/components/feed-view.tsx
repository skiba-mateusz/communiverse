import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCurrentUserFeed } from "@/features/users/api/get-current-user-feed";

export const FeedView = () => {
  const { posts = [], isLoading, error } = useCurrentUserFeed();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message $variant="alert">
        There was an error trying to display user feed
      </Message>
    );
  }

  return <PostsList posts={posts} />;
};
