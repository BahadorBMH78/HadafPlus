import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdDate: number;
}

export interface CreateDomainRequest {
  domain: string;
  status: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdDate: number;
}

export const domainApi = createApi({
  reducerPath: 'domainApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://6797aa2bc2c861de0c6d964c.mockapi.io/' }),
  tagTypes: ['Domain'],
  endpoints: (builder) => ({
    getDomains: builder.query<Domain[], void>({
      query: () => 'domain',
      providesTags: ['Domain'],
    }),
    createDomain: builder.mutation<Domain, CreateDomainRequest>({
      query: (body) => ({
        url: 'domain',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Domain'],
    }),
    updateDomain: builder.mutation<Domain, { id: string; data: Partial<Domain> }>({
      query: ({ id, data }) => ({
        url: `domain/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Domain'],
    }),
  }),
});

export const { 
  useGetDomainsQuery, 
  useCreateDomainMutation,
  useUpdateDomainMutation 
} = domainApi; 