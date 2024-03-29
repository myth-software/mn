import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { } from <>
%= classify(title) %>,
  <%= classify(title) %>Columns,
  <%= classify(title) %>Writeonly,
  <%= classify(title) %>QueryParameters,
} from '<%= options.schema %>';
<% if (options.strategies) { %>
  import { RootState } from '../store';
<% } %>

const {
  useDeleteByIdMutation,
  useGetByIdQuery,
  useGetQuery,
  useLazyGetByIdQuery,
  useLazyGetQuery,
  usePatchByIdMutation,
  usePostMutation,
  usePrefetch,
  util,
  endpoints,
  reducer,
  reducerPath,
  middleware,
} = createApi({
reducerPath: '<%= classify(title) %>',
  baseQuery: fetchBaseQuery({
    baseUrl: '<%= options.baseUrl %>/<%= dasherize(title) %>',
    <% if (options.strategies) { %>
      prepareHeaders: (headers, { getState }) => {
        const tokens = (getState() as RootState).tokens;
        if (tokens.accessToken) {
          headers.set('authorization', `Bearer ${tokens.accessToken}`);
        }
        return headers;
      }
    <% } %>
  }),
  endpoints: (build) => ({
    patchById: build.mutation<
      <%= classify(title) %>,
      {
        id: string;
        body: Partial<<%= classify(title) %>Writeonly>
      }
    >({
      query: (queryArg) => ({
        url: `/${queryArg.id}`,
        method: 'PATCH',
        body: queryArg.body,
      }),
      async onQueryStarted({ id, body }, { dispatch, queryFulfilled }) {
        const patchByIdResult = dispatch(
          <%= camelize(title) %>Api.util.updateQueryData('getById', { id }, draft => {
            if (draft) {
              Object.assign(draft, body);
            }
          })
        );

        const patchResult = dispatch(
          <%= camelize(title) %>Api.util.updateQueryData('get', undefined, drafts => {
            const index = drafts.findIndex(draft => draft.id === id);
            if (index) {
              drafts[index] = { ...drafts[index], ...body };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchByIdResult.undo();
          patchResult.undo();
        }
      },
      invalidatesTags: ['<%= classify(title) %>'],
    }),
    getById: build.query<
      <%= classify(title) %>,
      {
        id: string;
      }
    >({
      query: (queryArg) => ({ url: `/${queryArg.id}` }),
      providesTags: ['<%= classify(title) %>'],
    }),
    deleteById: build.mutation<
      unknown,
      {
        id: string;
      }
    >({
      query: (queryArg) => ({
        url: `/${queryArg.id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['<%= classify(title) %>'],
    }),
    post: build.mutation<
      <%= classify(title) %>,
      Partial<<%= classify(title) %>Writeonly>
    >({
      query: (body) => ({
        url: `/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['<%= classify(title) %>'],
    }),
    get: build.query<
      <%= classify(title) %>[],
      <%= classify(title) %>QueryParameters | void
    >({
      query: (queryArg) => {
        if (!queryArg) {
          return {
            url: `/`
          };
        }

        return {
          url: `/`,
          params: { where: JSON.stringify(queryArg) },
        };
      },
      providesTags: ['<%= classify(title) %>'],
    }),
  }),
  tagTypes: [
    '<%= classify(title) %>'
  ],
});

export const <%= camelize(title) %>Api = {
  useDeleteByIdMutation,
  useGetByIdQuery,
  useGetQuery,
  useLazyGetByIdQuery,
  useLazyGetQuery,
  usePatchByIdMutation,
  usePostMutation,
  usePrefetch,
  util,
  endpoints,
  reducer,
  reducerPath,
  middleware,
}