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
import { Home, UploadCloud, User } from 'lucide-react-native';
import ItemsScreen from './src/screens/ItemsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import UploadScreen from './src/screens/UploadScreen';
import { createTheme, Theme } from './src/theme';
import { initDatabase } from './src/database/database';
import { Item } from './src/types/item';

type TabKey = 'items' | 'upload' | 'profile';

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

  const renderContent = () => {
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
        return <ProfileScreen theme={theme} />;
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
            paddingBottom: Math.max(insets.bottom, 6),
            backgroundColor: 'rgba(255,255,255,0.9)',
          },
        ]}>
        <TabButton
          label="宝贝"
          icon={
            <Home
              color={activeTab === 'items' ? theme.accent : theme.muted}
              size={20}
            />
          }
          active={activeTab === 'items'}
          onPress={() => setActiveTab('items')}
          theme={theme}
        />
        <TabButton
          label=""
          icon={
            <UploadCloud
              color={activeTab === 'upload' ? theme.accent : theme.muted}
              size={22}
            />
          }
          active={activeTab === 'upload'}
          onPress={() => setActiveTab('upload')}
          theme={theme}
          onlyIcon
        />
        <TabButton
          label="我的"
          icon={
            <User
              color={activeTab === 'profile' ? theme.accent : theme.muted}
              size={20}
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
    left: 16,
    right: 16,
    bottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 24,
    borderWidth: 0.5,
    borderColor: 'rgba(240, 240, 240, 0.2)',
    paddingTop: 6, 
    elevation: 1,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  tabIcon: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
});

export default App;
