import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './store';
const slice = createSlice({
  name: 'tokens',
  initialState: { accessToken: '', refreshToken: '', exp: 0 },
  reducers: {
    setTokens: (
      state,
      {
        payload: { tokens },
      }: PayloadAction<{
        tokens: { accessToken: string; exp: number; refreshToken: string };
      }>,
    ) => {
      state.accessToken = tokens.accessToken;
      state.refreshToken = tokens.refreshToken;
      state.exp = tokens.exp;
    },
  },
});
export const { setTokens } = slice.actions;
export default slice.reducer;
export const selectTokens = (state: RootState) => state.tokens;
