<% if (strategy) { %>
  import { authenticate } from '@loopback/authentication';
  import { ACL } from '<%= org %>/authorization';
  import { authorize } from '@loopback/authorization';
  import { SecurityBindings, securityId, UserProfile } from '@loopback/security';
  import { inject } from '@loopback/core';
<% } %>
import { QueryDatabaseParametersSchema } from '<%= org %>/types';
import { api, param, requestBody } from '@loopback/rest';
import {
    configure
} from '@mountnotion/tools';
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
  <%= underscore(title).toUpperCase() %>,
  indicies 
} from '<%= entities %>';
const mountn = configure({
  integrationKey: process.env.INTEGRATION_KEY!,
  indicies
});

@api({
  basePath: '/',
  paths: {
    '/<%= dasherize(title) %>': {
      get: {
        description: 'get <%= title %> by query',
        tags: ['<%= classify(title) %>'],
        operationId: '<%= classify(title) %>.getByQuery',
        'x-operation-name': 'getByQuery',
        'x-controller-name': '<%= classify(title) %>',
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
                  example: [<%= underscore(title).toUpperCase() %>.mock],
                },
              },
            },
          },
        },
        <% if (strategy) { %> security: [{ <%= strategy %>: [] }], <% } %>
      },
      <% if (title !== usersDatabase) { %> post: {
        description: 'create <%= title %>',
        tags: ['<%= classify(title) %>'],
        operationId: '<%= classify(title) %>.create',
        'x-operation-name': 'create',
        'x-controller-name': '<%= classify(title) %>',
        requestBody: {
          description: 'single <%= title %>',
          required: true,
          content: {
            'application/json': {
              schema: {
                ...oasSchema,
                example: _.omit(
                  <%= underscore(title).toUpperCase() %>.mock,
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
                  example: <%= underscore(title).toUpperCase() %>.mock,
                }
              },
            },
          },
        },
        <% if (strategy) { %> security: [{ <%= strategy %>: [] }], <% } %>
      }, <% } %>
    },
    '/<%= dasherize(title) %>/{id}': {
      get: {
        description: 'get <%= title %> by id',
        tags: ['<%= classify(title) %>'],
        operationId: '<%= classify(title) %>.getById',
        'x-operation-name': 'getById',
        'x-controller-name': '<%= classify(title) %>',
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
                  example: <%= underscore(title).toUpperCase() %>.mock,
                }
              },
            },
          },
        },
        <% if (strategy) { %> security: [{ <%= strategy %>: [] }], <% } %>
      },
      patch: {
        description: 'update <%= title %> by id',
        tags: ['<%= classify(title) %>'],
        operationId: '<%= classify(title) %>.patchById',
        'x-operation-name': 'patchById',
        'x-controller-name': '<%= classify(title) %>',
        requestBody: {
          description: 'single <%= title %>',
          required: true,
          content: {
            'application/json': {
              schema: {
                ...oasSchema,
                example: _.omit(
                  <%= underscore(title).toUpperCase() %>.mock,
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
                  example: <%= underscore(title).toUpperCase() %>.mock,
                }
              },
            },
          },
        },
        <% if (strategy) { %> security: [{ <%= strategy %>: [] }], <% } %>
      },
      delete: {
        description: 'delete <%= title %> by id',
        tags: ['<%= classify(title) %>'],
        operationId: '<%= classify(title) %>.deleteById',
        'x-operation-name': 'deleteById',
        'x-controller-name': '<%= classify(title) %>',
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
        <% if (strategy) { %> security: [{ <%= strategy %>: [] }], <% } %>
      },
    },
  },
})
<% if (strategy) { %>
  @authenticate('<%= strategy %>')
<% } %>
export class <%= classify(title) %>Controller {
  async getByQuery(
    @param.query.object('where')
    <% if (strategy) { %>
      @inject(SecurityBindings.USER, { optional: true })
      user: UserProfile, <% } %>
    where: MountNotionQueryParameters<<%= classify(title) %>Index>,
  ): Promise<<%= classify(title) %>[]> {
    <% if (strategy && userColumn && accessorProperty) { %>
      const userFilter: OrFilter<<%= classify(title) %>Index> = {
        or: [
          {
            property: '<%= userColumn %>',
            relation: { contains: user[securityId] },
          },
          {
            property: '<%= accessorProperty %>',
            rollup: {
              any: {
                relation: { contains: user[securityId] },
              },
            },
          },
        ],
      };
    <% } else if (strategy && userColumn) { %>
      const userFilter: Filter<<%= classify(title) %>Index> = {
        property: '<%= userColumn %>',
        relation: { contains: user[securityId] },
      };
    <% } %>
    <% if (strategy) { %>
      const filter = where?.filter
        ? ({
          and: [where.filter as OrFilter<<%= classify(title) %>Index>, userFilter],
        } as QueryFilter<<%= classify(title) %>Index>)
      : (userFilter as QueryFilter<<%= classify(title) %>Index>);

      return mountn.<%= camelize(title) %>.query({
        ...where,
        filter, 
      });
    <% } else { %> 
    return mountn.<%= camelize(title) %>.query(where);
    <% } %>
  }

  <% if (strategy) { %>
    @authorize(ACL.readOne)
  <% } %>
  async getById(@param.path.string('id') id: string): Promise<<%= classify(title) %>> {
    return mountn.<%= camelize(title) %>.retrieve({ id });
  }

  <% if (strategy) { %>
    @authorize(ACL.modifyOne)
  <% } %>
  async patchById(
    @requestBody()
    body: Partial<<%= classify(title) %>Writeonly>,
    @param.path.string('id')
    id: string
  ): Promise<<%= classify(title) %>> {
    return mountn.<%= camelize(title) %>.update({
      id,
      ...body,
    });
  }

  <% if (title !== usersDatabase) { %>
    async create(
      @requestBody()
      body: Partial<<%= classify(title) %>Writeonly>,
      <% if (strategy) { %> @inject(SecurityBindings.USER, { optional: true })
        user: UserProfile, 
      <% } %>
    ): Promise<<%= classify(title) %>> {

      const name = uniqueNamesGenerator({
        dictionaries: [animals, colors],
        separator: '-',
        length: 2,
      });

      <% if (strategy) { %>
        return mountn.<%= camelize(title) %>.create({
          name,
          '<%= userColumn %>': [user[securityId]],
          ...body,
        });
      <% } else { %> 
        return mountn.<%= camelize(title) %>.create({
          name,
          ...body,
        });
      <% } %>
    }
  <% } %>
  

  <% if (strategy) { %>
    @authorize(ACL.modifyOne)
  <% } %>
  async deleteById(@param.path.string('id') id: string): Promise<DeleteBlockResponse> {
    return mountn.delete({ id });
  }
}
