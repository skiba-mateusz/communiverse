import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import {
  GetPostsParams,
  PaginatedResponse,
  PostSummary,
  PostTime,
  PostView,
} from "@/types/api";
import { useSearchParams } from "react-router-dom";
import { useRef } from "react";
import { useObserver } from "@/hooks/use-observer";

const getCurrentUserFeedApi = async ({
  view,
  time,
  offset,
  limit,
}: GetPostsParams): Promise<PaginatedResponse<PostSummary>> => {
  const res = await api.get(
    `/v1/users/me/feed?view=${view}&time=${time}&offset=${offset}&limit=${limit}`
  );
  return res.data.data;
};

export const useCurrentUserFeed = () => {
  const [searchParams] = useSearchParams();
  const lastElementRef = useRef<HTMLDivElement>(null);

  const view = (searchParams.get("view") as PostView) || "latest";
  const time = (searchParams.get("time") as PostTime) || "week";

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
      getCurrentUserFeedApi({ view, time, offset: pageParam, limit: 10 }),
    queryKey: ["posts", "feed", view, time],
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
