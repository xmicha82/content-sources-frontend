import { initStore, restoreStore } from '@redhat-cloud-services/insights-common-typescript';
import { Middleware } from 'redux';

export const createStore = (...middleware: Middleware[]) =>
    initStore({}, {}, ...middleware);

export const resetStore = () => restoreStore();
