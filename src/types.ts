export interface BrandFile {
  id: string;
  name: string;
  type: string;
  category: string;
  icon: string;
  date: string;
  size: string;
  content: string;
}

export interface ToneOption {
  id: string;
  label: string;
  value: string;
  icon: string;
  description: string;
}

export interface AssetTypeOption {
  id: string;
  label: string;
  value: string;
  icon: string;
  promptPlaceholder: string;
}

export interface TeamUseCase {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  category: string;
  date: string;
  imageUrl: string;
  content: string;
}

export interface UserComment {
  id: string;
  author: string;
  role: string;
  text: string;
  avatarUrl: string;
  date: string;
}
