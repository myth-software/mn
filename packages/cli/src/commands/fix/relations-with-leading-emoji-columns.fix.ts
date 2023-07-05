import { Fix } from '@mountnotion/types';

export async function fixRelationsWithLeadingEmoji(fix: Fix) {
  return {
    action: 'warning',
    page: fix.page,
    message: `relation "user" cannot automatically be updated to "🙂 user". manual update in notion is required.`,
  };
}
