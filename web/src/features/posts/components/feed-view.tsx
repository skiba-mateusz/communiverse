import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCurrentUserFeed } from "@/features/users/api/get-current-user-feed";
import { PostFilters } from "./post-filters";

export const FeedView = () => {
  const { posts = [], isLoading, isFetching, error } = useCurrentUserFeed();

  if (error) {
    return (
      <Message $variant="alert">
        There was an error trying to display user feed
      </Message>
    );
  }

  return (
    <>
      <PostFilters />
      {isLoading || isFetching ? <Loader /> : <PostsList posts={posts} />}
    </>
  );
};
