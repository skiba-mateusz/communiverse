import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCurrentUserFeed } from "@/features/users/api/get-current-user-feed";
import { PostFilters } from "./post-filters";

export const FeedView = () => {
  const {
    posts,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    lastElementRef,
    error,
  } = useCurrentUserFeed();

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
      {isLoading || (isFetching && !isFetchingNextPage) ? (
        <Loader />
      ) : (
        <>
          <PostsList posts={posts} />
          {isFetchingNextPage ? <Loader /> : null}
          {hasNextPage ? <div ref={lastElementRef}></div> : null}
        </>
      )}
    </>
  );
};
