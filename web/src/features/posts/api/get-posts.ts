import { useObserver } from "@/hooks/use-observer";
import { api } from "@/lib/api-client";
import {
  PaginatedResponse,
  GetPostsParams,
  PostSummary,
  PostTime,
  PostView,
} from "@/types/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useRef } from "react";
import { useSearchParams } from "react-router-dom";

const getPostsApi = async ({
  view,
  time,
  offset,
  limit,
}: GetPostsParams): Promise<PaginatedResponse<PostSummary>> => {
  const res = await api.get(
    `/v1/posts?view=${view}&time=${time}&offset=${offset}&limit=${limit}`
  );
  return res.data.data;
};

export const usePosts = () => {
  const [searchParams] = useSearchParams();
  const lastElementRef = useRef<HTMLDivElement>(null);

  const view: PostView = (searchParams.get("view") as PostView) || "latest";
  const time: PostTime = (searchParams.get("time") as PostTime) || "week";

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
      getPostsApi({ view, time, offset: pageParam, limit: 10 }),
    queryKey: ["posts", "all", view, time],
    getNextPageParam: (lastPage) => {
      const nextOffset = lastPage.meta.offset + lastPage.meta.limit;
      return nextOffset < lastPage.meta.totalCount ? nextOffset : undefined;
    },
    initialPageParam: 0,
  });

  useObserver<HTMLDivElement>(lastElementRef, fetchNextPage);

  const posts = data?.pages.flatMap((page) => page.items) || [];
  const meta = data?.pages[0]?.meta || {};

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
