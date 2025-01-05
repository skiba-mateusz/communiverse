import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCommunityPosts } from "../api/get-community-posts";
import { PostFilters } from "./post-filters";

export const CommunityPostsView = () => {
  const { posts = [], isLoading, isFetching, error } = useCommunityPosts();

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
      {isLoading || isFetching ? <Loader /> : <PostsList posts={posts} />}
    </>
  );
};
