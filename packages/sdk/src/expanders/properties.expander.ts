import {
  ExpandColumnsConfiguration,
  ExpandedColumns,
  InferWriteonly,
  Schema,
} from '@mountnotion/types';
import { expandDate } from './date.expander';
import { expandFiles } from './files.expander';
import { expandRelation } from './relation.expander';
import { expandRichText } from './rich-text.expander';
import { expandSelect } from './select.expander';
import { expandStatus } from './status.expander';
import { expandTitle } from './title.expander';

export function expandProperties<
  TInstance extends Partial<InferWriteonly<Schema>>
>(
  instance: TInstance,
  { mappings, columns }: ExpandColumnsConfiguration
): ExpandedColumns {
  if (instance === undefined) {
    throw new Error('must have instance');
  }

  const notionColumns = Object.keys(instance)
    .map((key) => ({
      key,
      type: columns[mappings[key]],
    }))
    .reduce((acc, { key, type }: { key: string; type: string }) => {
      const column = mappings[key];
      const value = instance[key];
      if (value === undefined) {
        return acc;
      }

      switch (type) {
        case 'title':
          return {
            [column]: expandTitle(value),
            ...acc,
          };
        case 'number':
          return {
            [column]: {
              number: value,
            },
            ...acc,
          };
        case 'rich_text':
          return {
            [column]: expandRichText(value),
            ...acc,
          };
        case 'files':
          return {
            [column]: expandFiles(value),
            ...acc,
          };
        case 'email': {
          return {
            [column]: {
              email: value,
            },
            ...acc,
          };
        }
        case 'url': {
          return {
            [column]: {
              url: value,
            },
            ...acc,
          };
        }
        case 'checkbox': {
          return {
            [column]: {
              checkbox: value,
            },
            ...acc,
          };
        }
        case 'phone_number': {
          return {
            [column]: {
              phone_number: value,
            },
            ...acc,
          };
        }
        case 'relation': {
          return {
            [column]: expandRelation(value),
            ...acc,
          };
        }
        case 'date': {
          return {
            [column]: expandDate(value),
            ...acc,
          };
        }
        case 'status': {
          return {
            [column]: expandStatus(value),
            ...acc,
          };
        }
        case 'select': {
          return {
            [column]: expandSelect(value),
            ...acc,
          };
        }
        default: {
          return acc;
        }
      }
    }, {} as TInstance);
  return notionColumns as unknown as ExpandedColumns;
}
