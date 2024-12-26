import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCommunityPosts } from "../api/get-community-posts";

export const CommunityPostsView = () => {
  const { posts = [], isLoading, error } = useCommunityPosts();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message $variant="alert">
        There was an error trying to display posts
      </Message>
    );
  }

  return <PostsList posts={posts} />;
};
