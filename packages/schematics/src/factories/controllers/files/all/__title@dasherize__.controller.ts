<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: `controllers: title ${title ? 'is ' + title : 'is not defined'}` }) %>
<% } %>

<% if (options.strategies) { %>
  import { authenticate } from '@loopback/authentication';
  import { ACL } from '<%= options.org %>/authorization';
  import { authorize } from '@loopback/authorization';
  import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
  import { inject } from '@loopback/core';
<% } %>
import { QueryDatabaseParametersSchema } from '<%= options.org %>/types';
import { api, param, requestBody } from '@loopback/rest';
import {
    getTitleFromEntity
} from '@mountnotion/utils';
import {
    Filter,
    OrFilter,
    QueryFilter,
    DeleteBlockResponse,
    MountNotionQueryParameters
} from '@mountnotion/types';
import _ from 'lodash';
import { animals, colors, uniqueNamesGenerator } from 'unique-names-generator';
import { oasSchema } from './<%= dasherize(title) %>.schema';
import { 
  <%= classify(title) %>,
  <%= classify(title) %>Writeonly,
  <%= classify(title) %>Index,
  <%= underscore(title).toUpperCase() %>
} from '<%= options.entities %>';
import { 
  local<%= classify(title) %>,
} from '<%= options.locals %>';
import { mn } from './mn';

const TITLE = getTitleFromEntity(<%= underscore(title).toUpperCase() %>);

@api({
  basePath: '/',
  paths: {
    '/<%= dasherize(title) %>': {
      get: {
        summary: 'read by query',
        description: 'get <%= title %> by query',
        tags: ['<%= cache.icon %> <%= capitalize(title) %>'],
        operationId: '<%= classify(title) %>.getByQuery',
        'x-operation-name': 'getByQuery',
        'x-controller-name': '<%= capitalize(title) %>',
        parameters: [
          {
            in: 'query',
            name: 'where',
            description:
              '[notion database query body parameters](https://developers.notion.com/reference/post-database-query)',
            content: {
              'application/json': {
                schema: QueryDatabaseParametersSchema,
                examples: {
                  containsUser: {
                    summary: 'contains name',
                    value: {
                      filter: {
                        property: 'name',
                        title: {
                          contains: 'Percy Malantian',
                        },
                      },
                    },
                  },
                  noFilter: { summary: 'no filter' },
                },
              },
            },
          },
        ],
        responses: {
          200: {
            description: 'found <%= title %>',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: oasSchema,
                  example: local<%= classify(title) %>.list,
                },
              },
            },
          },
        },
        <% if (options.strategies) { %> security: [<% for (const strategy of options.strategies) { %> { <%= strategy %>: [] }, <% } %>], <% } %>
      },
      <% if (title !== options.usersDatabase) { %>
        post: {
          summary: 'create',
          description: 'create <%= title %>',
          tags: ['<%= cache.icon %> <%= capitalize(title) %>'],
          operationId: '<%= classify(title) %>.create',
          'x-operation-name': 'create',
          'x-controller-name': '<%= capitalize(title) %>',
          requestBody: {
            description: 'single <%= title %>',
            required: true,
            content: {
              'application/json': {
                schema: {
                  ...oasSchema,
                  example: _.omit(
                    local<%= classify(title) %>.example,
                    'id',
                    'created time',
                    'created by',
                    'last edited time',
                    'last edited by',
                    'cover',
                    'icon',
                  ),
                },
              },
            },
          },
          responses: {
            201: {
              description: 'created <%= title %>',
              content: {
                'application/json': {
                  schema: {
                    ...oasSchema,
                    example: local<%= classify(title) %>.example,
                  }
                },
              },
            },
          },
          <% if (options.strategies) { %> security: [<% for (const strategy of options.strategies) { %> { <%= strategy %>: [] }, <% } %>], <% } %>
        }, 
      <% } %>
    },
    '/<%= dasherize(title) %>/{id}': {
      get: {
        summary: 'read by id',
        description: 'get <%= title %> by id',
        tags: ['<%= cache.icon %> <%= capitalize(title) %>'],
        operationId: '<%= classify(title) %>.getById',
        'x-operation-name': 'getById',
        'x-controller-name': '<%= capitalize(title) %>',
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            },
            required: true
          },
        ],
        responses: {
          200: {
            description: 'found single <%= title %>',
            content: {
              'application/json': {
                schema: {
                  ...oasSchema,
                  example: local<%= classify(title) %>.example,
                }
              },
            },
          },
        },
        <% if (options.strategies) { %> security: [<% for (const strategy of options.strategies) { %> { <%= strategy %>: [] }, <% } %>], <% } %>
      },
      patch: {
        summary: 'update by id',
        description: 'update <%= title %> by id',
        tags: ['<%= cache.icon %> <%= capitalize(title) %>'],
        operationId: '<%= classify(title) %>.patchById',
        'x-operation-name': 'patchById',
        'x-controller-name': '<%= capitalize(title) %>',
        requestBody: {
          description: 'single <%= title %>',
          required: true,
          content: {
            'application/json': {
              schema: {
                ...oasSchema,
                example: _.omit(
                  local<%= classify(title) %>.example,
                  'id',
                  'created time',
                  'created by',
                  'last edited time',
                  'last edited by',
                  'cover',
                  'icon',
                ),
              },
            },
          },
        },
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            },
            required: true
          },
        ],
        responses: {
          200: {
            description: 'updated single <%= title %>',
            content: {
              'application/json': {
                schema: {
                  ...oasSchema,
                  example: local<%= classify(title) %>.example,
                }
              },
            },
          },
        },
        <% if (options.strategies) { %> security: [<% for (const strategy of options.strategies) { %> { <%= strategy %>: [] }, <% } %>], <% } %>
      },
      delete: {
        summary: 'delete by id',
        description: 'delete <%= title %> by id',
        tags: ['<%= cache.icon %> <%= capitalize(title) %>'],
        operationId: '<%= classify(title) %>.deleteById',
        'x-operation-name': 'deleteById',
        'x-controller-name': '<%= capitalize(title) %>',
        parameters: [
          {
            in: 'path',
            name: 'id',
            schema: {
              type: 'string',
              example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            },
            required: true
          },
        ],
        responses: {
          204: {
            description: 'deleted <%= title %>'
          },
        },
        <% if (options.strategies) { %> security: [<% for (const strategy of options.strategies) { %> { <%= strategy %>: [] }, <% } %>], <% } %>
      },
    },
  },
})
<% if (options.strategies) { %>
  @authenticate(<% for (const strategy of options.strategies) { %> '<%= strategy %>', <% } %>)
<% } %>
export class <%= classify(title) %>Controller {
  async getByQuery(
    @param.query.object('where')
    <% if (options.strategies) { %>
      @inject(SecurityBindings.USER, { optional: true })
      user: UserProfile, <% } %>
    where: MountNotionQueryParameters<<%= classify(title) %>Index>,
  ): Promise<<%= classify(title) %>[]> {
    <% if (isPublic || !options.strategies) { %>
      return mn.<%= camelize(title) %>.query(where);
    <% } else if (options.strategies && options.userColumn && options.accessorProperty) { %>
      const userFilter: OrFilter<<%= classify(title) %>Index> = {
        or: [
          {
            property: '<%= options.userColumn %>',
            relation: { contains: user[securityId] },
          },
          {
            property: '<%= options.accessorProperty %>',
            rollup: {
              any: {
                relation: { contains: user.<%= options.accessorProperty %> },
              },
            },
          },
        ],
      };

      const filter = where?.filter
        ? ({
          and: [where.filter as OrFilter<<%= classify(title) %>Index>, userFilter],
        } as QueryFilter<<%= classify(title) %>Index>)
      : (userFilter as QueryFilter<<%= classify(title) %>Index>);

      return mn.<%= camelize(title) %>.query({
        ...where,
        filter,
      });
    <% } else if (options.strategies && options.userColumn) { %>
      const userFilter: Filter<<%= classify(title) %>Index> = {
        property: '<%= options.userColumn %>',
        relation: { contains: user[securityId] },
      };
      const filter = where?.filter
        ? ({
          and: [where.filter as OrFilter<<%= classify(title) %>Index>, userFilter],
        } as QueryFilter<<%= classify(title) %>Index>)
      : (userFilter as QueryFilter<<%= classify(title) %>Index>);

      return mn.<%= camelize(title) %>.query({
        ...where,
        filter, 
      });
    <% } else { %> 
        return mn.<%= camelize(title) %>.query(where);
    <% } %>
  }

