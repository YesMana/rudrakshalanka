export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string[]; // Array of paragraphs for easy rendering
  image: string;
  date: string;
  author: string;
}
