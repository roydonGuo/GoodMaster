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
import { launchImageLibrary } from 'react-native-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Theme } from '../theme';
import { categories } from '../../data';
import {
  insertItem,
  updateItem,
  generateId,
} from '../database/database';
import { Item, ItemStatus } from '../types/item';
import CategoryCard from '../components/CategoryCard';

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
          <Text style={[styles.title, { color: theme.text }]}>
            {editingItem ? '编辑' : '上传'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.muted }]}>
            {editingItem
              ? '修改物品信息'
              : '快速上传你的宝贝'}
          </Text>
        </View>

        {/* 图片上传与预览 */}
        <View style={styles.formGroup}>
          <Text style={[styles.label, { color: theme.text }]}>物品图片</Text>
          <TouchableOpacity
            style={[
              styles.uploadBox,
              { backgroundColor: theme.card, borderColor: theme.muted + '40' },
            ]}
            activeOpacity={0.8}
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
              <Image source={{ uri: imagePath }} style={styles.previewImage} />
            ) : (
              <Text style={[styles.uploadText, { color: theme.muted }]}>
                点击选择图片
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 表单区域 */}
        <View style={styles.form}>
          {/* 物品名称 */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>物品名称 *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.muted + '40',
                },
              ]}
              value={name}
              onChangeText={setName}
              placeholder="请输入物品名称"
              placeholderTextColor={theme.muted}
            />
          </View>

          {/* 分类选择 */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>分类 *</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}>
              {categories.map((category, index) => (
                <View key={category.id} style={styles.categoryWrapper}>
                  {index > 0 && <View style={styles.categoryGap} />}
                  <CategoryCard
                    category={category}
                    theme={theme}
                    isSelected={categoryId === category.id}
                    onPress={() => setCategoryId(category.id)}
                  />
                </View>
              ))}
            </ScrollView>
          </View>

          {/* 状态选择 */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>状态 *</Text>
            <View style={styles.statusContainer}>
              {statusOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.statusButton,
                    {
                      backgroundColor:
                        status === option ? theme.accent : theme.card,
                      borderColor: theme.muted + '40',
                    },
                  ]}
                  onPress={() => setStatus(option)}>
                  <Text
                    style={[
                      styles.statusText,
                      {
                        color: status === option ? '#ffffff' : theme.text,
                      },
                    ]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 价格 */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>价格 *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.muted + '40',
                },
              ]}
              value={price}
              onChangeText={setPrice}
              placeholder="请输入价格"
              placeholderTextColor={theme.muted}
              keyboardType="numeric"
            />
          </View>

          {/* 入手时间 */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>入手时间 *</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.muted + '40',
                },
              ]}
              value={purchaseDate}
              onChangeText={setPurchaseDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.muted}
            />
          </View>

          {/* 描述 */}
          <View style={styles.formGroup}>
            <Text style={[styles.label, { color: theme.text }]}>描述</Text>
            <TextInput
              style={[
                styles.textArea,
                {
                  backgroundColor: theme.card,
                  color: theme.text,
                  borderColor: theme.muted + '40',
                },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="请输入物品描述（可选）"
              placeholderTextColor={theme.muted}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* 提交按钮 */}
          <TouchableOpacity
            style={[styles.submitButton, { backgroundColor: theme.accent }]}
            onPress={handleSubmit}
            activeOpacity={0.8}>
            <Text style={styles.submitButtonText}>
              {editingItem ? '保存修改' : '添加物品'}
            </Text>
          </TouchableOpacity>
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
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  uploadBox: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 140,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  uploadText: {
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
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
  statusContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  submitButton: {
    marginTop: 8,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  placeholder:{
    height: 60,
  }
});

export default UploadScreen;