  <% if (options.strategies) { %>
    @authorize(ACL.readOne)
  <% } %>
  async getById(@param.path.string('id') id: string): Promise<<%= classify(title) %>> {
    return mn.<%= camelize(title) %>.retrieve({ id });
  }

  <% if (options.strategies) { %>
    @authorize(ACL.modifyOne)
  <% } %>
  async patchById(
    @requestBody()
    body: Partial<<%= classify(title) %>Writeonly>,
    @param.path.string('id')
    id: string
  ): Promise<<%= classify(title) %>> {
    return mn.<%= camelize(title) %>.update({
      id,
      ...body,
    });
  }

  <% if (title !== options.usersDatabase) { %>
    async create(
      @requestBody()
      body: Partial<<%= classify(title) %>Writeonly>,
      <% if (options.strategies) { %> @inject(SecurityBindings.USER, { optional: true })
        user: UserProfile, 
      <% } %>
    ): Promise<<%= classify(title) %>> {

      const title = uniqueNamesGenerator({
        dictionaries: [animals, colors],
        separator: '-',
        length: 2,
      });

      <% if (options.strategies) { %>
        return mn.<%= camelize(title) %>.create({
          [TITLE]: title,
          '<%= options.userColumn %>': [user[securityId]],
          ...body,
        });
      <% } else { %> 
        return mn.<%= camelize(title) %>.create({
          [TITLE]: title,
          ...body,
        });
      <% } %>
    }
  <% } %>
  

  <% if (options.strategies) { %>
    @authorize(ACL.modifyOne)
  <% } %>
  async deleteById(@param.path.string('id') id: string): Promise<DeleteBlockResponse> {
    return mn.<%= camelize(title) %>.delete({ id });
  }
}

<% if (options.debug) { %>
  <%= log.debug({ action: 'debugging', message: 'end' }) %>
<% } %>
