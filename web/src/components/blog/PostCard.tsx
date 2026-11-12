import { TYPE_LABEL } from '@/lib/blog/posts';
import type { PostMeta } from '@/lib/blog/posts';
import { PostCardView } from '@/components/blog/PostCardView';

export function PostCard({ post, minutes, headingLevel = 'h2' }: { post: PostMeta; minutes: number; headingLevel?: 'h2' | 'h3' }) {
  return <PostCardView slug={post.slug} typeLabel={TYPE_LABEL[post.type]} image={post.image} h1={post.h1} description={post.description} minutes={minutes} headingLevel={headingLevel} />;
}
