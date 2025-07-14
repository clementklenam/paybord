import {useState, useEffect} from "react";
import analyticsService from "@/services/analytics.service";
import {useAuth} from "@/contexts/AuthContext";

export default function TestTopCustomersPage() {
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await analyticsService.getDashboardOverview('last7days');
        console.log('Full response:', response);
        console.log('Top customers:', response?.overview?.topCustomers);
        setData(response);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Top Customers</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Current User:</h2>
        <div className="bg-gray-100 p-4 rounded text-sm">
          <div>User ID: {user?._id || 'Not logged in'}</div>
          <div>Email: {user?.email || 'Not logged in'}</div>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Raw Data:</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Top Customers:</h2>
        {data?.overview?.topCustomers ? (
          <div className="space-y-2">
            {data.overview.topCustomers.map((customer: unknown, index: number) => (
              <div key={index} className="bg-white p-3 rounded border">
                <div className="font-medium">{customer.name}</div>
                <div className="text-sm text-gray-600">{customer.email}</div>
                <div className="text-sm text-gray-600">Spend: ${customer.spend}</div>
                <div className="text-sm text-gray-600">Transactions: {customer.transactionCount}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-red-500">No top customers data found</div>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Data Structure:</h2>
        <div className="bg-gray-100 p-4 rounded text-sm">
          <div>Has overview: {data?.overview ? 'Yes' : 'No'}</div>
          <div>Has topCustomers: {data?.overview?.topCustomers ? 'Yes' : 'No'}</div>
          <div>Top customers length: {data?.overview?.topCustomers?.length || 0}</div>
          <div>Top customers type: {typeof data?.overview?.topCustomers}</div>
        </div>
      </div>
    </div>
  );
} 