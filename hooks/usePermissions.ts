import { useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

export type PermissionType = 'camera' | 'mediaLibrary' | 'location';

export function usePermissions(types: PermissionType[]) {
  const [status, setStatus] = useState<Record<PermissionType, boolean>>({
    camera: false,
    mediaLibrary: false,
    location: false,
  });
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  useEffect(() => {
    (async () => {
      const newStatus: Record<PermissionType, boolean> = { ...status };
      if (types.includes('camera')) {
        const { granted } = cameraPermission || (await requestCameraPermission());
        newStatus.camera = !!granted;
      }
      if (types.includes('mediaLibrary')) {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        newStatus.mediaLibrary = status === 'granted';
      }
      if (types.includes('location')) {
        const { status } = await Location.requestForegroundPermissionsAsync();
        newStatus.location = status === 'granted';
      }
      setStatus(newStatus);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return status;
}
