"use client";

import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export default function CarritoPage() {
  const { state, removeFromCart, updateQuantity, getTotalPrice } = useCart();
  const router = useRouter();

  const handleCheckout = () => {
    // Implement checkout logic here
    alert('Funcionalidad de checkout aún no implementada');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-primary-soft py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Carrito de Compras</h1>
              <div className="text-center py-10">
                <p className="text-gray-600 text-lg">Tu carrito está vacío</p>
                <button
                  onClick={() => router.push('/productos')}
                  className="mt-4 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
                >
                  Seguir comprando
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-primary-soft py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {state.items.map((item) => (
                      <li key={item.product.id_producto} className="py-6 px-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-24 h-24 bg-gray-200 rounded-md overflow-hidden">
                            {item.product.imagenes && item.product.imagenes.length > 0 ? (
                              <img
                                src={item.product.imagenes[0].url}
                                alt={item.product.nombre}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                Sin imagen
                              </div>
                            )}
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between">
                                <h3 className="text-lg font-medium text-gray-900">{item.product.nombre}</h3>
                                <p className="ml-4 text-lg font-semibold text-gray-900">
                                  ${(parseFloat(item.product.precio_base) * item.quantity).toFixed(2)}
                                </p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 line-clamp-1">{item.product.descripcion}</p>
                            </div>

                            <div className="flex-1 flex items-end justify-between">
                              <div className="flex items-center">
                                <button
                                  onClick={() => updateQuantity(item.product.id_producto, item.quantity - 1)}
                                  className="px-3 py-1 bg-gray-200 rounded-l-md text-gray-600 hover:bg-gray-300"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="px-3 py-1 bg-gray-100 text-gray-800">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(item.product.id_producto, item.quantity + 1)}
                                  className="px-3 py-1 bg-gray-200 rounded-r-md text-gray-600 hover:bg-gray-300"
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(item.product.id_producto)}
                                className="ml-4 text-red-600 hover:text-red-800"
                              >
                                Eliminar
                              </button>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Resumen del pedido</h2>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">${getTotalPrice().toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-gray-600">Envío</p>
                      <p className="font-medium">Gratis</p>
                    </div>

                    <div className="flex justify-between">
                      <p className="text-gray-600">Impuestos</p>
                      <p className="font-medium">$0.00</p>
                    </div>

                    <div className="border-t border-gray-200 pt-4 flex justify-between text-lg font-semibold">
                      <p>Total</p>
                      <p>${getTotalPrice().toFixed(2)}</p>
                    </div>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="mt-6 w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors"
                  >
                    Proceder al pago
                  </button>

                  <button
                    onClick={() => router.push('/productos')}
                    className="mt-3 w-full border border-gray-300 text-gray-700 py-3 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Continuar comprando
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}