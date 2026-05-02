import { Redis } from "@upstash/redis"

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
})

export type CartItem = {
  productId: number
  quantity: number
  name: string
  price: number
  image: string | null
}

// Cart functions
export async function getCart(userId: number): Promise<CartItem[]> {
  const cart = await redis.get<CartItem[]>(`cart:${userId}`)
  return cart || []
}

export async function setCart(userId: number, cart: CartItem[]): Promise<void> {
  await redis.set(`cart:${userId}`, cart, { ex: 86400 * 7 }) // 7 days expiry
}

export async function addToCart(
  userId: number,
  item: CartItem
): Promise<CartItem[]> {
  const cart = await getCart(userId)
  const existingIndex = cart.findIndex((i) => i.productId === item.productId)

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += item.quantity
  } else {
    cart.push(item)
  }

  await setCart(userId, cart)
  return cart
}

export async function updateCartItem(
  userId: number,
  productId: number,
  quantity: number
): Promise<CartItem[]> {
  const cart = await getCart(userId)
  const index = cart.findIndex((i) => i.productId === productId)

  if (index >= 0) {
    if (quantity <= 0) {
      cart.splice(index, 1)
    } else {
      cart[index].quantity = quantity
    }
  }

  await setCart(userId, cart)
  return cart
}

export async function clearCart(userId: number): Promise<void> {
  await redis.del(`cart:${userId}`)
}

// Session functions
export async function setSession(
  sessionId: string,
  userId: number
): Promise<void> {
  await redis.set(`session:${sessionId}`, userId, { ex: 86400 * 30 }) // 30 days
}

export async function getSession(sessionId: string): Promise<number | null> {
  return await redis.get<number>(`session:${sessionId}`)
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(`session:${sessionId}`)
}
