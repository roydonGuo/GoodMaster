import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../theme';

type Props = {
  theme: Theme;
};

function ProfileScreen({ theme }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 12 },
        ]}
        showsVerticalScrollIndicator={false}>
        {/* 标题区域 */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.text }]}>我的</Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            管理个人信息与订单
          </Text>
        </View>

        {/* 内容区域 */}
        <View style={styles.content}>
          <View
            style={[
              styles.placeholderBox,
              {
                borderColor: theme.muted + '40',
                backgroundColor: theme.card,
              },
            ]}>
            <Text style={[styles.placeholderText, { color: theme.muted }]}>
              个人资料、订单、设置入口
            </Text>
          </View>
        </View>
        {/* 占位 */}
        <View style={styles.placeholder} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 20,
    gap: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
  content: {
    gap: 16,
  },
  placeholderBox: {
    minHeight: 200,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  placeholderText: {
    fontSize: 14,
    textAlign: 'center',
  },
  placeholder:{
    height: 60,
  }
});

export default ProfileScreen;
