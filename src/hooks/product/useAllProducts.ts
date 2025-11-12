// hooks/product/useAllProductsByTenant.ts
import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

interface UseAllProductsByTenantProps {
  tenantId?: number
}

export const useAllProductsByTenant = ({ tenantId }: UseAllProductsByTenantProps = {}) => {
  return useQuery({
    queryKey: ['allProductsByTenant', tenantId],
    queryFn: async () => {
      const res = await api.get('/products/all/tenant', {
        params: tenantId !== undefined ? { tenantId } : {},
      })
      return res.data.data || []
    },
    enabled: tenantId != null,
  })
}