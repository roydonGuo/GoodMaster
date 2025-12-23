import { Item, ItemStatus } from '../src/types/item';
import { items } from './items';

export const getItemsByCategory = (categoryId: string): Item[] => {
  return items.filter(item => item.categoryId === categoryId);
};

export const getItemsByStatus = (status: ItemStatus): Item[] => {
  return items.filter(item => item.status === status);
};

export const getAllItems = (): Item[] => {
  return items;
};

