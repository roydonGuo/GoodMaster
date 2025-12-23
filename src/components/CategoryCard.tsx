import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ItemCategory } from '../types/item';
import { Theme } from '../theme';
import { getIcon } from '../utils/iconHelper';

type Props = {
  category: ItemCategory;
  theme: Theme;
  isSelected: boolean;
  onPress: () => void;
};

function CategoryCard({ category, theme, isSelected, onPress }: Props) {
  const IconComponent = getIcon(category.icon);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: isSelected ? theme.accent : theme.card,
          borderColor: isSelected ? theme.accent : theme.muted + '40',
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : theme.bg },
        ]}>
        <IconComponent
          size={24}
          color={isSelected ? '#ffffff' : theme.accent}
        />
      </View>
      <Text
        style={[
          styles.name,
          { color: isSelected ? '#ffffff' : theme.text },
        ]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
    borderWidth: 1,
    gap: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default CategoryCard;

