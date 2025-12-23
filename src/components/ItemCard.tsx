import React, { useRef } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Pressable,
  View,
  Animated,
  Image,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { Item } from '../types/item';
import { Theme } from '../theme';
import { getIcon } from '../utils/iconHelper';
import { Edit, Trash2 } from 'lucide-react-native';

type Props = {
  item: Item;
  theme: Theme;
  onEdit?: (item: Item) => void;
  onDelete?: (item: Item) => void;
};

const statusColors: Record<Item['status'], string> = {
  服役中: '#10b981',
  已出售: '#f59e0b',
  已退役: '#6b7280',
};

// 格式化日期：YYYY-MM-DD -> YYYY年M月D日
const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${year}年${parseInt(month)}月${parseInt(day)}日`;
};

// 计算已使用天数（至少为 1 天）
const calcDaysInUse = (dateStr: string): number => {
  const purchase = new Date(dateStr);
  if (Number.isNaN(purchase.getTime())) {
    return 0;
  }
  const now = new Date();
  const diffMs = now.getTime() - purchase.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return Math.max(days, 1);
};

function ItemCard({ item, theme, onEdit, onDelete }: Props) {
  const swipeableRef = useRef<Swipeable>(null);
  const pressAnim = useRef(new Animated.Value(1)).current;
  const IconComponent = getIcon(item.icon) as React.ComponentType<{
    size?: number;
    color?: string;
  }>;
  const statusColor = statusColors[item.status];
  const daysInUse = calcDaysInUse(item.purchaseDate);
  const dailyValue =
    daysInUse > 0 ? Math.round(item.price / daysInUse) : undefined;

  const renderRightActions = (
    progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>,
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.rightActions}>
        {/* 编辑按钮 */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.editButton,
            { backgroundColor: theme.accent },
          ]}
          onPress={() => {
            swipeableRef.current?.close();
            onEdit?.(item);
          }}
          activeOpacity={0.8}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Edit size={20} color="#ffffff" />
            <Text style={styles.actionText}>修改</Text>
          </Animated.View>
        </TouchableOpacity>

        {/* 删除按钮 */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            styles.deleteButton,
            { backgroundColor: '#ef4444' },
          ]}
          onPress={() => {
            swipeableRef.current?.close();
            onDelete?.(item);
          }}
          activeOpacity={0.8}>
          <Animated.View style={{ transform: [{ scale }] }}>
            <Trash2 size={20} color="#ffffff" />
            <Text style={styles.actionText}>删除</Text>
          </Animated.View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      rightThreshold={40}
      overshootRight={false}>
      <Pressable
        android_ripple={{ color: 'rgba(0,0,0,0.04)', borderless: false }}
        onPressIn={() => {
          Animated.timing(pressAnim, {
            toValue: 0.97,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }}
        onPressOut={() => {
          Animated.timing(pressAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }).start();
        }}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: theme.card,
              borderColor: '#f4f4f4',
              borderWidth: 0.5,
              transform: [{ scale: pressAnim }],
            },
          ]}>
          {item.imagePath ? (
            <Image source={{ uri: item.imagePath }} style={styles.image} />
          ) : (
            <View style={[styles.iconContainer, { backgroundColor: theme.bg }]}>
              <IconComponent size={32} color={theme.accent} />
            </View>
          )}
          <View style={styles.content}>
            <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
              {item.name}
            </Text>
            {item.description && (
              <Text
                style={[styles.description, { color: theme.muted }]}
                numberOfLines={1}>
                {item.description}
              </Text>
            )}
            <Text style={[styles.purchaseDate, { color: theme.muted }]}>
              入手时间：{formatDate(item.purchaseDate)}
            </Text>
            {daysInUse > 0 && dailyValue !== undefined && (
              <Text style={[styles.usageText, { color: theme.muted }]}>
                已使用 {daysInUse} 天 · 约 ¥{dailyValue.toLocaleString()}/天
              </Text>
            )}
            <View style={styles.footer}>
              <Text style={[styles.price, { color: theme.accent }]}>
                ¥{item.price.toLocaleString()}
              </Text>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: statusColor + '20' },
                ]}>
                <Text style={[styles.statusText, { color: statusColor }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </Pressable>
    </Swipeable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    gap: 12,
    marginBottom: 6,
    elevation: 1,
  },
  image: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  description: {
    fontSize: 12,
  },
  purchaseDate: {
    fontSize: 11,
    marginTop: 2,
  },
  usageText: {
    fontSize: 11,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    marginLeft: 6,
    gap: 6,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderRadius: 12,
    gap: 4,
  },
  editButton: {
    marginRight: 0,
  },
  deleteButton: {
    marginRight: 8,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ItemCard;
