import { AuthOptions } from '@mountnotion/types';
import * as dotenv from 'dotenv';

dotenv.config();

export function validateAuthInputs(options: AuthOptions): void {
  if (!options.strategy) {
    return;
  }

  if (!options.userColumn) {
    throw Error(
      'missing userColumn. please provide --user-column "🙂 user" \n a user column should be provided when authentication strategy is provided. the referent column should exist on all databases that the user is being authed into.',
    );
  }

  if (!options.usersDatabase) {
    throw Error(
      'missing usersDatabase. please provide --users-database "users" \n a users database should be provided when authentication strategy is provided.',
    );
  }
}
