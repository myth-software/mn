import { <%= classify(usersDatabase) %>, <%= classify(usersDatabase) %>Writeonly } from '<%= entities %>';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '<%= baseUrl %>/a',
    prepareHeaders: (headers, { getState }) => {
      const tokens = (getState() as RootState).tokens;
      if (tokens.accessToken) {
        headers.set('authorization', `Bearer ${tokens.accessToken}`);
      }
      return headers;
    }
  }),
  endpoints: build => ({
    <% if (strategy === 'notion') { %>
      postALogin: build.mutation<TokenObjectResponse, {
        email: string;
        password?: string;
      }>({
        query: body => ({
          url: `/login`,
          method: 'POST',
          body,
        }),
      }),
      getAMe: build.query<<%= classify(usersDatabase) %>, void>({
        query: () => ({ url: `/me` }),
        providesTags: ['<%= classify(usersDatabase) %>'],
      }),
      postASignup: build.mutation<{
        id: string;
      }, {
        name: string;
        email: string;
        password: string;
      }>({
        query: body => ({
          url: `/signup`,
          method: 'POST',
          body,
        }),
      }),
    <% } else if (strategy === 'sms') { %>
      postASmsLoginInitialization: build.mutation<
        void,
        {
          phone: string;
        }
      >({
        query: body => ({
          url: `/sms/login-initalization`,
          method: 'POST',
          body,
        }),
      }),
      getASmsProfile: build.query<<%= classify(usersDatabase) %>, void>({
        query: () => ({ url: `/sms/profile` }),
        providesTags: ['<%= classify(usersDatabase) %>'],
      }),
      postASmsLogin: build.mutation<
        TokenObjectResponse,
        {
          phone: string;
          code: string;
        }
      >({
        query: body => ({
          url: `/sms/login`,
          method: 'POST',
          body,
        }),
      }),
      postASmsRefresh: build.mutation<
        TokenObjectResponse,
        {
          refreshToken: string;
        }
      >({
        query: body => ({
          url: `/sms/login`,
          method: 'POST',
          body,
        }),
      }),
      getASmsLogout: build.query<void, void>({
        query: () => ({ url: `/sms/logout` }),
      }),
      patchASmsUpdateAccount: build.mutation<
        <%= classify(usersDatabase) %>,
        Partial<<%= classify(usersDatabase) %>Writeonly>
      >({
        query: body => ({
          url: `/sms/update-account`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['<%= classify(usersDatabase) %>'],
      }),
    <% } %>
  }),
  tagTypes: [
    '<%= classify(usersDatabase) %>'
  ],
});

export type TokenObjectResponse = {
  accessToken: string;
  exp: number;
  refreshToken: string;
};

export const {
  <% if (strategy === 'notion') { %>
    usePostALoginMutation,
    useGetAMeQuery,
    usePostASignupMutation,
  <% } else if (strategy === 'sms') { %>
    usePostASmsLoginInitializationMutation,
    usePostASmsLoginMutation,
    useGetASmsProfileQuery,
    useGetASmsLogoutQuery,
    usePatchASmsUpdateAccountMutation,
    usePostASmsRefreshMutation,
  <% } %>
} = authApi;
