export type ItemStatus = '服役中' | '已出售' | '已退役';

export type ItemCategory = {
  id: string;
  name: string;
  icon: string; // lucide icon name
};

export type Item = {
  id: string;
  name: string;
  categoryId: string;
  status: ItemStatus;
  price: number;
  icon: string; // lucide icon name
  description?: string;
  purchaseDate: string; // 入手时间，格式：YYYY-MM-DD
};

