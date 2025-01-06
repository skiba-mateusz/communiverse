import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { usePosts } from "../api/get-posts";
import { PostFilters } from "./post-filters";

export const PostsView = () => {
  const {
    posts,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isFetching,
    lastElementRef,
    error,
  } = usePosts();

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
