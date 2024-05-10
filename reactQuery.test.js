import { renderHook, waitFor } from "@testing-library/react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import nock from "nock";
import { useQuery } from "@tanstack/react-query";

export const useMyQuery = () => {
  return useQuery({
    queryKey: ['myquery'],
    queryFn: async () => {
      const response = await fetch("/test")
      if (response.ok) {
        return response.json()
      }
      throw new Error("failed")
      // return Promise.reject()
    }
  })
}

describe('test query', () => {
  it('test', async () => {
    const queryClient = new QueryClient()
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
    nock("http://localhost").get("/test").reply(404)
    const { result } = renderHook(() => useMyQuery(), {wrapper});

    await waitFor(() => {
      console.log(result.current.status)
      expect(result.current.status).not.toEqual('pending')
    })
  })
});
