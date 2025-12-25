/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, Plus, User } from 'lucide-react-native';
import ItemsScreen from './src/screens/ItemsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UploadScreen from './src/screens/UploadScreen';
import CategoryManagementScreen from './src/screens/CategoryManagementScreen';
import { createTheme, Theme } from './src/theme';
import { initDatabase } from './src/database/database';
import { Item } from './src/types/item';

type TabKey = 'items' | 'upload' | 'profile';
type Screen = TabKey | 'categoryManagement';

function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [dbInitialized, setDbInitialized] = useState(false);

  useEffect(() => {
    const initializeDB = async () => {
      try {
        await initDatabase();
        setDbInitialized(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };
    initializeDB();
  }, []);

  if (!dbInitialized) {
    return (
      <GestureHandlerRootView style={styles.gestureRoot}>
        <SafeAreaProvider>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
          <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#0b0b0f' : '#f6f7fb' }]}>
            <View style={styles.loadingContainer}>
              <Text style={{ color: isDarkMode ? '#f4f4f5' : '#111827' }}>
                初始化中...
              </Text>
            </View>
          </SafeAreaView>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
      <SafeAreaProvider>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <View style={styles.container}>
          <AppContent isDarkMode={isDarkMode} />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function AppContent({ isDarkMode }: { isDarkMode: boolean }) {
  const [activeTab, setActiveTab] = useState<TabKey>('items');
  const [currentScreen, setCurrentScreen] = useState<Screen>('items');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const insets = useSafeAreaInsets();
  const theme = useMemo(() => createTheme(isDarkMode), [isDarkMode]);

  const handleItemAdded = () => {
    setRefreshTrigger(prev => prev + 1);
    setActiveTab('items');
    setEditingItem(null);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setActiveTab('upload');
  };

  const handleNavigateToCategoryManagement = () => {
    setCurrentScreen('categoryManagement');
  };

  const handleBackFromCategoryManagement = () => {
    setCurrentScreen('profile');
    setActiveTab('profile');
  };

  const renderContent = () => {
    if (currentScreen === 'categoryManagement') {
      return (
        <CategoryManagementScreen
          theme={theme}
          onBack={handleBackFromCategoryManagement}
        />
      );
    }

    switch (activeTab) {
      case 'items':
        return (
          <ItemsScreen
            theme={theme}
            refreshTrigger={refreshTrigger}
            onEditItem={handleEditItem}
          />
        );
      case 'upload':
        return (
          <UploadScreen
            theme={theme}
            onItemAdded={handleItemAdded}
            editingItem={editingItem}
          />
        );
      case 'profile':
        return (
          <ProfileScreen
            theme={theme}
            refreshTrigger={refreshTrigger}
            onNavigateToCategoryManagement={handleNavigateToCategoryManagement}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderContent()}</View>
      <View
        style={[
          styles.tabBar,
          {
            paddingBottom: Math.max(insets.bottom, 4),
            paddingTop: 2,
          },
        ]}>
        <TabButton
          label="宝贝"
          icon={
            <Home
              color={activeTab === 'items' ? theme.accent : theme.muted}
              size={22}
            />
          }
          active={activeTab === 'items'}
          onPress={() => setActiveTab('items')}
          theme={theme}
        />
        <View style={styles.fabContainer}>
          <FABButton
            active={activeTab === 'upload'}
            onPress={() => setActiveTab('upload')}
            theme={theme}
          />
        </View>
        <TabButton
          label="我的"
          icon={
            <User
              color={activeTab === 'profile' ? theme.accent : theme.muted}
              size={22}
            />
          }
          active={activeTab === 'profile'}
          onPress={() => setActiveTab('profile')}
          theme={theme}
        />
      </View>
    </View>
  );
}

function TabButton({
  label,
  icon,
  active,
  onPress,
  theme,
  onlyIcon = false,
}: {
  label: string;
  icon: React.ReactNode;
  active: boolean;
  onPress: () => void;
  theme: Theme;
  onlyIcon?: boolean;
}) {
  return (
    <TouchableOpacity
      style={styles.tabButton}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.tabIcon}>{icon}</View>
      {!onlyIcon && (
        <Text
          style={[
            styles.tabLabel,
            { color: active ? theme.accent : theme.muted },
          ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

function FABButton({
  active,
  onPress,
  theme,
}: {
  active: boolean;
  onPress: () => void;
  theme: Theme;
}) {
  return (
    <TouchableOpacity
      style={[styles.fabButton, { backgroundColor: theme.accent }]}
      activeOpacity={0.8}
      onPress={onPress}>
      <View style={styles.fabIconContainer}>
        <Plus size={24} color="#ffffff" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1, 
  },
  tabBar: {
    position: 'absolute', 
    left: 66,
    right: 66,
    bottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 20,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // 高透明度白色背景，模拟毛玻璃效果
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 10, 
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 4,
  },
  tabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  fabContainer: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24, // 向上突出，浮在导航栏上方
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  fabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
