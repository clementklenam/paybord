import {useState} from "react";
import {Product, ProductCreateData, ProductService} from "@/services/product.service";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Image as ImageIcon} from "lucide-react";

export function ProductCreateForm({ businessId, onCreate, onCancel }: { businessId: string; onCreate: (product: Product) => void; onCancel: () => void }) {
  const [form, setForm] = useState<ProductCreateData>({
    businessId,
    name: "",
    description: "",
    price: 0,
    image: "",
    category: "Subscription",
    currency: "USD"
  });
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const productService = new ProductService();
      const created = await productService.createProduct({ ...form, image: imageUrl || form.image });
      onCreate(created);
    } catch (err) {
      setError("Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name" className="text-sm font-medium">
            Product Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="category" className="text-sm font-medium">
            Category
          </Label>
          <Select value={form.category} onValueChange={value => setForm({ ...form, category: value })}>
            <SelectTrigger id="category" className="mt-1">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Subscription">Subscription</SelectItem>
              <SelectItem value="Service">Service</SelectItem>
              <SelectItem value="Software">Software</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div>
        <Label htmlFor="description" className="text-sm font-medium">
          Description
        </Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter product description"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          className="mt-1 h-20"
        />
      </div>
      <div>
        <Label htmlFor="image" className="text-sm font-medium">
          Product Image
        </Label>
        <div className="mt-1 flex items-center gap-4">
          <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-muted">
            {imageUrl ? (
              <img src={imageUrl} alt="Product" className="h-full w-full object-cover" />
            ) : (
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
            )}
          </div>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = event => {
                  setImageUrl(event.target?.result as string);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="price" className="text-sm font-medium">
            Price <span className="text-red-500">*</span>
          </Label>
          <Input
            id="price"
            name="price"
            type="number"
            min={0}
            step={0.01}
            placeholder="0.00"
            value={form.price}
            onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })}
            className="mt-1"
            required
          />
        </div>
        <div>
          <Label htmlFor="currency" className="text-sm font-medium">
            Currency
          </Label>
          <Input
            id="currency"
            name="currency"
            placeholder="USD"
            value={form.currency}
            onChange={e => setForm({ ...form, currency: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>Cancel</Button>
        <Button type="submit" variant="default" disabled={loading}>Create Product</Button>
      </div>
    </form>
  );
} 