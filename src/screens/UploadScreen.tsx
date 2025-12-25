import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
// @ts-ignore
import LinearGradient from 'react-native-linear-gradient';
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera } from 'lucide-react-native';
import { Theme } from '../theme';
import { categories } from '../../data';
import {
  insertItem,
  updateItem,
  generateId,
} from '../database/database';
import { Item, ItemStatus } from '../types/item';
import { getIcon } from '../utils/iconHelper';

type Props = {
  theme: Theme;
  onItemAdded?: () => void;
  editingItem?: Item | null;
};

function UploadScreen({ theme, onItemAdded, editingItem }: Props) {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(editingItem?.name || '');
  const [categoryId, setCategoryId] = useState<string>(
    editingItem?.categoryId || '',
  );
  const [status, setStatus] = useState<ItemStatus>(
    editingItem?.status || '服役中',
  );
  const [price, setPrice] = useState(
    editingItem?.price.toString() || '',
  );
  const [imagePath, setImagePath] = useState(editingItem?.imagePath || '');
  const [description, setDescription] = useState(
    editingItem?.description || '',
  );
  const [purchaseDate, setPurchaseDate] = useState(
    editingItem?.purchaseDate || new Date().toISOString().split('T')[0],
  );

  // 当 editingItem 变化时更新表单
  React.useEffect(() => {
    if (editingItem) {
      setName(editingItem.name);
      setCategoryId(editingItem.categoryId);
      setStatus(editingItem.status);
      setPrice(editingItem.price.toString());
      setImagePath(editingItem.imagePath || '');
      setDescription(editingItem.description || '');
      setPurchaseDate(editingItem.purchaseDate);
    } else {
      // 重置表单
      setName('');
      setCategoryId('');
      setStatus('服役中');
      setPrice('');
      setImagePath('');
      setDescription('');
      setPurchaseDate(new Date().toISOString().split('T')[0]);
    }
  }, [editingItem]);

  const statusOptions: ItemStatus[] = ['服役中', '已出售', '已退役'];

  const handleSubmit = async () => {
    if (!name.trim()) {
      Alert.alert('提示', '请输入物品名称');
      return;
    }
    if (!categoryId) {
      Alert.alert('提示', '请选择分类');
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      Alert.alert('提示', '请输入有效的价格');
      return;
    }

    try {
      const selectedCategory = categories.find(c => c.id === categoryId);
      const item: Item = {
        id: editingItem?.id || generateId(),
        name: name.trim(),
        categoryId,
        status,
        price: Number(price),
        icon: selectedCategory?.icon || editingItem?.icon || 'package',
        imagePath: imagePath || undefined,
        description: description.trim() || undefined,
        purchaseDate,
      };

      if (editingItem) {
        await updateItem(item);
        Alert.alert('成功', '物品修改成功！', [
          {
            text: '确定',
            onPress: () => {
              onItemAdded?.();
            },
          },
        ]);
      } else {
        await insertItem(item);
        Alert.alert('成功', '物品添加成功！', [
          {
            text: '确定',
            onPress: () => {
              // 重置表单
              setName('');
              setCategoryId('');
              setStatus('服役中');
              setPrice('');
              setImagePath('');
              setDescription('');
              setPurchaseDate(new Date().toISOString().split('T')[0]);
              onItemAdded?.();
            },
          },
        ]);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      Alert.alert(
        '错误',
        editingItem ? '修改物品失败，请重试' : '添加物品失败，请重试',
      );
    }
  };

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
        {/* 顶部标题区域 */}
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.headerLabel, { color: theme.muted }]}>
              {editingItem ? '编辑资产' : '添加新资产'}
            </Text>
            <Text style={[styles.headerTitle, { color: '#1f2933' }]}>
              {editingItem ? '更新物品信息' : '上传图片并填写信息'}
            </Text>
          </View>
        </View>

        {/* 图片上传与预览 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#4b5563' }]}>物品图片</Text>
          <TouchableOpacity
            style={styles.uploadBox}
            activeOpacity={0.9}
            onPress={async () => {
              const res = await launchImageLibrary({
                mediaType: 'photo',
                quality: 0.9,
              });
              if (res.didCancel) return;
              const uri = res.assets?.[0]?.uri;
              if (uri) {
                setImagePath(uri);
              }
            }}>
            {imagePath ? (
              <View style={styles.previewWrapper}>
                <Image source={{ uri: imagePath }} style={styles.previewImage} />
              </View>
            ) : (
              <View style={styles.uploadPlaceholder}>
                <View style={styles.uploadIconContainer}>
                  <Camera size={32} color="#9ca3af" />
                </View>
                <Text style={[styles.uploadText, { color: '#6b7280' }]}>
                  点击拍照或上传图片
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* 物品名称 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#4b5563' }]}>物品名称 *</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="请输入物品名称"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* 分类选择 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#4b5563' }]}>分类 *</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesPillsContent}>
            {categories.map(category => {
              const active = categoryId === category.id;
              const IconComponent = getIcon(category.icon) as React.ComponentType<{
                size?: number;
                color?: string;
              }>;
              return (
                <View key={category.id} style={styles.chipWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => setCategoryId(active ? '' : category.id)}>
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

        {/* 状态选择 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#4b5563' }]}>状态 *</Text>
          <View style={styles.statusContainer}>
            {statusOptions.map(option => {
              const active = status === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusChip,
                    styles.chipSecondary,
                    active && styles.chipSecondaryActive,
                  ]}
                  onPress={() => setStatus(option)}
                  activeOpacity={0.7}>
                  <Text
                    style={[
                      styles.chipText,
                      active && styles.chipTextSecondaryActive,
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 价格和入手时间 */}
        <View style={styles.rowContainer}>
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={[styles.label, { color: '#4b5563' }]}>价格 *</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="请输入价格"
              placeholderTextColor="#9ca3af"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.gap} />
          <View style={[styles.formGroup, styles.flex1]}>
            <Text style={[styles.label, { color: '#4b5563' }]}>货币</Text>
            <TextInput
              style={styles.input}
              value="CNY"
              editable={false}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>

        {/* 入手时间 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#4b5563' }]}>入手时间 *</Text>
          <TextInput
            style={styles.input}
            value={purchaseDate}
            onChangeText={setPurchaseDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* 描述 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: '#4b5563' }]}>描述</Text>
          <TextInput
            style={styles.textArea}
            value={description}
            onChangeText={setDescription}
            placeholder="请输入物品描述（可选）"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
          />
        </View>

        {/* 提交按钮 */}
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>
            {editingItem ? '保存修改' : '添加物品'}
          </Text>
        </TouchableOpacity>

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
    marginBottom: 16,
  },
  headerLabel: {
    fontSize: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(148,163,184,0.4)',
    color: '#111827',
  },
  uploadBox: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    minHeight: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(148,163,184,0.5)',
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  previewWrapper: {
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 240,
    resizeMode: 'cover',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  uploadIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(237,233,254,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '500',
  },
  rowContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  flex1: {
    flex: 1,
  },
  gap: {
    width: 12,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderColor: 'rgba(148,163,184,0.4)',
    color: '#111827',
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
  chipTextSecondaryActive: {
    color: '#f9fafb',
  },
  chipInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  statusChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  submitButton: {
    marginTop: 8,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: '#111827',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder: {
    height: 100,
  },
});

export default UploadScreen;
