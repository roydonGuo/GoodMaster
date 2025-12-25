import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
// @ts-ignore
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Settings, FileText, Plus, ChevronRight } from 'lucide-react-native';
import { Theme } from '../theme';
import {
  getTotalItemCount,
  getThisMonthNewItemsCount,
  getLast6MonthsTrend,
} from '../database/database';

type Props = {
  theme: Theme;
  refreshTrigger?: number;
  onNavigateToCategoryManagement?: () => void;
};

function ProfileScreen({
  theme,
  refreshTrigger,
  onNavigateToCategoryManagement,
}: Props) {
  const insets = useSafeAreaInsets();
  const [totalCount, setTotalCount] = useState(0);
  const [thisMonthCount, setThisMonthCount] = useState(0);
  const [trendData, setTrendData] = useState<
    Array<{ month: string; value: number }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [total, thisMonth, trends] = await Promise.all([
        getTotalItemCount(),
        getThisMonthNewItemsCount(),
        getLast6MonthsTrend(),
      ]);
      setTotalCount(total);
      setThisMonthCount(thisMonth);
      setTrendData(trends);
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 计算图表的最大值和最小值
  const maxValue = Math.max(...trendData.map(d => d.value), 0);
  const minValue = Math.min(...trendData.map(d => d.value), 0);
  const range = maxValue - minValue || 1;

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
        {/* 用户信息头部 */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <LinearGradient
              colors={['#a78bfa', '#8b5cf6']}
              style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>SC</Text>
              </View>
            </LinearGradient>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>Sarah Chen</Text>
              <Text style={styles.joinDate}>加入时间 2023.10</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* 统计卡片 */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>物品数量</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{totalCount}</Text>
              <Text style={styles.statUnit}> 件</Text>
            </View>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>本月新增</Text>
            <View style={styles.statValueContainer}>
              <Text style={[styles.statValue, styles.statValueOrange]}>
                +{thisMonthCount}
              </Text>
              <Text style={styles.statUnit}> 件</Text>
            </View>
          </View>
        </View>

        {/* 资产趋势图表 */}
        <View style={styles.trendCard}>
          <View style={styles.trendHeader}>
            <Text style={styles.trendTitle}>资产趋势</Text>
            <Text style={styles.trendSubtitle}>近6个月</Text>
          </View>
          {trendData.length > 0 ? (
            <View style={styles.chartContainer}>
              <View style={styles.chart}>
                <View style={styles.chartArea}>
                  {/* 简化的折线图 */}
                  {trendData.map((point, index) => {
                    if (index === 0) return null;
                    const prevPoint = trendData[index - 1];
                    const chartWidth = 280; // 固定宽度
                    const chartHeight = 120; // 固定高度
                    const x1 = ((index - 1) / (trendData.length - 1)) * chartWidth;
                    const x2 = (index / (trendData.length - 1)) * chartWidth;
                    const y1 =
                      chartHeight -
                      ((prevPoint.value - minValue) / range) * (chartHeight - 20);
                    const y2 =
                      chartHeight - ((point.value - minValue) / range) * (chartHeight - 20);
                    const dx = x2 - x1;
                    const dy = y2 - y1;
                    const length = Math.sqrt(dx * dx + dy * dy);
                    const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

                    return (
                      <View
                        key={`line-${index}`}
                        style={[
                          styles.line,
                          {
                            left: x1,
                            top: y1,
                            width: length,
                            transform: [{ rotate: `${angle}deg` }],
                          },
                        ]}
                      />
                    );
                  })}
                  {/* 数据点 */}
                  {trendData.map((point, index) => {
                    const chartWidth = 280;
                    const chartHeight = 120;
                    const x = (index / (trendData.length - 1)) * chartWidth;
                    const y =
                      chartHeight - ((point.value - minValue) / range) * (chartHeight - 20);
                    return (
                      <View
                        key={`point-${index}`}
                        style={[
                          styles.dataPoint,
                          {
                            left: x - 4,
                            top: y - 4,
                          },
                        ]}
                      />
                    );
                  })}
                  {/* 渐变背景区域 - 简化版 */}
                  <View style={styles.chartGradientOverlay} />
                </View>
                {/* X轴标签 */}
                <View style={styles.xAxis}>
                  {trendData.map((point, index) => (
                    <Text key={index} style={styles.xAxisLabel}>
                      {point.month}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ) : (
            <View style={styles.emptyChart}>
              <Text style={styles.emptyChartText}>暂无数据</Text>
            </View>
          )}
        </View>

        {/* 功能列表 */}
        <View style={styles.actionList}>
          <TouchableOpacity style={styles.actionItem}>
            <View style={[styles.actionIcon, styles.actionIconBlue]}>
              <FileText size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>导出报表</Text>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={onNavigateToCategoryManagement}>
            <View style={[styles.actionIcon, styles.actionIconOrange]}>
              <Plus size={20} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>类别管理</Text>
            <ChevronRight size={20} color="#9ca3af" />
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
    marginRight: 12,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 26,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#4f46e5',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2933',
    marginBottom: 4,
  },
  joinDate: {
    fontSize: 13,
    color: '#6b7280',
  },
  settingsButton: {
    padding: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0 ,  
    elevation: 2,
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280', 
    marginBottom: 8,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1f2933',
  },
  statValueOrange: {
    color: '#f97316',
  },
  statUnit: {
    fontSize: 14,
    color: '#9ca3af',
    marginLeft: 2,
  },
  trendCard: {
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 0 ,  
    elevation: 2,
  },
  trendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trendTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2933',
  },
  trendSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  chartContainer: {
    height: 180,
  },
  chart: {
    flex: 1,
  },
  chartArea: {
    height: 120,
    width: 280,
    position: 'relative',
    marginBottom: 24,
    alignSelf: 'center',
  },
  chartGradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: 'rgba(249, 115, 22, 0.08)',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  line: {
    position: 'absolute',
    height: 2.5,
    backgroundColor: '#f97316',
    transformOrigin: 'left center',
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f97316',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  emptyChart: {
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyChartText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  actionList: {
    gap: 12,
    marginBottom: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0 , 
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  actionIconBlue: {
    backgroundColor: '#3b82f6',
  },
  actionIconOrange: {
    backgroundColor: '#f97316',
  },
  actionText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2933',
  },
  placeholder: {
    height: 100,
  },
});

export default ProfileScreen;
