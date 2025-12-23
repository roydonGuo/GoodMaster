declare module 'react-native-image-picker' {
  export type Asset = {
    uri?: string;
    fileName?: string;
    type?: string;
    fileSize?: number;
    width?: number;
    height?: number;
  };

  export type ImageLibraryOptions = {
    mediaType?: 'photo' | 'video' | 'mixed';
    quality?: number;
    selectionLimit?: number;
  };

  export type ImagePickerResponse = {
    assets?: Asset[];
    didCancel?: boolean;
    errorCode?: string;
    errorMessage?: string;
  };

  export function launchImageLibrary(
    options: ImageLibraryOptions,
  ): Promise<ImagePickerResponse>;
}

