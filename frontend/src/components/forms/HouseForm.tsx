import { useState, type FormEvent } from 'react';
import { houseApi } from '../../services/api';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface HouseFormProps {
  house?: House;
  onSuccess?: (house: House) => void;
}

export function HouseForm({ house, onSuccess }: HouseFormProps) {
  const [form, setForm] = useState({
    name: house?.name ?? '',
    city: house?.city ?? '',
    address: house?.address ?? '',
    price: house?.price?.toString() ?? '',
    description: house?.description ?? '',
    rooms: house?.rooms?.toString() ?? '',
    bathrooms: house?.bathrooms?.toString() ?? '',
    dateAvailable: house?.dateAvailable?.split('T')[0] ?? '',
  });
  const [imageUrls, setImageUrls] = useState<string[]>(house?.images?.map((i) => i.url) ?? []);
  const [newUrl, setNewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addImageUrl() {
    if (newUrl.trim()) {
      setImageUrls((prev) => [...prev, newUrl.trim()]);
      setNewUrl('');
    }
  }

  function removeImageUrl(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const payload: CreateHousePayload = {
      name: form.name,
      city: form.city,
      address: form.address,
      price: Number(form.price),
      description: form.description,
      rooms: Number(form.rooms),
      bathrooms: Number(form.bathrooms),
      dateAvailable: form.dateAvailable,
      images: imageUrls.length > 0 ? imageUrls : undefined,
    };

    try {
      let result: House;
      if (house) {
        const { data } = await houseApi.update(house.id, payload);
        result = data.data;
      } else {
        const { data } = await houseApi.create(payload);
        result = data.data;
      }
      onSuccess?.(result);
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to save listing.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-danger">
          {error}
        </div>
      )}
      <Input
        label="Property Name"
        name="name"
        value={form.name}
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="Beachfront Villa"
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="City"
          name="city"
          value={form.city}
          onChange={(e) => updateField('city', e.target.value)}
          placeholder="Ngapali"
          required
        />
        <Input
          label="Address"
          name="address"
          value={form.address}
          onChange={(e) => updateField('address', e.target.value)}
          placeholder="123 Beach Road"
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Input
          label="Price per night (MMK)"
          type="number"
          name="price"
          value={form.price}
          onChange={(e) => updateField('price', e.target.value)}
          placeholder="50000"
          required
          min={1}
        />
        <Input
          label="Rooms"
          type="number"
          name="rooms"
          value={form.rooms}
          onChange={(e) => updateField('rooms', e.target.value)}
          placeholder="3"
          required
          min={1}
        />
        <Input
          label="Bathrooms"
          type="number"
          name="bathrooms"
          value={form.bathrooms}
          onChange={(e) => updateField('bathrooms', e.target.value)}
          placeholder="2"
          required
          min={1}
        />
      </div>
      <Input
        label="Available From"
        type="date"
        name="dateAvailable"
        value={form.dateAvailable}
        onChange={(e) => updateField('dateAvailable', e.target.value)}
        required
      />
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors outline-none focus:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-0"
          rows={4}
          value={form.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Describe your property..."
          required
        />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Image URLs</label>
        <div className="flex gap-2">
          <input
            type="url"
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <Button type="button" variant="secondary" size="sm" onClick={addImageUrl}>
            Add
          </Button>
        </div>
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {imageUrls.map((_url, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
              >
                Image {i + 1}
                <button
                  type="button"
                  onClick={() => removeImageUrl(i)}
                  className="ml-1 text-gray-400 hover:text-danger"
                >
                  &times;
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
      <Button type="submit" loading={loading} className="w-full">
        {house ? 'Update Listing' : 'Create Listing'}
      </Button>
    </form>
  );
}
