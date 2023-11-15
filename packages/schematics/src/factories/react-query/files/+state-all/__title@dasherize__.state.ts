import { useMutation, UseMutationOptions, useQuery, useQueryClient, UseQueryOptions } from 'react-query';
import { } from <>;
import { } from <>;
import { <%= camelize(title) %>Request, InfrastructureOptions } from '../infrastructure';
import { <%= classify(title) %> } from '<%= options.caches %>';

export const use<%= classify(title) %>GetById = ({ id }: InfrastructureOptions<<%= classify(title) %>>, options?: UseQueryOptions<<%= classify(title) %>, unknown, <%= classify(title) %>, string[]>) => {
  const results = useQuery(
    ['<%= options.icon %> <%= title %>', id],
    () => <%= camelize(title) %>Request.getById({ id }),
    { ...options }
  );

  return {
    ...results,
    <%= camelize(title) %>Single: results.data,
  };
};

export const use<%= classify(title) %>GetByQuery = ({ query }: InfrastructureOptions<<%= classify(title) %>>, options?: UseQueryOptions<<%= classify(title) %>[], unknown, <%= classify(title) %>[], '<%= options.icon %> <%= title %>'>) => {
  const results = useQuery(
    '<%= options.icon %> <%= title %>',
    () => <%= camelize(title) %>Request.getByQuery({ query }),
    { ...options }
  );

  return {
    ...results,
    <%= camelize(title) %>: results.data,
  };
};

export const use<%= classify(title) %>UpdateById = (
  options?: UseMutationOptions<
    <%= classify(title) %>,
    unknown,
    InfrastructureOptions<<%= classify(title) %>>,
    unknown
  >
) => {
  const queryClient = useQueryClient();
  const result = useMutation<
    <%= classify(title) %>,
    unknown,
    InfrastructureOptions<<%= classify(title) %>>,
    unknown
  >(({ id, data }) => <%= camelize(title) %>Request.updateById({ id, data }), {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('<%= options.icon %> <%= title %>');
        options?.onSuccess?.(data, variables, context);
      },
    }
  );

  return {
    ...result,
    update<%= classify(title) %>ById: result.mutate,
  };
};

export const use<%= classify(title) %>Create = (
  options?: UseMutationOptions<
    <%= classify(title) %>,
    unknown,
    InfrastructureOptions<<%= classify(title) %>>,
    unknown
  >
) => {
  const queryClient = useQueryClient();
  const result = useMutation<
    <%= classify(title) %>,
    unknown,
    InfrastructureOptions<<%= classify(title) %>>,
    unknown
  >(({ data }) => <%= camelize(title) %>Request.create({ data }), {
    ...options,
    onMutate: async ({ data }) => {
      await queryClient.cancelQueries('<%= options.icon %> <%= title %>');
      const previous = queryClient.getQueryData('<%= options.icon %> <%= title %>');
      queryClient.setQueryData('<%= options.icon %> <%= title %>', (<%= camelize(title) %>: <%= classify(title) %>[]) => {
        if (!<%= camelize(title) %>) {
          return [data];
        }
        return [...<%= camelize(title) %>, data];
      });
      options?.onMutate?.({ data });
      return previous;
    },
    onError: (error, variables, context) => {
      queryClient.setQueryData('<%= options.icon %> <%= title %>', context);
      options?.onError?.(error, variables, context);
    },
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries('<%= options.icon %> <%= title %>');
      options?.onSettled?.(data, error, variables, context);
    },
  });

  return {
    ...result,
    create<%= classify(title) %>: result.mutate,
  };
};

export const use<%= classify(title) %>DeleteById = (
  options?: UseMutationOptions<
    <%= classify(title) %>,
    unknown,
    InfrastructureOptions<<%= classify(title) %>>,
    unknown
  >
) => {
  const queryClient = useQueryClient();
  const result = useMutation(
    ({ id }: InfrastructureOptions<<%= classify(title) %>>) => <%= camelize(title) %>Request.deleteById({ id }),
    {
      ...options,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries('<%= options.icon %> <%= title %>');
        options?.onSuccess?.(data, variables, context);
      },
    }
  );

  return {
    ...result,
    delete<%= classify(title) %>ById: result.mutate,
  };
};
