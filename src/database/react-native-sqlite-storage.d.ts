declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(
      sql: string,
      params?: any[],
    ): Promise<[SQLiteResult]>;
    close(): Promise<void>;
  }

  export interface SQLiteResult {
    rows: {
      length: number;
      item(index: number): any;
    };
    rowsAffected: number;
    insertId?: number;
  }

  export interface SQLiteParams {
    name: string;
    location?: string;
  }

  export function openDatabase(
    params: SQLiteParams,
  ): Promise<SQLiteDatabase>;

  export function DEBUG(flag: boolean): void;
  export function enablePromise(flag: boolean): void;
}

