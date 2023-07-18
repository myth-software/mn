import { <%= classify(options.usersDatabase) %>, <%= classify(options.usersDatabase) %>Writeonly } from '<%= options.entities %>';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';

export const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: '<%= options.baseUrl %>/a',
    prepareHeaders: (headers, { getState }) => {
      const tokens = (getState() as RootState).tokens;
      if (tokens.accessToken) {
        headers.set('authorization', `Bearer ${tokens.accessToken}`);
      }
      return headers;
    }
  }),
  endpoints: build => ({
    <% if (options.strategies.includes('email')) { %>
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
      getAMe: build.query<<%= classify(options.usersDatabase) %>, void>({
        query: () => ({ url: `/me` }),
        providesTags: ['<%= classify(options.usersDatabase) %>'],
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
    <% } %>
    <% if (options.strategies.includes('sms')) { %>
      postASmsLoginInitialization: build.mutation<
        void,
        {
          phone: string;
        }
      >({
        query: body => ({
          url: `/sms/login-initialization`,
          method: 'POST',
          body,
        }),
      }),
      getASmsProfile: build.query<<%= classify(options.usersDatabase) %>, void>({
        query: () => ({ url: `/sms/profile` }),
        providesTags: ['<%= classify(options.usersDatabase) %>'],
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
        <%= classify(options.usersDatabase) %>,
        Partial<<%= classify(options.usersDatabase) %>Writeonly>
      >({
        query: body => ({
          url: `/sms/update-account`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['<%= classify(options.usersDatabase) %>'],
      }),
    <% } %>
  }),
  tagTypes: [
    '<%= classify(options.usersDatabase) %>'
  ],
});

export type TokenObjectResponse = {
  accessToken: string;
  exp: number;
  refreshToken: string;
};

export const {
  <% if (options.strategies.includes('email')) { %>
    usePostALoginMutation,
    useGetAMeQuery,
    usePostASignupMutation,
  <% } %> 
  <% if (options.strategies.includes('sms')) { %>
    usePostASmsLoginInitializationMutation,
    usePostASmsLoginMutation,
    useGetASmsProfileQuery,
    useGetASmsLogoutQuery,
    usePatchASmsUpdateAccountMutation,
    usePostASmsRefreshMutation,
  <% } %>
} = authApi;
