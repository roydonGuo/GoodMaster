import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// @ts-ignore
import LinearGradient from 'react-native-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { Theme } from '../theme';
import { categories } from '../../data';
import { getIcon } from '../utils/iconHelper';

type Props = {
  theme: Theme;
  onBack: () => void;
};

function CategoryManagementScreen({ theme, onBack }: Props) {
  const insets = useSafeAreaInsets();

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
        {/* 头部 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#1f2933" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>类别管理</Text>
          <View style={styles.backButton} />
        </View>

        {/* 分类列表 */}
        <View style={styles.categoriesList}>
          {categories.map(category => {
            const IconComponent = getIcon(category.icon) as React.ComponentType<{
              size?: number;
              color?: string;
            }>;
            return (
              <View key={category.id} style={styles.categoryItem}>
                <View style={styles.categoryIconContainer}>
                  <IconComponent size={24} color="#4f46e5" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </View>
            );
          })}
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
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2933',
  },
  categoriesList: {
    gap: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,1)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 0 , 
    elevation: 2,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(79, 70, 229, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2933',
  },
  placeholder: {
    height: 100,
  },
});

export default CategoryManagementScreen;

