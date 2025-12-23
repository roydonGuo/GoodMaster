import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../theme';
import { categories } from '../../data';
import CategoryCard from '../components/CategoryCard';
import ItemCard from '../components/ItemCard';
import { ItemCategory, Item } from '../types/item';
import { Search } from 'lucide-react-native';
import { getIcon } from '../utils/iconHelper';
import {
  getAllItems,
  getItemsByCategory,
  deleteItem,
} from '../database/database';

type Props = {
  theme: Theme;
  refreshTrigger?: number;
  onEditItem?: (item: Item) => void;
};

// 全部分类
const allCategory: ItemCategory = {
  id: 'all',
  name: '全部',
  icon: 'grid',
};

function ItemsScreen({ theme, refreshTrigger, onEditItem }: Props) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadItems();
  }, [selectedCategoryId, refreshTrigger]);

  const loadItems = async () => {
    try {
      setLoading(true);
      let loadedItems: Item[];
      if (selectedCategoryId) {
        loadedItems = await getItemsByCategory(selectedCategoryId);
      } else {
        loadedItems = await getAllItems();
      }
      setItems(loadedItems);
    } catch (error) {
      console.error('Error loading items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: Item) => {
    onEditItem?.(item);
  };

  const handleDelete = (item: Item) => {
    Alert.alert(
      '确认删除',
      `确定要删除 "${item.name}" 吗？此操作无法撤销。`,
      [
        {
          text: '取消',
          style: 'cancel',
        },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              await loadItems(); // 重新加载列表
            } catch (error) {
              console.error('Error deleting item:', error);
              Alert.alert('错误', '删除物品失败，请重试');
            }
          },
        },
      ],
    );
  };

  const totalValue = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items],
  );

  return (
    <LinearGradient
      colors={['#ede9fe', '#ddd6fe', '#f5f3ff']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0.5, y: 0.5 }}
      style={[
        styles.gradientBackground,
        { paddingTop: insets.top + 12 },
      ]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* 顶部信息区域 */}
          {/* 顶部资产信息 */}
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.totalLabel, { color: theme.muted }]}>
                总资产估值
              </Text>
              <Text style={[styles.totalValue, { color: '#1f2933' }]}>
                ¥ {totalValue.toLocaleString()}
              </Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>AZ</Text>
            </View>
          </View>

          {/* 搜索框 */}
          <View style={styles.searchContainer}>
            <View style={styles.searchInner}>
              <Search size={18} color={theme.muted} />
              <Text style={[styles.searchPlaceholder, { color: theme.muted }]}>
                搜索物品...
              </Text>
            </View>
          </View>

          {/* 分类标签 */}
          <View style={styles.categoriesPills}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesPillsContent}>
              {/* 全部 */}
              <View style={styles.chipWrapper}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setSelectedCategoryId(null)}>
                  {(() => {
                    const IconComponent = getIcon(allCategory.icon) as React.ComponentType<{
                      size?: number;
                      color?: string;
                    }>;
                    const active = selectedCategoryId === null;
                    return (
                      <View
                        style={[
                          styles.chip,
                          styles.chipSecondary,
                          active && styles.chipSecondaryActive,
                        ]}>
                        <View style={styles.chipInner}>
                          <IconComponent
                            size={16}
                            color={active ? '#f9fafb' : '#4b5563'}
                          />
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextSecondaryActive,
                            ]}>
                            全部
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
                </TouchableOpacity>
              </View>
              {categories.map(category => {
                const active = selectedCategoryId === category.id;
                const IconComponent = getIcon(category.icon) as React.ComponentType<{
                  size?: number;
                  color?: string;
                }>;
                return (
                  <View key={category.id} style={styles.chipWrapper}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      onPress={() =>
                        setSelectedCategoryId(
                          active ? null : category.id,
                        )
                      }>
                      <View
                        style={[
                          styles.chip,
                          styles.chipSecondary,
                          active && styles.chipSecondaryActive,
                        ]}>
                        <View style={styles.chipInner}>
                          <IconComponent
                            size={16}
                            color={active ? '#f9fafb' : '#4b5563'}
                          />
                          <Text
                            style={[
                              styles.chipText,
                              active && styles.chipTextSecondaryActive,
                            ]}>
                            {category.name}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </ScrollView>
          </View> 

        {/* 物品列表 */}
        <View style={styles.itemsSection}>
          {loading ? (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                加载中...
              </Text>
            </View>
          ) : items.length > 0 ? (
            items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                theme={theme}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: theme.muted }]}>
                暂无物品
              </Text>
            </View>
          )}
        </View>

        {/* 占位 */}
        <View style={styles.placeholder} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 12,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center', 
    elevation: 1,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b5563',
  },
  searchContainer: {
    marginBottom: 12,
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  searchPlaceholder: {
    marginLeft: 8,
    fontSize: 13,
  },
  categoriesPills: {
    marginBottom: 12,
  },
  categoriesPillsContent: {
    paddingVertical: 4,
  },
  chipWrapper: {
    marginRight: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  chipPrimary: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipPrimaryActive: {},
  chipSecondary: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderColor: 'rgba(148,163,184,0.4)',
  },
  chipSecondaryActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4b5563',
  },
  chipTextPrimaryActive: {
    color: '#f9fafb',
  },
  chipTextSecondaryActive: {
    color: '#f9fafb',
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  productHeader: {
    marginBottom: 8,
  },
  glassCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 0.5,
    elevation: 1,
  },
  productName: {
    fontSize: 32,
    fontWeight: '800',
    letterSpacing: 1,
    marginBottom: 4,
  },
  productSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  categoriesSection: {
    marginTop: 16,
    marginBottom: 20,
  },
  categoriesList: {
    paddingVertical: 4,
  },
  categoryWrapper: {
    flexDirection: 'row',
  },
  categoryGap: {
    width: 12,
  },
  itemsSection: {
    gap: 12,
    paddingBottom: 20,
  },
  emptyContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  placeholder:{
    height: 60,
  }
});

export default ItemsScreen;
