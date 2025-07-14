import {useState, useEffect} from "react";
import {Dialog} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Tabs, TabsList, TabsTrigger, TabsContent} from "@/components/ui/tabs";
import {Card, CardContent} from "@/components/ui/card";
import {Plus, X, UserPlus, Package, Calendar as CalendarIcon} from "lucide-react";
import {AddCustomerModal} from "./AddCustomerModal";
import {Product, ProductListResponse, ProductService} from "@/services/product.service";
import {ProductCreateForm} from "@/components/products/ProductCreateForm";
import {Dialog as Modal} from "@/components/ui/dialog";
import SubscriptionService from '@/services/subscription.service';
import CustomerService from '@/services/customer.service';
import BusinessService from '@/services/business.service';
import {Calendar} from '@/components/ui/calendar';
import {Checkbox} from '@/components/ui/checkbox';

const productService = new ProductService();

export function CreateSubscriptionDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [activeTab, setActiveTab] = useState("summary");
  const [billingMode, setBillingMode] = useState("classic");
  const [collectTax, setCollectTax] = useState(false);
  const [chargeAuto, setChargeAuto] = useState(false);
  const [trialDays, setTrialDays] = useState(0);
  const [customers, setCustomers] = useState<any[]>([]);
  const [customerQuery, setCustomerQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<unknown>(null);
  const [showAddCustomer, setShowAddCustomer] = useState(false);

  // Product catalog state
  const [products, setProducts] = useState<Product[]>([]);
  const [productQuery, setProductQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productQty, setProductQty] = useState(1);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const [businessId, setBusinessId] = useState<string | null>(null);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [customersError, setCustomersError] = useState<string | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [forever, setForever] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      setProductsLoading(true);
      setProductsError(null);
      try {
        const res: ProductListResponse = await productService.getProducts({ active: true });
        setProducts(res.data);
      } catch (err) {
        setProductsError("Failed to load products");
      } finally {
        setProductsLoading(false);
      }
    }
    if (open) fetchProducts();
  }, [open]);

  // Fetch businessId on mount
  useEffect(() => {
    async function fetchBusinessId() {
      try {
        const business = await new BusinessService().getBusinessProfile();
        setBusinessId(business._id || business.id);
      } catch (err) {
        setBusinessId(null);
      }
    }
    if (open) fetchBusinessId();
  }, [open]);

  // Fetch customers for business
  useEffect(() => {
    if (!open) return;
    if (!businessId) return; // Only fetch if businessId is set
    setCustomersLoading(true);
    setCustomersError(null);
    new CustomerService().getCustomersByBusiness(businessId)
      .then(res => {
        const normalized = res.map((c: unknown) => ({ ...c, id: c.id || c._id }));
        setCustomers(normalized);
      })
      .catch((err: unknown) => {
        setCustomersError(err?.response?.data?.error || err.message || 'Failed to load customers');
      })
      .finally(() => setCustomersLoading(false));
  }, [open, businessId]);

  const filteredProducts = products.filter(p =>
    (p.name && p.name.toLowerCase().includes(productQuery.toLowerCase())) ||
    (p.description && p.description.toLowerCase().includes(productQuery.toLowerCase()))
  );

  const filteredCustomers = customers.filter(c =>
    (c.name && c.name.toLowerCase().includes(customerQuery.toLowerCase())) ||
    (c.email && c.email.toLowerCase().includes(customerQuery.toLowerCase()))
  );

  function handleAddCustomer(newCustomer: unknown) {
    setCustomers(prev => [...prev, newCustomer]);
    setSelectedCustomer(newCustomer);
    setShowAddCustomer(false);
    setCustomerQuery("");
  }

  async function handleCreateSubscription() {
    if (!selectedCustomer || !selectedProduct) {
      setCreateError('Please select a customer and product');
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      await SubscriptionService.createSubscription({
        customer: selectedCustomer.id || selectedCustomer._id,
        product: selectedProduct.id || selectedProduct._id,
        price: selectedProduct.price * productQty,
        currency: selectedProduct.currency || 'USD',
        interval: 'month',
        startDate: startDate ? startDate.toISOString() : undefined,
        endDate: forever ? null : (endDate ? endDate.toISOString() : null),
        metadata: {},
      });
      setCreating(false);
      onOpenChange(false);
      // Optionally: show a toast or success message here
    } catch (err: unknown) {
      setCreateError(err?.response?.data?.error || err.message || 'Failed to create subscription');
      setCreating(false);
    }
  }

  // The left gap (in px)
  const leftGap = 120;

  // In the render, show a loading spinner or message if businessId is not set
  if (open && !businessId) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <div className="flex items-center justify-center h-full w-full">
          <span>Loading business info...</span>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {open && (
        <div
          className="fixed top-0 right-0 bottom-0 z-50 bg-background border-l border-gray-100"
          style={{
            left: leftGap,
            width: `calc(100vw - ${leftGap}px)`,
            height: '100vh',
            borderRadius: 0,
            boxShadow: 'none',
            padding: 0,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <div className="flex h-full">
            {/* Left: Form */}
            <div className="flex-1 bg-card px-10 py-10 overflow-y-auto border-r border-gray-100 min-w-[420px]">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Create a subscription</h2>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              {/* Customer */}
              <div className="mb-10">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Customer</label>
                <div className="relative">
                  <Input
                    placeholder="Find or add a customer..."
                    className="bg-background border-gray-200 pr-10"
                    value={selectedCustomer ? selectedCustomer.name + ' (' + selectedCustomer.email + ')' : customerQuery}
                    onChange={e => {
                      setCustomerQuery(e.target.value);
                      setSelectedCustomer(null);
                    }}
                    onFocus={() => setSelectedCustomer(null)}
                  />
                  {customerQuery && !selectedCustomer && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto">
                      {filteredCustomers.length > 0 ? (
                        filteredCustomers.map(c => (
                          <div
                            key={c.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-50"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setCustomerQuery("");
                            }}
                          >
                            <div className="font-medium">{c.name}</div>
                            <div className="text-xs text-gray-500">{c.email}</div>
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-gray-600 flex items-center gap-2">
                          <UserPlus className="h-4 w-4 text-primary" />
                          <button type="button" className="text-primary font-semibold hover:underline" onClick={() => setShowAddCustomer(true)}>
                            Add new customer
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                {selectedCustomer && (
                  <div className="mt-2 text-xs text-gray-600">
                    Selected: <span className="font-medium">{selectedCustomer.name}</span> ({selectedCustomer.email})
                    <button className="ml-2 text-primary underline text-xs" onClick={() => setSelectedCustomer(null)} type="button">Change</button>
                  </div>
                )}
              </div>
              <AddCustomerModal open={showAddCustomer} onOpenChange={setShowAddCustomer} onAdd={handleAddCustomer} businessId={businessId || ''} />
              {/* Duration */}
              <div className="mb-10">
                <label className="block text-sm font-semibold text-gray-800 mb-2">Duration</label>
                <div className="flex items-center gap-4 mb-4">
                  <Checkbox id="forever" checked={forever} onCheckedChange={v => setForever(!!v)} />
                  <label htmlFor="forever" className="text-sm">Forever (no end date)</label>
                </div>
                <div className="flex gap-8">
                  <div>
                    <div className="text-xs mb-1">Start date</div>
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={date => false}
                    />
                  </div>
                  <div>
                    <div className="text-xs mb-1">End date</div>
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={forever ? () => true : date => (startDate ? date < startDate : false)}
                    />
                  </div>
                </div>
              </div>
              {/* Subscription details */}
              <Card className="mb-10 bg-background border border-gray-100 rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription details</h3>
                  {/* Product Catalog Dropdown */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1 flex items-center gap-2">
                      Product
                      <Button type="button" size="icon" variant="outline" className="ml-2 h-7 w-7 p-0" onClick={() => setShowAddProduct(true)}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </label>
                    <div className="relative">
                      <Input
                        placeholder="Find or add a product..."
                        className="bg-background border-gray-200 pr-10"
                        value={selectedProduct ? selectedProduct.name : productQuery}
                        onChange={e => {
                          setProductQuery(e.target.value);
                          setSelectedProduct(null);
                        }}
                        onFocus={() => setSelectedProduct(null)}
                      />
                      {productsLoading && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 px-4 py-3 text-gray-500 flex items-center gap-2">
                          Loading products...
                        </div>
                      )}
                      {productsError && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-red-200 rounded-lg shadow-lg z-10 px-4 py-3 text-red-600 flex items-center gap-2">
                          {productsError}
                        </div>
                      )}
                      {productQuery && !selectedProduct && !productsLoading && !productsError && (
                        <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-56 overflow-auto">
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map(p => (
                              <div
                                key={p.id}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-50 flex items-center gap-3"
                                onClick={() => {
                                  setSelectedProduct(p);
                                  setProductQuery("");
                                }}
                              >
                                <img src={p.image} alt={p.name} className="h-8 w-8 rounded object-cover border border-gray-200" />
                                <div>
                                  <div className="font-medium">{p.name}</div>
                                  <div className="text-xs text-gray-500">{p.currency || 'USD'} {p.price}</div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-600 flex items-center gap-2">
                              <Package className="h-4 w-4 text-primary" />
                              No products found
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {selectedProduct && (
                      <div className="mt-2 flex items-center gap-4">
                        <img src={selectedProduct.image} alt={selectedProduct.name} className="h-10 w-10 rounded object-cover border border-gray-200" />
                        <div>
                          <div className="font-medium">{selectedProduct.name}</div>
                          <div className="text-xs text-gray-500">{selectedProduct.currency || 'USD'} {selectedProduct.price}</div>
                        </div>
                        <div className="flex items-center gap-2 ml-6">
                          <label className="text-xs text-gray-500">Qty</label>
                          <Input type="number" min={1} value={productQty} onChange={e => setProductQty(Number(e.target.value))} className="w-16 bg-background border-gray-200" />
                        </div>
                        <button className="ml-4 text-primary underline text-xs" onClick={() => setSelectedProduct(null)} type="button">Change</button>
                      </div>
                    )}
                  </div>
                  {/* End Product Catalog Dropdown */}
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Pricing</label>
                    <div className="flex items-center gap-2 mb-2">
                      {/* Pricing is now based on selected product */}
                      <Input placeholder="1" className="w-16 bg-background border-gray-200" value={productQty} onChange={e => setProductQty(Number(e.target.value))} />
                      <span className="w-16 text-right text-gray-400">{selectedProduct ? (selectedProduct.currency || 'USD') + ' ' + (selectedProduct.price * productQty).toFixed(2) : '—'}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs mt-2">
                      <Button variant="secondary" size="sm" className="rounded-full px-3 py-1">Add coupon</Button>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" checked={collectTax} onChange={e => setCollectTax(e.target.checked)} className="accent-primary" />
                        <span className="text-gray-700">Collect tax automatically</span>
                      </label>
                      <Button variant="secondary" size="sm" className="rounded-full px-3 py-1">Add tax manually</Button>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Bill starting</label>
                    <Button variant="outline" size="sm" className="flex items-center gap-2 bg-background border-gray-200">
                      <CalendarIcon className="h-4 w-4" /> 8 Jul 2025
                    </Button>
                    <div className="text-xs text-gray-400 mt-1">This is also when the next invoice will be generated.</div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Free trial days</label>
                    <Button variant="outline" size="sm" onClick={() => setTrialDays(trialDays + 1)} className="bg-background border-gray-200">
                      + Add trial days
                    </Button>
                    {trialDays > 0 && <span className="ml-2 text-xs text-primary font-semibold">{trialDays} days</span>}
                  </div>
                  <div className="mb-6">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Metadata</label>
                    <Button variant="secondary" size="sm" className="rounded-full px-3 py-1">+ Add metadata</Button>
                  </div>
                  <Button variant="outline" className="w-full mt-2 bg-background border-gray-200 rounded-lg">+ Add phase</Button>
                </CardContent>
              </Card>
              {/* Subscription settings */}
              <Card className="mb-10 bg-background border border-gray-100 rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Subscription settings</h3>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Payment</label>
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="payment" checked={chargeAuto} onChange={() => setChargeAuto(true)} className="accent-primary" />
                        <span className="text-gray-700">Automatically charge a payment method on file</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="payment" checked={!chargeAuto} onChange={() => setChargeAuto(false)} className="accent-primary" />
                        <span className="text-gray-700">Email invoice to the customer to pay manually</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Advanced settings */}
              <Card className="mb-10 bg-background border border-gray-100 rounded-xl shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Advanced settings</h3>
                  <div className="mb-4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Billing mode</label>
                    <div className="flex items-center gap-6 mt-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="billingMode" checked={billingMode === 'classic'} onChange={() => setBillingMode('classic')} className="accent-primary" />
                        <span className="text-gray-700">Classic</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="billingMode" checked={billingMode === 'flexible'} onChange={() => setBillingMode('flexible')} className="accent-primary" />
                        <span className="text-gray-700">Flexible</span>
                      </label>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 text-sm mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-primary" /> Description
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-primary" /> Invoice memo
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-primary" /> Invoice footer
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="accent-primary" /> Custom invoice fields
                    </label>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end border-t border-gray-100 pt-8">
                <Button variant="default" className="w-48 h-12 rounded-lg text-base font-semibold shadow-md" onClick={handleCreateSubscription} disabled={creating}>
                  {creating ? 'Creating...' : 'Create subscription'}
                </Button>
              </div>
              {createError && <div className="text-red-600 text-sm mt-2">{createError}</div>}
            </div>
            {/* Right: Preview */}
            <div className="flex-1 bg-card px-6 py-10 overflow-y-auto flex flex-col min-w-[420px]">
              <Card className="bg-background border border-gray-100 rounded-xl shadow-sm mb-4 flex-1 flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full px-0">
                    <TabsList className="mb-4 bg-gray-100 rounded-full p-1 flex gap-1">
                      <TabsTrigger value="summary" className="rounded-full px-4 py-1.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">Summary</TabsTrigger>
                      <TabsTrigger value="invoice" className="rounded-full px-4 py-1.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">Invoice</TabsTrigger>
                      <TabsTrigger value="code" className="rounded-full px-4 py-1.5 text-sm font-semibold data-[state=active]:bg-primary data-[state=active]:text-white">Code</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary">
                      <div className="text-base text-gray-900 mb-2 flex items-center gap-2 font-semibold">
                        <CalendarIcon className="h-4 w-4 text-primary" />
                        8 July 2025
                      </div>
                      <div className="text-xs text-gray-500">Subscription starts</div>
                    </TabsContent>
                    <TabsContent value="invoice">
                      <div className="text-xs text-gray-500">Invoice preview coming soon...</div>
                    </TabsContent>
                    <TabsContent value="code">
                      <div className="text-xs text-gray-500">Code preview coming soon...</div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}
      <Modal open={showAddProduct} onOpenChange={setShowAddProduct}>
        <ModalContent className="max-w-lg w-full">
          <ProductCreateForm
            businessId={businessId}
            onCreate={product => {
              setProducts(prev => [product, ...prev]);
              setSelectedProduct(product);
              setShowAddProduct(false);
            }}
            onCancel={() => setShowAddProduct(false)}
          />
        </ModalContent>
      </Modal>
    </Dialog>
  );
} 