'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CostsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/models');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-600">Redirecting to Models...</div>
    </div>
  );
}
