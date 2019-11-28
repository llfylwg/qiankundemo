/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { Freer } from '../interfaces';
export declare function hijackAtMounting(appName: string, proxy: Window): Freer[];
export declare function hijackAtBootstrapping(appName: string, publicPath: string, proxy: Window): Freer[];
