import { useInfiniteQuery } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api-client";
import {
  GetPostsParams,
  PaginatedResponse,
  PostSummary,
  PostTime,
  PostView,
} from "@/types/api";
import { useRef } from "react";
import { useObserver } from "@/hooks/use-observer";

const getCommunityPostsApi = async ({
  communitySlug,
  view,
  time,
  offset,
  limit,
}: GetPostsParams & { communitySlug: string }): Promise<
  PaginatedResponse<PostSummary>
> => {
  const res = await api.get(
    `/v1/communities/${communitySlug}/posts?view=${view}&time=${time}&offset=${offset}&limit=${limit}`
  );
  return res.data.data;
};

export const useCommunityPosts = () => {
  const { communitySlug } = useParams();
  const [searchParams] = useSearchParams();
  const lastElementRef = useRef<HTMLDivElement>(null);

  const view: PostView = (searchParams.get("view") as PostView) || "latest";
  let time: PostTime = (searchParams.get("time") as PostTime) || "week";
  if (view === "latest") {
    time = "all-time";
  }

  if (!communitySlug) {
    throw new Error("required parameter is missing");
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    error,
  } = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      getCommunityPostsApi({
        communitySlug,
        view,
        time,
        offset: pageParam,
        limit: 10,
      }),
    queryKey: ["posts", communitySlug, view, time],
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.meta.offset + lastPage.meta.limit;
      return nextOffset < lastPage.meta.totalCount ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });

  useObserver(lastElementRef, fetchNextPage);

  const posts = data?.pages.flatMap((page) => page.items) || [];
  const meta = data?.pages[0].meta || {};

  return {
    posts,
    meta,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
    lastElementRef,
    error,
  };
};
