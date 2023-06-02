import {
  Entity,
  ExpandColumnsConfiguration,
  ExpandedColumns,
  InferWriteonly,
} from '@mountnotion/types';
import { expandDate } from './date.expander';
import { expandFiles } from './files.expander';
import { expandRelation } from './relation.expander';
import { expandRichText } from './rich-text.expander';
import { expandSelect } from './select.expander';
import { expandStatus } from './status.expander';
import { expandTitle } from './title.expander';

export function expandProperties<T extends Partial<InferWriteonly<Entity>>>(
  instance: T,
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
      const value = instance[key];
      if (value === undefined) {
        return acc;
      }

      switch (type) {
        case 'title':
          return {
            [key]: expandTitle(value),
            ...acc,
          };
        case 'number':
          return {
            [key]: {
              number: value,
            },
            ...acc,
          };
        case 'rich_text':
          return {
            [key]: expandRichText(value),
            ...acc,
          };
        case 'files':
          return {
            [key]: expandFiles(value),
            ...acc,
          };
        case 'email': {
          return {
            [key]: {
              email: value,
            },
            ...acc,
          };
        }
        case 'url': {
          return {
            [key]: {
              url: value,
            },
            ...acc,
          };
        }
        case 'checkbox': {
          return {
            [key]: {
              checkbox: value,
            },
            ...acc,
          };
        }
        case 'phone_number': {
          return {
            [key]: {
              phone_number: value,
            },
            ...acc,
          };
        }
        case 'relation': {
          return {
            [key]: expandRelation(value),
            ...acc,
          };
        }
        case 'date': {
          return {
            [key]: expandDate(value),
            ...acc,
          };
        }
        case 'status': {
          return {
            [key]: expandStatus(value),
            ...acc,
          };
        }
        case 'select': {
          return {
            [key]: expandSelect(value),
            ...acc,
          };
        }
        default: {
          return acc;
        }
      }
    }, {} as T);
  return notionColumns as unknown as ExpandedColumns;
}
