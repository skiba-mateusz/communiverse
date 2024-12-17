import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { usePosts } from "../api/get-posts";

export const PostsView = () => {
  const { posts = [], isLoading, error } = usePosts();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Message variant="alert">
        There was an error trying to display posts
      </Message>
    );
  }

  return <PostsList posts={posts} />;
};
