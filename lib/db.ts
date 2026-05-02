import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL!)

export type User = {
  id: number
  name: string
  phone: string
  email: string | null
  password_hash: string | null
  created_at: Date
}

export type Kajian = {
  id: number
  title: string
  ustadz: string
  schedule_date: string
  schedule_time: string
  type: "free" | "paid"
  price: number
  spot: number
  filled: number
  image: string | null
  category: string | null
  description: string | null
  location: string | null
  created_at: Date
}

export type Product = {
  id: number
  name: string
  price: number
  old_price: number | null
  image: string | null
  category: string | null
  rating: number | null
  sold: number
  description: string | null
  created_at: Date
}

export type KajianRegistration = {
  id: number
  user_id: number
  kajian_id: number
  amount_paid: number
  payment_method: string | null
  status: string
  registered_at: Date
}

export type Order = {
  id: number
  user_id: number
  total_amount: number
  unique_code: number | null
  payment_method: string | null
  status: string
  created_at: Date
}

export type OrderItem = {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price_at_buy: number
}
