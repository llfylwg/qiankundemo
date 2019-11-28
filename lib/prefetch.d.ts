/**
 * @author Kuitos
 * @since 2019-02-26
 */
import { Entry } from 'import-html-entry';
import { Fetch, RegistrableApp } from './interfaces';
declare type RequestIdleCallbackHandle = any;
declare type RequestIdleCallbackOptions = {
    timeout: number;
};
declare type RequestIdleCallbackDeadline = {
    readonly didTimeout: boolean;
    timeRemaining: () => number;
};
declare global {
    interface Window {
        requestIdleCallback: (callback: (deadline: RequestIdleCallbackDeadline) => void, opts?: RequestIdleCallbackOptions) => RequestIdleCallbackHandle;
        cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
    }
}
/**
 * 预加载静态资源，不兼容 requestIdleCallback 的浏览器不做任何动作
 * @param entry
 * @param fetch
 */
export declare function prefetch(entry: Entry, fetch?: Fetch): void;
export declare function prefetchAfterFirstMounted(apps: RegistrableApp[], fetch?: Fetch): void;
export declare function prefetchAll(apps: RegistrableApp[], fetch?: Fetch): void;
export {};
