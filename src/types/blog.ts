export interface BlogTranslation {
  title: string;
  excerpt: string;
  content: string[];
}

export interface BlogPost {
  id: string;
  en: BlogTranslation;
  si: BlogTranslation;
  ta: BlogTranslation;
  image: string;
  date: string;
  author: string;
}
