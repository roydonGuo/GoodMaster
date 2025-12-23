declare module 'react-native-vector-icons/Feather' {
  import * as React from 'react';
  import { TextProps } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
  }

  const Feather: React.ComponentType<IconProps>;
  export default Feather;
}

