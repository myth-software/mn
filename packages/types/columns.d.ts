import {
  DateRequest,
  EmptyObject,
  IdRequest,
  PartialUserObjectResponse,
  RichTextItemRequest,
  SelectColor,
  StringRequest,
  TextRequest,
} from './api-endpoints';

export declare type AutomaticColumnTypes =
  | 'created_by'
  | 'created_time'
  | 'last_edited_by'
  | 'last_edited_time';

export declare type ReadonlyColumnTypes =
  | AutomaticColumnTypes
  | 'formula'
  | 'rollup';

export declare type ColumnTypes =
  | 'checkbox'
  | 'date'
  | 'email'
  | 'files'
  | 'multi_select'
  | 'number'
  | 'people'
  | 'phone_number'
  | 'relation'
  | 'rich_text'
  | 'select'
  | 'status'
  | 'title'
  | 'url'
  | ReadonlyColumnTypes;

export declare type AdditionalPropertyTypes = 'cover' | 'id' | 'icon';

/**
 * columns are the types of notion database properties for a schema
 */
export declare type Columns = Record<string, ColumnTypes>;

export declare type AdditionalProperties = Record<
  AdditionalPropertyTypes,
  string
>;

export declare type ExpandedColumns =
  | Record<
      string,
      | {
          title: Array<RichTextItemRequest>;
          type?: 'title';
        }
      | {
          rich_text: Array<RichTextItemRequest>;
          type?: 'rich_text';
        }
      | {
          number: number | null;
          type?: 'number';
        }
      | {
          url: TextRequest | null;
          type?: 'url';
        }
      | {
          select:
            | {
                id: StringRequest;
                name?: StringRequest;
                color?: SelectColor;
              }
            | null
            | {
                name: StringRequest;
                id?: StringRequest;
                color?: SelectColor;
              }
            | null;
          type?: 'select';
        }
      | {
          multi_select: Array<
            | {
                id: StringRequest;
                name?: StringRequest;
                color?: SelectColor;
              }
            | {
                name: StringRequest;
                id?: StringRequest;
                color?: SelectColor;
              }
          >;
          type?: 'multi_select';
        }
      | {
          people: Array<
            | {
                id: IdRequest;
              }
            | {
                person: {
                  email?: string;
                };
                id: IdRequest;
                type?: 'person';
                name?: string | null;
                avatar_url?: string | null;
                object?: 'user';
              }
            | {
                bot:
                  | EmptyObject
                  | {
                      owner:
                        | {
                            type: 'user';
                            user:
                              | {
                                  type: 'person';
                                  person: {
                                    email: string;
                                  };
                                  name: string | null;
                                  avatar_url: string | null;
                                  id: IdRequest;
                                  object: 'user';
                                }
                              | PartialUserObjectResponse;
                          }
                        | {
                            type: 'workspace';
                            workspace: true;
                          };
                    };
                id: IdRequest;
                type?: 'bot';
                name?: string | null;
                avatar_url?: string | null;
                object?: 'user';
              }
          >;
          type?: 'people';
        }
      | {
          email: StringRequest | null;
          type?: 'email';
        }
      | {
          phone_number: StringRequest | null;
          type?: 'phone_number';
        }
      | {
          date: DateRequest | null;
          type?: 'date';
        }
      | {
          checkbox: boolean;
          type?: 'checkbox';
        }
      | {
          relation: Array<{
            id: IdRequest;
          }>;
          type?: 'relation';
        }
      | {
          files: Array<
            | {
                file: {
                  url: string;
                  expiry_time?: string;
                };
                name: StringRequest;
                type?: 'file';
              }
            | {
                external: {
                  url: TextRequest;
                };
                name: StringRequest;
                type?: 'external';
              }
          >;
          type?: 'files';
        }
    >
  | Record<
      string,
      | Array<RichTextItemRequest>
      | Array<RichTextItemRequest>
      | number
      | null
      | TextRequest
      | null
      | {
          id: StringRequest;
          name?: StringRequest;
          color?: SelectColor;
        }
      | null
      | {
          name: StringRequest;
          id?: StringRequest;
          color?: SelectColor;
        }
      | null
      | Array<
          | {
              id: StringRequest;
              name?: StringRequest;
              color?: SelectColor;
            }
          | {
              name: StringRequest;
              id?: StringRequest;
              color?: SelectColor;
            }
        >
      | Array<
          | {
              id: IdRequest;
            }
          | {
              person: {
                email?: string;
              };
              id: IdRequest;
              type?: 'person';
              name?: string | null;
              avatar_url?: string | null;
              object?: 'user';
            }
          | {
              bot:
                | EmptyObject
                | {
                    owner:
                      | {
                          type: 'user';
                          user:
                            | {
                                type: 'person';
                                person: {
                                  email: string;
                                };
                                name: string | null;
                                avatar_url: string | null;
                                id: IdRequest;
                                object: 'user';
                              }
                            | PartialUserObjectResponse;
                        }
                      | {
                          type: 'workspace';
                          workspace: true;
                        };
                  };
              id: IdRequest;
              type?: 'bot';
              name?: string | null;
              avatar_url?: string | null;
              object?: 'user';
            }
        >
      | StringRequest
      | null
      | StringRequest
      | null
      | DateRequest
      | null
      | boolean
      | Array<{
          id: IdRequest;
        }>
      | Array<
          | {
              file: {
                url: string;
                expiry_time?: string;
              };
              name: StringRequest;
              type?: 'file';
            }
          | {
              external: {
                url: TextRequest;
              };
              name: StringRequest;
              type?: 'external';
            }
        >
    >;
