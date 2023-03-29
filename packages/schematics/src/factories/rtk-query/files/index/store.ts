import { configureStore, ConfigureStoreOptions } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { 
 <% for (const title of titles) { %>
  <%= camelize(title) %>Api,
 <% } %>
} from './apis';

export const createStore = (
  options?: ConfigureStoreOptions['preloadedState'] | undefined,
) =>
  configureStore({
    reducer: {
      <% for (const title of titles) { %>
        [<%= camelize(title) %>Api.reducerPath]: <%= camelize(title) %>Api.reducer,
      <% } %>
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware()
      <% for (const title of titles) { %>
        .concat(<%= camelize(title) %>Api.middleware)
      <% } %>,
    ...options,
  });

export const store = createStore();

export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export type RootState = ReturnType<typeof store.getState>;
export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector;
