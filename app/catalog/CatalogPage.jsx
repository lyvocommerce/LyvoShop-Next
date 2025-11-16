import React, { useEffect, useMemo, useState } from 'react';
import { fetchCategories, fetchProducts } from '../services/api.js';
import { norm } from '../services/normalizers.js';

import { Toolbar } from '../components/Toolbar.jsx';
import { ChipsRow } from '../components/ChipsRow.jsx';
import { ActiveChips } from '../components/ActiveChips.jsx';
import { FilterSheet } from '../components/FilterSheet.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { Pager } from '../components/Pager.jsx';

export function CatalogPage() {
  // ---- data/state ----
  const [categories, setCategories] = useState([]);   // список строк
  const [q, setQ] = useState('');                     // текст поиска (живой)
  const [qDebounced, setQDebounced] = useState('');   // дебаунс-версия (250 мс)
  const [sort, setSort] = useState('');               // '', 'price_asc', 'price_desc', 'rating_desc'
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // мультивыбор категорий
  const [category, setCategory] = useState([]);       // массив нормализованных id

  // фильтр-шторка: временные значения (до Apply)
  const [sheetOpen, setSheetOpen] = useState(false);
  const [tmpFilters, setTmpFilters] = useState({
    category: new Set(),
    brand: new Set(),
    price: new Set(),
    rating: new Set(),
  });

  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / pageSize)),
    [total, pageSize]
  );

  // ---- init: загрузка категорий ----
  useEffect(() => {
    (async () => {
      try {
        const data = await fetchCategories();
        setCategories(Array.isArray(data.items) ? data.items : []);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // ---- debounce поиска ----
  useEffect(() => {
    const t = setTimeout(() => setQDebounced((q || '').trim()), 250);
    return () => clearTimeout(t);
  }, [q]);

  // ---- коллапс чипсов при скролле (как в исходнике) ----
  useEffect(() => {
    const toolbar = document.getElementById('toolbar');
    const container = document.querySelector('.container');
    if (!toolbar || !container) return;
    const onScroll = () => {
      const y = container.scrollTop;
      if (y > 24) toolbar.classList.add('chips-collapsed');
      else toolbar.classList.remove('chips-collapsed');
    };
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => container.removeEventListener('scroll', onScroll);
  }, []);

  // ---- загрузка товаров ----
  async function loadProducts(nextPage = page) {
    try {
      const data = await fetchProducts({
        q: qDebounced,
        sort,
        page: nextPage,
        page_size: pageSize,
        category, // отправляем массив
      });
      const list = Array.isArray(data.items) ? data.items : [];

      // fallback: если бэк игнорирует категории — фильтруем на клиенте
      const cats = new Set(category);
      const filtered = cats.size
        ? list.filter((p) => cats.has(norm(p.category || '')))
        : list;

      setItems(filtered);
      setTotal(Number.isFinite(data.total) ? data.total : filtered.length);
    } catch {
      setItems([]);
      setTotal(0);
    }
  }

  // ---- реакция на изменение поиска/сортировки/категорий ----
  useEffect(() => {
    setPage(1);
    loadProducts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced, sort, category.join('|')]);

  // ---- pager ----
  function goPrev() {
    if (page > 1) {
      const np = page - 1;
      setPage(np);
      loadProducts(np);
    }
  }
  function goNext() {
    if (page < totalPages) {
      const np = page + 1;
      setPage(np);
      loadProducts(np);
    }
  }

  // ---- chips ----
  function toggleCategory(id) {
    setCategory((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }
  function clearCategories() {
    setCategory([]);
  }

  // ---- сортировка (Telegram popup + fallback) ----
  function openSort() {
    const tg = window.Telegram?.WebApp;

    const applyChoice = (id) => {
      if (['', 'price_asc', 'price_desc', 'rating_desc'].includes(id)) {
        setSort(id);
        setPage(1);
        loadProducts(1);
      }
    };

    const openFallbackPrompt = () => {
      const map = { '1': '', '2': 'price_asc', '3': 'price_desc', '4': 'rating_desc' };
      const ans = window.prompt(
        'Sort by:\n1) Relevance\n2) Price: Low → High\n3) Price: High → Low\n4) Rating',
        '1'
      );
      const id = map[String(ans || '1')];
      applyChoice(id);
    };

    // ✅ Безопасная проверка версии Telegram WebApp + отлавливаем ошибки
    try {
      const supportsPopup =
        tg &&
        (typeof tg.isVersionAtLeast === 'function'
          ? tg.isVersionAtLeast('6.2')           // showPopup стабильно с 6.2+
          : false);

      if (supportsPopup && typeof tg.showPopup === 'function') {
        tg.showPopup(
          {
            title: 'Sort by',
            message: 'Choose sorting option',
            buttons: [
              { id: '',           type: 'default', text: 'Relevance' },
              { id: 'price_asc',  type: 'default', text: 'Price: Low → High' },
              { id: 'price_desc', type: 'default', text: 'Price: High → Low' },
              { id: 'rating_desc',type: 'default', text: 'Rating' },
              { id: 'cancel',     type: 'cancel' }
            ],
          },
          (buttonId) => {
            if (buttonId && buttonId !== 'cancel') applyChoice(buttonId);
          }
        );
        return;
      }
    } catch (e) {
      console.warn('showPopup unsupported, falling back:', e);
    }

    // 🔁 Фолбэк для старых клиентов Telegram и обычного браузера
    openFallbackPrompt();
  }

  // ---- filter sheet handlers ----
  function openSheet() {
    setTmpFilters({
      category: new Set(category),
      brand: new Set(),
      price: new Set(),
      rating: new Set(),
    });
    setSheetOpen(true);

    // совместимость с bottomsheet-lock.js
    requestAnimationFrame(() => {
      document.getElementById('filterSheet')?.classList.remove('hidden');
      document.getElementById('filterBackdrop')?.classList.remove('hidden');
    });
  }
  function closeSheet() {
    setSheetOpen(false);
    document.getElementById('filterSheet')?.classList.add('hidden');
    document.getElementById('filterBackdrop')?.classList.add('hidden');
  }
  function onClear() {
    setTmpFilters({
      category: new Set(),
      brand: new Set(),
      price: new Set(),
      rating: new Set(),
    });
  }
  function onApply() {
    setCategory(Array.from(tmpFilters.category)); // применяем выбранные категории
    setPage(1);
    closeSheet();
  }
  function toggleTmp(group, id) {
    setTmpFilters((prev) => {
      const next = { ...prev, [group]: new Set(prev[group]) };
      if (next[group].has(id)) next[group].delete(id);
      else next[group].add(id);
      return next;
    });
  }

  return (
    <>
      {/* Sticky header: поиск + сортировка + фильтр + чипсы */}
      <header
        id="toolbar"
        className="sticky safe-top z-30 bg-white/95 backdrop-blur border-b border-[var(--border)]"
      >
        <div className="pt-2 pb-3">
          <Toolbar
            q={q}
            onChangeQ={setQ}
            onOpenFilters={openSheet}
            sort={sort}
            onOpenSort={openSort}
          />

          <ChipsRow
            categories={categories}
            selected={category}
            onToggle={toggleCategory}
            onClear={clearCategories}
          />

          <ActiveChips selected={category} onRemove={toggleCategory} />
        </div>
      </header>

      {/* Сетка товаров */}
      <section className="mt-4">
        <div id="grid" className="grid grid-cols-2 gap-4 overflow-y-auto scrollbar-none">
          {items.length === 0 && (
            <div className="col-span-2 text-center text-[13px] text-[var(--muted)]">
              No results
            </div>
          )}
          {items.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Пагинация */}
      <div className="flex items-center justify-between mt-6">
        <Pager page={page} totalPages={totalPages} onPrev={goPrev} onNext={goNext} />
      </div>

      {/* Футер */}
      <footer className="pt-6 text-center text-[12px] text-[var(--muted)]">© Lyvo Shop.</footer>

      {/* Шторка фильтров */}
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
  );
}