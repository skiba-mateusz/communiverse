import { useGetCurrentUserFeed } from "@/features/users/api/get-current-user-feed";
import { Loader } from "@/components/ui/loader";
import { PostCard } from "./post-card";
import { Flow } from "@/components/ui/flow";

export const PostsList = () => {
  const { feed, isLoading, error } = useGetCurrentUserFeed();

  console.log(feed);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Flow as="ul">
      {feed?.map((post) => (
        <li>
          <PostCard post={post} />
        </li>
      ))}
    </Flow>
  );
};
