import { useState } from "react";
import { useForm } from "react-hook-form";
import type { SubmitHandler } from "react-hook-form";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { CartItem } from "../books/CartPage";

/* --------------------------
   Конфигурация стран + правила телефонов
   phoneCode: код страны
   phoneLength: сколько цифр номера
   label: название страны
--------------------------- */
const COUNTRY_CONFIG = {
  RU: { phoneCode: "+7", phoneLength: 10, label: "Russia"},
  US: { phoneCode: "+1", phoneLength: 10, label: "United States"},
  UK: { phoneCode: "+44", phoneLength: 10, label: "United Kingdom"},
} as const;

type CountryKey = keyof typeof COUNTRY_CONFIG;

/* --------------------------
   Тип для состояния Redux
   cartItems — массив товаров в корзине
--------------------------- */
interface RootState {
  cart: {
    cartItems: CartItem[];
  };
}

/* --------------------------
   Тип данных формы оформления заказа
--------------------------- */
interface CheckoutFormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  state: string;
  zipcode: string;
}

/* --------------------------
   Компонент Checkout Page
--------------------------- */
const CheckOutPage: React.FC = () => {
  // Получаем товары из Redux
  const cartItems = useSelector((state: RootState) => state.cart.cartItems);

  // Считаем общую сумму
  const totalPrice = cartItems
    .reduce((sum, item) => sum + item.newPrice * item.quantity, 0)
    .toFixed(2);

  // Mock пользователя (пока нет логина)
  const currentUser = { email: "user@email.com" };

  // Инициализация react-hook-form
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CheckoutFormData>();
  
  // Состояние для чекбокса согласия с условиями
  const [isChecked, setIsChecked] = useState<boolean>(false);

  // Состояние выбранной страны (для синхронизации с телефоном)
  const [selectedCountry, setSelectedCountry] = useState<CountryKey>("RU");

  /* --------------------------
     Функция смены страны доставки
     - Сохраняет выбранную страну
     - Обновляет поле country в форме
     - Сбрасывает номер телефона (чтобы не было рассинхронизации)
  --------------------------- */
  const handleCountryChange = (country: CountryKey) => {
    setSelectedCountry(country);
    setValue("country", COUNTRY_CONFIG[country].label);
    setValue("phone", ""); // сброс номера при смене страны
  };

  /* --------------------------
     Обработчик отправки формы
     - Собирает полный номер с кодом страны
     - Формирует объект заказа
     - Пока выводит его в консоль
  --------------------------- */
  const onSubmit: SubmitHandler<CheckoutFormData> = (data) => {
    const fullPhone = COUNTRY_CONFIG[selectedCountry].phoneCode + data.phone;
    const orderData = {
      userEmail: currentUser.email,
      country: COUNTRY_CONFIG[selectedCountry].label,
      phone: fullPhone,
      items: cartItems,
      totalPrice,
      shippingInfo: data,
    };
    console.log("ORDER:", orderData);
  };

  return (
    <section>
      <div className="min-h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="container max-w-screen-lg mx-auto">

          {/* Заголовок и информация о корзине */}
          <div className="mb-6">
            <h2 className="font-semibold text-xl text-gray-600 mb-2">Cash On Delivery</h2>
            <p className="text-gray-500">Total Price: ${totalPrice}</p>
            <p className="text-gray-500">Items: {cartItems.length}</p>
          </div>

          {/* Форма */}
          <div className="bg-white rounded shadow-lg p-4 px-4 md:p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 gap-y-2 text-sm grid-cols-1 lg:grid-cols-3">

              {/* Левая колонка с описанием */}
              <div className="text-gray-600">
                <p className="font-medium text-lg">Personal Details</p>
                <p>Please fill out all the fields.</p>
              </div>

              {/* Правая колонка с полями формы */}
              <div className="lg:col-span-2">
                <div className="grid gap-4 gap-y-2 text-sm grid-cols-1 md:grid-cols-5">

                  {/* Поле Full Name */}
                  <div className="md:col-span-5">
                    <label htmlFor="name">Full Name</label>
                    <input
                      {...register("name", { required: "Name is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                  </div>

                  {/* Поле Email (только для чтения) */}
                  <div className="md:col-span-5">
                    <label>Email</label>
                    <input
                      disabled
                      defaultValue={currentUser.email}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                  </div>

                  {/* Выбор страны */}
                  <div className="md:col-span-2">
                    <label>Country</label>
                    <select
                      value={selectedCountry}
                      onChange={(e) => handleCountryChange(e.target.value as CountryKey)}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    >
                      {Object.entries(COUNTRY_CONFIG).map(([key, value]) => (
                        <option key={key} value={key}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Поле телефон с кодом страны */}
                  <div className="md:col-span-3 mt-1">
                    <label>Phone Number</label>
                    <div className="flex">
                      {/* Код страны */}
                      <div className="h-10 border rounded-l px-3 bg-gray-100 flex items-center">
                        {COUNTRY_CONFIG[selectedCountry].phoneCode}
                      </div>
                      {/* Ввод номера — только цифры */}
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

                  {/* Адрес */}
                  <div className="md:col-span-3">
                    <label>Address</label>
                    <input
                      {...register("address", { required: "Address is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                  </div>

                  {/* Город */}
                  <div className="md:col-span-2">
                    <label>City</label>
                    <input
                      {...register("city", { required: "City is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                  </div>

                  {/* Штат / область */}
                  <div className="md:col-span-2">
                    <label>State</label>
                    <input
                      {...register("state", { required: "State is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                  </div>

                  {/* Zip код */}
                  <div className="md:col-span-1">
                    <label>Zipcode</label>
                    <input
                      {...register("zipcode", { required: "Zipcode is required" })}
                      className="h-10 border mt-1 rounded px-4 w-full bg-gray-50"
                    />
                  </div>

                  {/* Чекбокс с условиями */}
                  <div className="md:col-span-5 mt-3">
                    <input type="checkbox" onChange={(e) => setIsChecked(e.target.checked)} />
                    <span className="ml-2">
                      I agree to{" "}
                      <Link to="" className="underline text-blue-600">Terms & Conditions</Link>
                    </span>
                  </div>

                  {/* Кнопка отправки */}
                  <div className="md:col-span-5 text-right">
                    <button
                      disabled={!isChecked} // нельзя отправить, пока не согласен
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
