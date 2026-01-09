"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import toast from "react-hot-toast";

/* ================= TYPES ================= */

export interface Product {
  id: string; // mapped from _id
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  occasion: string;
  rating: number;
  reviews: number;
  description: string;
  customizable: boolean;
  inStock: boolean;
}

export interface CartItem extends Product {
  quantity: number;
  customization?: {
    name?: string;
    message?: string;
    date?: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;

  isCartOpen: boolean;
  isAuthOpen: boolean;
  loading: boolean;

  addToCart: (
    product: Product,
    quantity?: number,
    customization?: CartItem["customization"]
  ) => void;

  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;

  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  setIsCartOpen: (open: boolean) => void;
  setIsAuthOpen: (open: boolean) => void;

  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;

  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

/* ================= CONTEXT ================= */

const AppContext = createContext<AppContextType | undefined>(undefined);

/* ================= PROVIDER ================= */

export const AppProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= PERSIST STATE ================= */

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    const storedWishlist = localStorage.getItem("wishlist");

    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  /* ================= AUTO LOGIN ================= */

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data?.user) setUser(data.user);
      } catch {
        // silent
      }
    };
    fetchUser();
  }, []);

  /* ================= CART ================= */

  const addToCart = (
    product: Product,
    quantity = 1,
    customization?: CartItem["customization"]
  ) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity, customization }
            : item
        );
      }
      return [...prev, { ...product, quantity, customization }];
    });

    setIsCartOpen(true);
    toast.success("Added to cart");
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  /* ================= WISHLIST ================= */

  const toggleWishlist = async (product: Product) => {
    const exists = wishlist.some((item) => item.id === product.id);

    setWishlist((prev) =>
      exists
        ? prev.filter((item) => item.id !== product.id)
        : [...prev, product]
    );

    // 🔥 Backend signal (non-blocking)
    fetch(`/api/products/${product.id}/wishlist`, {
      method: exists ? "DELETE" : "POST",
    }).catch(() => {});
  };

  const isInWishlist = (productId: string) =>
    wishlist.some((item) => item.id === productId);

  /* ================= AUTH ================= */

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser(data.user);
      setIsAuthOpen(false);
      toast.success("Logged in successfully");
    } catch (err: any) {
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("Signup successful! Please login.");
      setIsAuthOpen(true);
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      clearCart();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  /* ================= CALCULATIONS ================= */

  const getCartTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const getCartItemsCount = () =>
    cart.reduce((count, item) => count + item.quantity, 0);

  /* ================= PROVIDER ================= */

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        user,

        isCartOpen,
        isAuthOpen,
        loading,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isInWishlist,
        clearCart,

        setIsCartOpen,
        setIsAuthOpen,

        login,
        signup,
        logout,

        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};
