import {useState} from "react";
import {Dialog} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import CustomerService, { Customer } from '@/services/customer.service';

export function AddCustomerModal({ open, onOpenChange, onAdd, businessId }: { open: boolean; onOpenChange: (open: boolean) => void; onAdd: (customer: Customer) => void; businessId: string }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [billing, setBilling] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const customerService = new CustomerService();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !email) {
      setError("Name and email are required.");
      return;
    }
    if (!businessId) {
      setError("Business is required.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const customer = await customerService.createCustomer({
        name,
        email,
        phone,
        billingAddress: billing ? { line1: billing } : undefined
      });
      onAdd(customer);
      setName(""); setEmail(""); setPhone(""); setBilling(""); setError("");
      onOpenChange(false);
    } catch (err: unknown) {
      const errorMsg = (err as any)?.response?.data?.error || (err as any)?.message || 'Failed to create customer';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-6">Add Customer</h2>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Phone</label>
              <Input value={phone} onChange={e => setPhone(e.target.value)} />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Billing Address</label>
              <Input value={billing} onChange={e => setBilling(e.target.value)} />
            </div>
            {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
            <div className="flex justify-end gap-2 mt-6">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
              <Button type="submit" variant="default" disabled={loading}>{loading ? 'Adding...' : 'Add Customer'}</Button>
            </div>
          </form>
        </div>
      )}
    </Dialog>
  );
} 