"use client";
import { useState, useEffect } from "react";

export default function TestAuthPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testAuth = async () => {
      try {
        console.log('Importing Supabase client');
        const { createClient } = await import('@/lib/supabase/client');
        console.log('Supabase client imported');
        
        console.log('Creating Supabase client');
        const supabase = createClient();
        console.log('Supabase client created');
        
        console.log('Calling getSession');
        const { data, error } = await supabase.auth.getSession();
        console.log('getSession response:', data, error);
        
        if (error) {
          setError(error.message);
        } else {
          setResult(data);
        }
      } catch (err: any) {
        console.error('Error in testAuth:', err);
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    testAuth();
  }, []);

  if (loading) {
    return <div className="p-4">Testing auth... please wait</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>
      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}