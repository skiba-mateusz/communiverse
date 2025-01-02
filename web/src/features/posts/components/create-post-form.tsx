import { Form, Input, Textarea } from "@/components/ui/form";
import {
  CreatePostPayload,
  createPostPayloadSchema,
  useCreatePost,
} from "../api/create-post";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsPanel, TabsTrigger } from "@/components/ui/tabs";
import { useFormContext } from "react-hook-form";
import { PostMarkdown } from "./post-markdown";

const PostContentTabs = () => {
  const { watch } = useFormContext();

  const content = watch("content");

  return (
    <Tabs defaultValue="write">
      <TabsList>
        <TabsTrigger value="write">Write</TabsTrigger>
        <TabsTrigger value="preview">Preview</TabsTrigger>
      </TabsList>
      <TabsPanel value="write">
        <Textarea
          name="content"
          label="Content"
          placeholder="What's on your mind"
        />
      </TabsPanel>
      <TabsPanel value="preview">
        <PostMarkdown markdown={content} />
      </TabsPanel>
    </Tabs>
  );
};

export const CreatePostForm = () => {
  const { createPost, isPending } = useCreatePost();

  return (
    <Form<CreatePostPayload>
      onSubmit={(data) => createPost(data)}
      schema={createPostPayloadSchema}
    >
      <Input name="title" label="Title" placeholder="My Amazing Post" />
      <Input name="tags" label="Tags" placeholder="Lifestyle, Tech, Books" />
      <PostContentTabs />
      <Button isLoading={isPending} disabled={isPending}>
        Create Post
      </Button>
    </Form>
  );
};
