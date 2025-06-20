'use client'

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Company } from './CompanyContext';

interface SearchParamsHandlerProps {
  selectedCompany: Company | null;
  setSelectedCompany: (company: Company | null) => void;
}

export const SearchParamsHandler: React.FC<SearchParamsHandlerProps> = ({ 
  selectedCompany, 
  setSelectedCompany 
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // On initial load, try to set company from URL params
  useEffect(() => {
    const companyId = searchParams.get('companyId');
    const companyName = searchParams.get('companyName');
    const status = searchParams.get('status') as Company['status'];
    const lastSync = searchParams.get('lastSync');

    if (companyId && companyName && !selectedCompany) {
      setSelectedCompany({ 
        id: companyId, 
        name: decodeURIComponent(companyName),
        status: status || undefined,
        last_sync: lastSync || undefined
      });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when selected company changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    
    if (selectedCompany) {
      newSearchParams.set('companyId', selectedCompany.id);
      newSearchParams.set('companyName', encodeURIComponent(selectedCompany.name));
      if (selectedCompany.status) newSearchParams.set('status', selectedCompany.status);
      if (selectedCompany.last_sync) newSearchParams.set('lastSync', selectedCompany.last_sync);
    } else {
      newSearchParams.delete('companyId');
      newSearchParams.delete('companyName');
      newSearchParams.delete('status');
      newSearchParams.delete('lastSync');
    }

    // Only update URL if params have changed
    if (newSearchParams.toString() !== searchParams.toString()) {
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  }, [selectedCompany, router, pathname, searchParams]);

  return null;
};

export default SearchParamsHandler; 