'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { fetchCategories, fetchProducts } from '../services/api'
import { norm } from '../services/normalizers'

import { Toolbar } from '../components/Toolbar'
import { ChipsRow } from '../components/ChipsRow'
import { ActiveChips } from '../components/ActiveChips'
import { FilterSheet } from '../components/FilterSheet'
import ProductCard from '../components/ProductCard'
import { Pager } from '../components/Pager'

export default function CatalogPage() {
  const [categories, setCategories] = useState([])
  const [q, setQ] = useState('')
  const [qDebounced, setQDebounced] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 6

  const [category, setCategory] = useState([])

  const [sheetOpen, setSheetOpen] = useState(false)
  const [tmpFilters, setTmpFilters] = useState({
    category: new Set(),
    brand: new Set(),
    price: new Set(),
    rating: new Set()
  })

  const [items, setItems] = useState([])
  const [total, setTotal] = useState(0)

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total, pageSize])

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchCategories()
        setCategories(Array.isArray(data.items) ? data.items : [])
      } catch {
        setCategories([])
      }
    }
    load()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setQDebounced((q || '').trim()), 250)
    return () => clearTimeout(t)
  }, [q])

  useEffect(() => {
    const toolbar = document.getElementById('toolbar')
    const container = document.querySelector('.container')
    if (!toolbar || !container) return
    const onScroll = () => {
      const y = container.scrollTop
      if (y > 24) toolbar.classList.add('chips-collapsed')
      else toolbar.classList.remove('chips-collapsed')
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [])

  async function loadProducts(nextPage = page) {
    try {
      const data = await fetchProducts({
        q: qDebounced,
        sort,
        page: nextPage,
        page_size: pageSize,
        category
      })

      const list = Array.isArray(data.items) ? data.items : []
      const cats = new Set(category)

      const filtered = cats.size
        ? list.filter((p) => cats.has(norm(p.category || '')))
        : list

      setItems(filtered)
      setTotal(Number.isFinite(data.total) ? data.total : filtered.length)
    } catch {
      setItems([])
      setTotal(0)
    }
  }

  useEffect(() => {
    setPage(1)
    loadProducts(1)
  }, [qDebounced, sort, category.join('|')])

  function goPrev() {
    if (page > 1) {
      const np = page - 1
      setPage(np)
      loadProducts(np)
    }
  }

  function goNext() {
    if (page < totalPages) {
      const np = page + 1
      setPage(np)
      loadProducts(np)
    }
  }

  function toggleCategory(id) {
    setCategory((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function clearCategories() {
    setCategory([])
  }

  function openSort() {
    const tg = window.Telegram?.WebApp
    const apply = (id) => {
      setSort(id)
      setPage(1)
      loadProducts(1)
    }

    try {
      if (tg?.isVersionAtLeast?.('6.2') && typeof tg.showPopup === 'function') {
        tg.showPopup(
          {
            title: 'Sort by',
            message: 'Choose sorting option',
            buttons: [
              { id: '', text: 'Relevance', type: 'default' },
              { id: 'price_asc', text: 'Price: Low → High', type: 'default' },
              { id: 'price_desc', text: 'Price: High → Low', type: 'default' },
              { id: 'rating_desc', text: 'Rating', type: 'default' },
              { id: 'cancel', text: 'Cancel', type: 'cancel' }
            ]
          },
          (buttonId) => {
            if (buttonId && buttonId !== 'cancel') apply(buttonId)
          }
        )
        return
      }
    } catch {}

    const map = { '1': '', '2': 'price_asc', '3': 'price_desc', '4': 'rating_desc' }
    const ans = window.prompt('Sort by:\n1) Relevance\n2) Price low high\n3) Price high low\n4) Rating', '1')
    const id = map[String(ans || '1')]
    apply(id)
  }

  function openSheet() {
    setTmpFilters({
      category: new Set(category),
      brand: new Set(),
      price: new Set(),
      rating: new Set()
    })
    setSheetOpen(true)
    requestAnimationFrame(() => {
      document.getElementById('filterSheet')?.classList.remove('hidden')
      document.getElementById('filterBackdrop')?.classList.remove('hidden')
    })
  }

  function closeSheet() {
    setSheetOpen(false)
    document.getElementById('filterSheet')?.classList.add('hidden')
    document.getElementById('filterBackdrop')?.classList.add('hidden')
  }

  function onClear() {
    setTmpFilters({
      category: new Set(),
      brand: new Set(),
      price: new Set(),
      rating: new Set()
    })
  }

  function onApply() {
    setCategory(Array.from(tmpFilters.category))
    setPage(1)
    closeSheet()
  }

  function toggleTmp(group, id) {
    setTmpFilters((prev) => {
      const next = { ...prev, [group]: new Set(prev[group]) }
      if (next[group].has(id)) next[group].delete(id)
      else next[group].add(id)
      return next
    })
  }

  return (
    <>
      <header id="toolbar" className="sticky safe-top z-30 bg-white/95 backdrop-blur border-b border-[var(--border)]">
        <div className="pt-2 pb-3">
          <Toolbar q={q} onChangeQ={setQ} onOpenFilters={openSheet} sort={sort} onOpenSort={openSort} />
          <ChipsRow categories={categories} selected={category} onToggle={toggleCategory} onClear={clearCategories} />
          <ActiveChips selected={category} onRemove={toggleCategory} />
        </div>
      </header>

      <section className="mt-4">
        <div className="grid grid-cols-2 gap-4 overflow-y-auto scrollbar-none">
          {items.length === 0 && (
            <div className="col-span-2 text-center text-[13px] text-[var(--muted)]">No results</div>
          )}
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <div className="flex items-center justify-between mt-6">
        <Pager page={page} totalPages={totalPages} onPrev={goPrev} onNext={goNext} />
      </div>

      <footer className="pt-6 text-center text-[12px] text-[var(--muted)]">
        © Lyvo Shop
      </footer>

      <FilterSheet
        open={sheetOpen}
        categories={categories}
        tmpFilters={tmpFilters}
        toggleTmp={toggleTmp}
        onClear={onClear}
        onApply={onApply}
        onClose={closeSheet}
      />
    </>
  )
}