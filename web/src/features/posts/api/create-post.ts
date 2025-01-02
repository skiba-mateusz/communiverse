import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";
import { useToasts } from "@/components/ui/toasts";
import { api } from "@/lib/api-client";
import { getAxiosErrorMessage } from "@/utils/errors";

export const createPostPayloadSchema = yup.object({
  title: yup
    .string()
    .required("Title is required")
    .min(8, "Title must be at least 8 characters")
    .max(100, "Title cannot exceed 100 characters"),
  content: yup
    .string()
    .required("Content is required")
    .min(100, "Content must be at least 100 characters")
    .max(2500, "Content cannot exceed 2500 characters"),
  tags: yup
    .array()
    .transform((value: string) =>
      value
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)
    )
    .test(
      "isArray",
      "Cannot be empty and must be comma spearated",
      (value) => Array.isArray(value) && value.length > 0
    )
    .test("minTagLength", "Tag must be at least 3 characters long", (value) =>
      value ? value.every((tag) => tag.length >= 3) : false
    )
    .test("minLength", "Only 3 tags are allowed", (value) =>
      value ? value.length <= 3 : false
    ),
});

export type CreatePostPayload = yup.InferType<typeof createPostPayloadSchema>;

const createPostApi = async (
  communitySlug: string,
  payload: CreatePostPayload
) => {
  const res = await api.post(`/v1/communities/${communitySlug}/posts`, payload);
  return res.data.data;
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { communitySlug } = useParams();
  const { success, error } = useToasts();

  if (!communitySlug) {
    throw new Error("required parameter is missing");
  }

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: (payload: CreatePostPayload) =>
      createPostApi(communitySlug, payload),
    onSuccess: ({ slug }) => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
      navigate(`/app/communities/${communitySlug}/posts/${slug}`);
      success("post successfully created");
    },
    onError: (err) => {
      error(getAxiosErrorMessage(err));
    },
  });

  return { createPost, isPending };
};
