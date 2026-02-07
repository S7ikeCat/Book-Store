import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import type { CartItem } from "../books/CartPage";
import { clearCart } from "../../redux/features/cart/cartSlice"; // импорт экшена для очистки корзины
import axios from "axios";

const COUNTRY_CONFIG = {
  RU: { phoneCode: "+7", phoneLength: 10, label: "Russia" },
  US: { phoneCode: "+1", phoneLength: 10, label: "United States" },
  UK: { phoneCode: "+44", phoneLength: 10, label: "United Kingdom" },
} as const;

type CountryKey = keyof typeof COUNTRY_CONFIG;

interface RootState {
  cart: {
    cartItems: CartItem[];
  };
}

interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
}

interface OrderData {
  userEmail: string;
  country: string;
  phone: string;
  items: CartItem[];
  totalPrice: string;
  shippingInfo: CheckoutFormData;
}

const decodeToken = (token: string) => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};

const getTotalItemsCount = (items?: { quantity?: number }[]) => {
  return items?.reduce((sum, item) => sum + (item.quantity ?? 0), 0) ?? 0;
};

const CheckOutPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state: RootState) => state.cart.cartItems);
  const totalPrice = cartItems.reduce((sum, item) => sum + item.newPrice * item.quantity, 0).toFixed(2);

  const token = localStorage.getItem("token");
  let storedEmail: string | null = null;
  if (token) {
    const decoded = decodeToken(token);
    storedEmail = decoded?.email || null;
  }

  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutFormData>();
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("RU");
  const [orderPlaced, setOrderPlaced] = useState<boolean>(false);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  // Устанавливаем email, если есть залогиненный пользователь
  useEffect(() => {
    if (storedEmail) setValue("email", storedEmail);
  }, [storedEmail, setValue]);

  const handleCountryChange = (country: CountryKey) => {
    setSelectedCountry(country);
    setValue("country", COUNTRY_CONFIG[country].label);
    setValue("phone", "");
  };

  const onSubmit: SubmitHandler<CheckoutFormData> = async (data) => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Add products before placing an order.");
      return;
    }
  
    const fullPhone = COUNTRY_CONFIG[selectedCountry].phoneCode + data.phone;
    const order: OrderData = {
      userEmail: data.email,
      country: COUNTRY_CONFIG[selectedCountry].label,
      phone: fullPhone,
      items: cartItems,
      totalPrice,
      shippingInfo: data,
    };
  
    try {
      const token = localStorage.getItem("token"); // получаем токен
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`, // <-- добавляем токен
          },
        }
      );
  
      console.log("ORDER CREATED:", response.data);
      setOrderData(order);
      setOrderPlaced(true);
      dispatch(clearCart());
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Try again.");
    }
  };

  // Рендер чека после успешного заказа
  if (orderPlaced && orderData) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">🎉 Order Placed Successfully!</h2>
          <p className="mb-4">Thank you for your purchase! Here are your order details:</p>

          <div className="text-left mb-4">
            <p><strong>Name:</strong> {orderData.shippingInfo.name}</p>
            <p><strong>Email:</strong> {orderData.userEmail}</p>
            <p><strong>Phone:</strong> {orderData.phone}</p>
            <p><strong>Address:</strong> {orderData.shippingInfo.address}, {orderData.shippingInfo.city}, {orderData.shippingInfo.state}, {orderData.shippingInfo.zipcode}, {orderData.country}</p>
            <p><strong>Total Price:</strong> ${orderData.totalPrice}</p>
            <p><strong>Items:</strong></p>
            <ul className="list-disc ml-5">
              {orderData.items.map((item, index) => (
                <li key={index}>{item.title} x {item.quantity} (${item.newPrice} each)</li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to Shop
          </button>
        </div>
      </section>
    );
  }

  // Основная форма оформления заказа
  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">
          <div className="mb-6">
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
            <p className="text-gray-500">Total Price: ${totalPrice}</p>
            <p className="text-gray-500">Items: {getTotalItemsCount(cartItems)}</p>
          </div>

          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>

              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">

                  {/* Full Name */}
                  <div className="md:col-span-5">
                    <label htmlFor="name">Full Name</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="md:col-span-5">
                    <label>Email</label>
                    <input
                      {...register("email", { required: !storedEmail ? "Email is required" : false })}
                      defaultValue={storedEmail || ""}
                      disabled={!!storedEmail}
                      placeholder={storedEmail ? "" : "Enter your email"}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                  </div>

                  {/* Country */}
                  <div className="md:col-span-2">
                    <label>Country</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value as CountryKey)}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    >
                      {Object.entries(COUNTRY_CONFIG).map(([key, value]) => (
                        <option key={key} value={key}>{value.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Phone */}
                  <div className="md:col-span-3 mt-1">
                    <label>Phone Number</label>
                    <div className="flex">
                      <div className="h-10 border rounded-l px-3 bg-gray-100 flex items-center">
                        {COUNTRY_CONFIG[selectedCountry].phoneCode}
                      </div>
                      <input
                        {...register("phone", {
                          required: "Phone number is required",
                          validate: (value) =>
                            value.length === COUNTRY_CONFIG[selectedCountry].phoneLength ||
                            `Phone must contain ${COUNTRY_CONFIG[selectedCountry].phoneLength} digits`,
                        })}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={COUNTRY_CONFIG[selectedCountry].phoneLength}
                        onChange={(e) => setValue("phone", e.target.value.replace(/\D/g, ""))}
                        placeholder={`${COUNTRY_CONFIG[selectedCountry].phoneLength} digits`}
                        className="h-10 border border-l-0 rounded-r px-4 w-full bg-gray-50"
                      />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-3">
                    <label>Address</label>
                    <input
                      {...register("address", { required: "Address is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.address && <p className="text-red-500 text-xs">{errors.address.message}</p>}
                  </div>

                  {/* City */}
                  <div className="md:col-span-2">
                    <label>City</label>
                    <input
                      {...register("city", { required: "City is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
                  </div>

                  {/* State */}
                  <div className="md:col-span-2">
                    <label>State</label>
                    <input
                      {...register("state", { required: "State is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.state && <p className="text-red-500 text-xs">{errors.state.message}</p>}
                  </div>

                  {/* Zipcode */}
                  <div className="md:col-span-1">
                    <label>Zipcode</label>
                    <input
                      {...register("zipcode", { required: "Zipcode is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.zipcode && <p className="text-red-500 text-xs">{errors.zipcode.message}</p>}
                  </div>

                  {/* Terms checkbox */}
                  <div className="md:col-span-5 mt-3">
                    <input type="checkbox" onChange={(e) => setIsChecked(e.target.checked)} />
                    <span className="ml-2">
                      I agree to <Link to="" className="underline text-blue-600">Terms & Conditions</Link>
                    </span>
                  </div>

                  {/* Submit button */}
                  <div className="md:col-span-5 text-right">
                    <button
                      disabled={!isChecked}
                      className="bg-blue-500 disabled:opacity-50 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Place an Order
                    </button>
                  </div>

                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CheckOutPage;
