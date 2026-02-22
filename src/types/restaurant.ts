export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  allergens?: string[];
  isPopular?: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Restaurant {
  slug: string;
  name: string;
  logo: string;
  primaryColor: string;
  tagline: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "preparing" | "ready" | "delivered";
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  notes: string;
  createdAt: Date;
  type: "delivery" | "takeaway" | "table";
  tableNumber?: number;
}
