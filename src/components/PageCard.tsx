import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Theme } from '../theme';

type Props = {
  title: string;
  subtitle: string;
  theme: Theme;
  children: React.ReactNode;
};

function PageCard({ title, subtitle, theme, children }: Props) {
  return (
    <View style={[styles.pageCard, { backgroundColor: theme.card }]}>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
      <Text style={[styles.subtitle, { color: theme.muted }]}>{subtitle}</Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  pageCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
  },
});

export default PageCard;

