import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  downloadFile(
    url: string, 
    filename: string, 
    extension: string,
  ): Promise<boolean>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDownloader');
