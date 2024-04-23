import "server-only"
import { db } from "./db"
import { posts } from "./db/schema";

export async function getPosts(){
  
  const allPosts = await db.query.posts.findMany();
  console.log('allPosts', allPosts);
  return allPosts;
}

export async function addPost(name: string) {
  await db.insert(posts).values({name: name})

}