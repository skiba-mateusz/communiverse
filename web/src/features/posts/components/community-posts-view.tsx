import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCommunityPosts } from "../api/get-community-posts";
import { PostFilters } from "./post-filters";

export const CommunityPostsView = () => {
  const {
    posts,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    lastElementRef,
    error,
  } = useCommunityPosts();

  if (error) {
    return (
      <Message $variant="alert">
        There was an error trying to display posts
      </Message>
    );
  }

  return (
    <>
      <PostFilters />
      {isLoading || (isFetching && isFetchingNextPage) ? (
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
