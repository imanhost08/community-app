'use client'

import * as React from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface KajianItem {
  id: string
  title: string
  ustadz: string
  date: string
  time: string
  registered: number
  capacity: number
  icon: string
  badgeText: string
  badgeColor: string
}

const mockKajian: KajianItem[] = [
  {
    id: '1',
    title: 'Fiqh Muamalah',
    ustadz: 'Ust. Ahmad Zainuddin',
    date: "Jum'at, 2 Mei 2026",
    time: '19:30 WIB',
    registered: 87,
    capacity: 120,
    icon: '📖',
    badgeText: 'Infaq',
    badgeColor: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100',
  },
  {
    id: '2',
    title: 'Tahsin Al-Quran L...',
    ustadz: 'Ust. Muhammad Ridwan',
    date: 'Sabtu, 3 Mei 2026',
    time: '16:00 WIB',
    registered: 28,
    capacity: 30,
    icon: '🕌',
    badgeText: 'Tahsin',
    badgeColor: 'bg-rose-100 text-rose-700 hover:bg-rose-100',
  },
  {
    id: '3',
    title: 'Tafsir Al-Mishbah',
    ustadz: 'Ust. Quraish Shihab',
    date: 'Ahad, 4 Mei 2026',
    time: '09:00 WIB',
    registered: 150,
    capacity: 200,
    icon: '📜',
    badgeText: 'Umum',
    badgeColor: 'bg-blue-100 text-blue-700 hover:bg-blue-100',
  },
]

import Autoplay from 'embla-carousel-autoplay'

export function KajianCarousel() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  )

  return (
    <section className="w-full py-6 bg-[#F9FAF9]">
      <div className="flex items-center justify-between px-4 mb-5">
        <h2 className="text-2xl font-serif font-bold text-[#2D4A3E]">Kajian Terdekat</h2>
        <Link 
          href="/kajian" 
          className="text-sm font-bold text-emerald-700 flex items-center gap-1 hover:underline group"
        >
          Lihat Semua <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent>
          {mockKajian.map((kajian) => (
            <CarouselItem key={kajian.id} className="pl-4 basis-[85%] min-w-0 shrink-0">
              <KajianCard kajian={kajian} />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  )
}


function KajianCard({ kajian }: { kajian: KajianItem }) {
  const progressValue = (kajian.registered / kajian.capacity) * 100
  const isNearlyFull = progressValue > 85

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col gap-5 transition-all hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] h-full">
      <div className="flex justify-between items-start">
        <div className="text-4xl filter drop-shadow-sm bg-slate-50 p-3 rounded-2xl">
          {kajian.icon}
        </div>
        <Badge className={cn("rounded-full px-4 py-1.5 text-xs border-none font-semibold", kajian.badgeColor)}>
          {kajian.badgeText}
        </Badge>
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold text-slate-800 leading-tight">
          {kajian.title}
        </h3>
        <p className="text-base text-slate-500 font-medium">
          {kajian.ustadz}
        </p>
      </div>

      <div className="flex items-center gap-3 text-slate-500 mt-1">
        <div className="p-2 bg-rose-50 rounded-xl">
           <Calendar className="w-5 h-5 text-rose-500" />
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-bold text-slate-700">
            {kajian.date}
          </p>
          <p className="text-xs font-medium text-slate-400">
            {kajian.time}
          </p>
        </div>
      </div>

      <div className="space-y-3 mt-auto pt-4">
        <Progress 
          value={progressValue} 
          className="h-2 bg-slate-100" 
          indicatorClassName={isNearlyFull ? 'bg-rose-500' : 'bg-emerald-600'}
        />
        <p className="text-xs text-slate-400 font-semibold flex items-center gap-1.5">
          <span className="text-slate-600 font-extrabold text-sm">{kajian.registered}/{kajian.capacity}</span> jamaah terdaftar
        </p>
      </div>
    </div>
  )
}
