import { Loader } from "@/components/ui/loader";
import { PostsList } from "./posts-list";
import { Message } from "@/components/ui/message";
import { useCurrentUserFeed } from "@/features/users/api/get-current-user-feed";
import { getAxiosErrorMessage } from "@/utils/errors";

export const FeedView = () => {
  const { posts = [], isLoading, error } = useCurrentUserFeed();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Message variant="alert">{getAxiosErrorMessage(error)}</Message>;
  }

  return <PostsList posts={posts} />;
};