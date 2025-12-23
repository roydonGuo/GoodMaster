// @ts-ignore
import SQLite from 'react-native-sqlite-storage';
import { Item } from '../types/item';

SQLite.DEBUG(false);
SQLite.enablePromise(true);

let db: any = null;

export const initDatabase = async (): Promise<void> => {
  try {
    db = await SQLite.openDatabase({
      name: 'ItemsDB.db',
      location: 'default',
    });

    // 创建物品表
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        categoryId TEXT NOT NULL,
        status TEXT NOT NULL,
        price REAL NOT NULL,
        icon TEXT NOT NULL,
        imagePath TEXT,
        description TEXT,
        purchaseDate TEXT NOT NULL
      )
    `);

    // 迁移：尝试添加 imagePath 列，若已存在则忽略
    try {
      await db.executeSql(`ALTER TABLE items ADD COLUMN imagePath TEXT`);
    } catch (e) {
      // ignore
    }

    // 检查是否有数据，如果没有则插入初始数据
    const [result] = await db.executeSql('SELECT COUNT(*) as count FROM items');
    const count = result.rows.item(0).count;

    if (count === 0) {
      await seedInitialData();
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

const seedInitialData = async (): Promise<void> => {
  if (!db) return;

  const initialItems: Item[] = [
    {
      id: '1',
      name: 'iPhone 17',
      categoryId: 'digital',
      status: '服役中',
      price: 8999,
      icon: 'smartphone',
      description: '最新款 iPhone，256GB 存储',
      purchaseDate: '2024-10-15',
    },
    {
      id: '2',
      name: 'MacBook Pro',
      categoryId: 'digital',
      status: '服役中',
      price: 14999,
      icon: 'laptop',
      description: 'M3 芯片，16GB 内存，512GB 存储',
      purchaseDate: '2024-09-20',
    },
    {
      id: '3',
      name: 'AirPods Pro',
      categoryId: 'digital',
      status: '服役中',
      price: 1899,
      icon: 'headphones',
      description: '主动降噪，空间音频',
      purchaseDate: '2024-08-10',
    },
  ];

  for (const item of initialItems) {
    await insertItem(item);
  }
};

export const getDatabase = (): any => {
  if (!db) {
    throw new Error('Database not initialized. Call initDatabase() first.');
  }
  return db;
};

export const insertItem = async (item: Item): Promise<void> => {
  const database = getDatabase();
  await database.executeSql(
    `INSERT INTO items (id, name, categoryId, status, price, icon, imagePath, description, purchaseDate)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.name,
      item.categoryId,
      item.status,
      item.price,
      item.icon,
      item.imagePath || null,
      item.description || null,
      item.purchaseDate,
    ],
  );
};

export const getAllItems = async (): Promise<Item[]> => {
  const database = getDatabase();
  const [result] = await database.executeSql(
    'SELECT * FROM items ORDER BY purchaseDate DESC',
  );
  const items: Item[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    items.push({
      id: row.id,
      name: row.name,
      categoryId: row.categoryId,
      status: row.status as Item['status'],
      price: row.price,
      icon: row.icon,
    imagePath: row.imagePath || undefined,
      description: row.description,
      purchaseDate: row.purchaseDate,
    });
  }

  return items;
};

export const getItemsByCategory = async (categoryId: string): Promise<Item[]> => {
  const database = getDatabase();
  const [result] = await database.executeSql(
    'SELECT * FROM items WHERE categoryId = ? ORDER BY purchaseDate DESC',
    [categoryId],
  );
  const items: Item[] = [];

  for (let i = 0; i < result.rows.length; i++) {
    const row = result.rows.item(i);
    items.push({
      id: row.id,
      name: row.name,
      categoryId: row.categoryId,
      status: row.status as Item['status'],
      price: row.price,
      icon: row.icon,
    imagePath: row.imagePath || undefined,
      description: row.description,
      purchaseDate: row.purchaseDate,
    });
  }

  return items;
};

export const updateItem = async (item: Item): Promise<void> => {
  const database = getDatabase();
  await database.executeSql(
    `UPDATE items 
     SET name = ?, categoryId = ?, status = ?, price = ?, icon = ?, imagePath = ?, description = ?, purchaseDate = ?
     WHERE id = ?`,
    [
      item.name,
      item.categoryId,
      item.status,
      item.price,
      item.icon,
      item.imagePath || null,
      item.description || null,
      item.purchaseDate,
      item.id,
    ],
  );
};

export const deleteItem = async (id: string): Promise<void> => {
  const database = getDatabase();
  await database.executeSql('DELETE FROM items WHERE id = ?', [id]);
};

export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
};
