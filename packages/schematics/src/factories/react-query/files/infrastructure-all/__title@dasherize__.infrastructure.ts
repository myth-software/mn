import axios from 'axios';
import { InfrastructureOptions } from './infrastructure-options.interface';
import { } from <>;
%= classify(title) %> } from '<%= options.schema %>';

export const <%= camelize(title) %>Request = {
  getById: async ({ id }: InfrastructureOptions<<%= classify(title) %>>) => {
    const response = await axios<<%= classify(title) %>>({
      method: 'get',
      url: `https://api.myth.software/<%= dasherize(title) %>/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
  getByQuery: async ({ query }: InfrastructureOptions<<%= classify(title) %>>) => {
    const response = await axios<<%= classify(title) %>[]>({
      method: 'get',
      url:
        `https://api.myth.software/<%= dasherize(title) %>?` +
        new URLSearchParams({
          where: JSON.stringify(query),
        }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
  updateById: async ({ id, data }: InfrastructureOptions<<%= classify(title) %>>) => {
    const response = await axios<<%= classify(title) %>>({
      method: 'patch',
      url: `https://api.myth.software/<%= dasherize(title) %>/${id}`,
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
  create: async ({ data }: InfrastructureOptions<<%= classify(title) %>>) => {
    const response = await axios<<%= classify(title) %>>({
      method: 'post',
      url: 'https://api.myth.software/<%= dasherize(title) %>/',
      data,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
  deleteById: async ({ id }: InfrastructureOptions<<%= classify(title) %>>) => {
    const response = await axios<<%= classify(title) %>>({
      method: 'delete',
      url: `https://api.myth.software/<%= dasherize(title) %>/${id}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  },
};
