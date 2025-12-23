import * as LucideIcons from 'lucide-react-native';

// 图标名称映射表
const iconMap: Record<string, keyof typeof LucideIcons> = {
  smartphone: 'Smartphone',
  laptop: 'Laptop',
  headphones: 'Headphones',
  tablet: 'Tablet',
  watch: 'Watch',
  sofa: 'Sofa',
  table: 'Table',
  chair: 'RockingChair', // 使用 RockingChair 作为 chair 的替代
  lamp: 'Lamp',
  'toy-brick': 'ToyBrick',
  shirt: 'Shirt',
  footprints: 'Footprints',
  book: 'Book',
  'book-open': 'BookOpen',
  package: 'Package',
  camera: 'Camera',
  home: 'Home',
  user: 'User',
  'upload-cloud': 'UploadCloud',
  grid: 'Grid',
};

export const getIcon = (iconName: string) => {
  const iconKey = iconMap[iconName] || 'Package';
  return LucideIcons[iconKey] || LucideIcons.Package;
};

