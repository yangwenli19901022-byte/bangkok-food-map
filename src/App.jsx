import React, { useEffect, useMemo, useRef, useState } from 'react'
import Map from './components/Map'
import DetailsModal from './components/DetailsModal'
import defaultMarkers from './data/places.json'

const STORAGE_KEY = 'bangkok-map-markers'
const FAVORITES_KEY = 'bangkok-map-favorites'

const categoryConfig = {
  all: { label: '全部', color: '#0d6554' },
  restaurant: { label: '餐厅', color: '#b08b4f' },
  cafe: { label: '咖啡馆', color: '#1565c0' },
  bar: { label: '酒吧', color: '#7b1fa2' },
  streetfood: { label: '街头美食', color: '#e65100' },
  other: { label: '本地推荐', color: '#836a55' },
}

function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export default function App() {
  const [markers, setMarkers] = useState(() => {
    if (typeof window === 'undefined') return defaultMarkers
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : defaultMarkers
    } catch {
      return defaultMarkers
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(markers))
  }, [markers])

  const [favorites, setFavorites] = useState(() => {
    if (typeof window === 'undefined') return []
    try {
      const saved = window.localStorage.getItem(FAVORITES_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  }, [favorites])

  const [userLocation, setUserLocation] = useState(null)
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      pos => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => {},
      { enableHighAccuracy: false, timeout: 10000 }
    )
  }, [])

  const mapApiRef = useRef(null)
  const [editingId, setEditingId] = useState(null)
  const [draftAddress, setDraftAddress] = useState('')
  const [activeCardId, setActiveCardId] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [sortMode, setSortMode] = useState('default')
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [newPlace, setNewPlace] = useState({
    name: '',
    short: '',
    address: '',
    lat: '',
    lng: '',
    category: 'other'
  })

  function toggleFavorite(id, e) {
    if (e) e.stopPropagation()
    setFavorites(prev => {
      const set = new Set(prev)
      if (set.has(id)) set.delete(id)
      else set.add(id)
      return Array.from(set)
    })
  }

  function startEdit(p) {
    setEditingId(p.id)
    setDraftAddress(p.address || '')
  }

  function cancelEdit() { setEditingId(null); setDraftAddress('') }

  function saveEdit(id, name) {
    const place = markers.find(m => m.id === id)
    const source = place?.source
    setMarkers(ms => ms.map(m => m.id === id ? { ...m, address: draftAddress } : m))
    setEditingId(null)
    const api = mapApiRef.current
    if (api && api.markersMap && api.markersMap.has(String(id))) {
      const marker = api.markersMap.get(String(id))
      if (marker) {
        marker.bindPopup(getPopupHtml(name, draftAddress, source))
        marker.openPopup()
      }
    }
    setDraftAddress('')
  }

  function handleEditKeyDown(evt, id, name) {
    if (evt.key === 'Enter') {
      evt.preventDefault()
      saveEdit(id, name)
    }
    if (evt.key === 'Escape') {
      evt.preventDefault()
      cancelEdit()
    }
  }

  function handleNewKeyDown(evt) {
    if (evt.key === 'Enter') {
      evt.preventDefault()
      addNewPlace()
    }
  }

  function addNewPlace() {
    if (!newPlace.name.trim() || !newPlace.lat.trim() || !newPlace.lng.trim()) return
    const nextId = markers.reduce((max, p) => Math.max(max, p.id), 0) + 1
    const next = {
      id: nextId,
      name: newPlace.name.trim(),
      short: newPlace.short.trim(),
      address: newPlace.address.trim(),
      lat: Number(newPlace.lat),
      lng: Number(newPlace.lng),
      category: newPlace.category || 'other',
      source: 'other'
    }
    setMarkers(ms => [...ms, next])
    setNewPlace({ name: '', short: '', address: '', lat: '', lng: '', category: 'other' })
    const api = mapApiRef.current
    if (api && api.map) {
      api.map.setView([next.lat, next.lng], 15, { animate: true })
    }
    setActiveCardId(nextId)
  }

  function handleCardClick(place) {
    const api = mapApiRef.current
    if (!api || !api.map) return
    const { map } = api
    if (place.lat && place.lng) {
      map.setView([place.lat, place.lng], 15, { animate: true })
    }
    setActiveCardId(place.id)
  }

  function openDetails(place) {
    setSelectedPlace(place)
    handleCardClick(place)
  }

  const normalizedSearch = search.trim().toLowerCase()
  const filteredMarkers = useMemo(() => {
    let result = [...markers]
    if (normalizedSearch) {
      result = result.filter(place => {
        const target = [place.name, place.short, place.address].join(' ').toLowerCase()
        return target.includes(normalizedSearch)
      })
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory)
    }
    if (showFavoritesOnly) {
      result = result.filter(p => favorites.includes(p.id))
    }
    if (sortMode === 'distance' && userLocation) {
      result = result.map(p => ({
        ...p,
        _distance: getDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng)
      })).sort((a, b) => a._distance - b._distance)
    } else if (sortMode === 'name') {
      result = result.sort((a, b) => a.name.localeCompare(b.name))
    }
    return result
  }, [markers, normalizedSearch, selectedCategory, showFavoritesOnly, favorites, sortMode, userLocation])

  const sourceLabelMap = {
    michelin: '米其林推荐',
    asia50: '亚洲前50榜',
    blackpearl: '黑珍珠榜',
    other: '本地推荐'
  }

  const sourceBadgeClasses = {
    michelin: 'bg-[#b08b4f] text-white',
    asia50: 'bg-[#1565c0] text-white',
    blackpearl: 'bg-[#7b1fa2] text-white',
    other: 'bg-[#f0e0cc] text-[#4a3825]'
  }

  function parseSourceItems(source) {
    const items = Array.isArray(source) ? source : (typeof source === 'string' ? source.split(',') : [])
    return items.map(item => item.trim()).filter(Boolean).map(item => {
      const parts = item.split('-')
      if (parts.length > 1 && /^\d{4}$/.test(parts[0])) {
        return { raw: item, year: parts[0], base: parts.slice(1).join('-') }
      }
      return { raw: item, year: null, base: item }
    })
  }

  function formatSourceLabel(item) {
    const baseLabel = sourceLabelMap[item.base] || item.base
    if (item.year && item.base !== 'other') {
      return `${item.year}${baseLabel}`
    }
    return baseLabel
  }

  function getSourceBadges(source) {
    return parseSourceItems(source).map(item => (
      <span key={item.raw} className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${sourceBadgeClasses[item.base] || sourceBadgeClasses.other}`}>
        {formatSourceLabel(item)}
      </span>
    ))
  }

  function getPopupHtml(name, address, source) {
    const badgeHtml = parseSourceItems(source).map(item => {
      const color = item.base === 'michelin' ? '#b08b4f' : item.base === 'asia50' ? '#1565c0' : item.base === 'blackpearl' ? '#7b1fa2' : '#d8b192'
      const textColor = item.base === 'other' ? '#4a3825' : '#ffffff'
      return `<span style="display:inline-block;margin-right:6px;margin-top:6px;padding:4px 10px;border-radius:999px;background:${color};color:${textColor};font-size:0.8rem;font-weight:600;">${formatSourceLabel(item)}</span>`
    }).join('')
    return `<strong>${name}</strong><br/>${address || ''}${badgeHtml ? `<div style="margin-top:8px">${badgeHtml}</div>` : ''}`
  }

  const favCount = favorites.length

  return (
    <div className="min-h-screen bg-paper text-thai-dark font-ui">
      <div className="max-w-7xl mx-auto h-screen grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 px-4 py-6 lg:px-0">
        <aside className="rounded-[32px] border border-[#d9c9a4] bg-white/95 p-6 shadow-[0_20px_60px_rgba(32,30,24,0.12)] backdrop-blur-sm flex flex-col">
          <div className="mb-5 border-b border-[#e2d5ba] pb-4">
            <p className="text-sm uppercase tracking-[0.35em] text-[#8a6f51]">曼谷风味</p>
            <h1 className="mt-3 text-3xl font-display font-semibold tracking-[0.02em] text-[#1f352f]">曼谷美食咖啡地图</h1>
            <p className="mt-3 text-sm leading-6 text-[#716054]">从复古咖啡馆到小巷夜市，搜索并点击卡片即可在地图中定位。</p>
          </div>

          {/* Search */}
          <div className="mb-4 rounded-3xl border border-[#f0e4cf] bg-[#fff9f2] p-4 text-sm text-[#5f4f3d] shadow-[inset_0_0_0_1px_rgba(234,221,190,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#5d4a33]">搜索地点</span>
              <span className="text-xs uppercase tracking-[0.18em]">快捷</span>
            </div>
            <input
              className="mt-3 w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none transition focus:border-thai-teal"
              placeholder="输入咖啡馆、夜市或街区"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-sm font-semibold text-[#5d4a33]">分类筛选</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryConfig).map(([key, cfg]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    selectedCategory === key
                      ? 'text-white shadow-sm'
                      : 'bg-[#f5efe6] text-[#6b5a45] hover:bg-[#ebe0d0]'
                  }`}
                  style={selectedCategory === key ? { backgroundColor: cfg.color } : {}}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort & Favorites */}
          <div className="mb-4 flex items-center gap-2 flex-wrap">
            <select
              value={sortMode}
              onChange={e => setSortMode(e.target.value)}
              className="rounded-2xl border border-[#d8b57b] bg-white px-3 py-2 text-sm text-[#3a372f] outline-none"
            >
              <option value="default">默认排序</option>
              <option value="distance">距离最近</option>
              <option value="name">名称排序</option>
            </select>
            <button
              onClick={() => setShowFavoritesOnly(v => !v)}
              className={`rounded-2xl px-4 py-2 text-sm font-medium transition flex items-center gap-1.5 ${
                showFavoritesOnly
                  ? 'bg-thai-gold text-white'
                  : 'bg-[#f5efe6] text-[#6b5a45] hover:bg-[#ebe0d0]'
              }`}
            >
              <span>{showFavoritesOnly ? '★' : '☆'}</span>
              收藏{favCount > 0 ? ` (${favCount})` : ''}
            </button>
          </div>

          {/* Place List */}
          <div className="space-y-3 flex-1 overflow-y-auto pr-1 scrollbar-thin min-h-0">
            {filteredMarkers.length ? filteredMarkers.map((p) => {
              const isFav = favorites.includes(p.id)
              const distance = userLocation && p._distance
                ? `${p._distance < 1 ? (p._distance * 1000).toFixed(0) + 'm' : p._distance.toFixed(1) + 'km'}`
                : null
              return (
                <div
                  key={p.id}
                  className={`group rounded-3xl border px-4 py-4 transition ${activeCardId === p.id ? 'border-thai-teal/70 bg-[#eef7f2]' : 'border-[#ece0d1] bg-white'} shadow-sm hover:shadow-md`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <button type="button" onClick={() => handleCardClick(p)} className="text-left flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-semibold text-[#25322f] truncate">{p.name}</h3>
                        {distance && <span className="text-xs text-[#8a6f51] whitespace-nowrap">{distance}</span>}
                      </div>
                      <p className="mt-1 text-sm leading-6 text-[#726855]">{p.short}</p>
                    </button>
                    <div className="flex flex-col items-end gap-1">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(p.id, e)}
                        className={`text-lg leading-none transition ${isFav ? 'text-thai-gold' : 'text-[#d5c8b0] hover:text-thai-gold'}`}
                        title={isFav ? '取消收藏' : '收藏'}
                      >
                        {isFav ? '★' : '☆'}
                      </button>
                      <button
                        type="button"
                        onClick={() => startEdit(p)}
                        className="text-sm font-medium text-thai-teal transition hover:text-thai-gold"
                      >编辑</button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {getSourceBadges(p.source)}
                    {p.category && p.category !== 'other' && (
                      <span className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] bg-[#e8f4f8] text-[#1565c0]">
                        {categoryConfig[p.category]?.label || p.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-3 text-sm text-[#695f53]">
                    <span className="truncate">{p.address}</span>
                    <span className="rounded-full bg-[#f7ede0] px-3 py-1 text-[#8a6f51] whitespace-nowrap">#{p.id}</span>
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => openDetails(p)}
                      className="text-xs font-medium text-thai-teal hover:text-thai-gold transition"
                    >
                      查看详情 →
                    </button>
                  </div>
                  {editingId === p.id && (
                    <div className="mt-4 space-y-3">
                      <input
                        className="w-full rounded-2xl border border-[#d5c2a0] bg-[#fffdf8] px-3 py-2 text-sm text-[#3d352f] outline-none"
                        value={draftAddress}
                        onChange={e => setDraftAddress(e.target.value)}
                        onKeyDown={e => handleEditKeyDown(e, p.id, p.name)}
                        placeholder="输入新地址，Enter 保存，Esc 取消"
                      />
                      <div className="flex justify-end gap-2">
                        <button onClick={cancelEdit} className="rounded-full border border-[#c3b090] px-4 py-2 text-sm text-[#7d6d57]">取消</button>
                        <button onClick={() => saveEdit(p.id, p.name)} className="rounded-full bg-thai-teal px-4 py-2 text-sm font-semibold text-white">保存</button>
                      </div>
                    </div>
                  )}
                </div>
              )
            }) : (
              <div className="rounded-3xl border border-[#eedfc5] bg-[#fff8ee] p-5 text-sm text-[#705b45]">
                未找到匹配地点，请尝试其他关键词或筛选条件。
              </div>
            )}
          </div>

          {/* Add New Place */}
          <div className="mt-4 rounded-3xl border border-[#f0e4cf] bg-[#fff9f2] p-4 text-sm text-[#5f4f3d] shadow-[inset_0_0_0_1px_rgba(234,221,190,0.8)]">
            <div className="flex items-center justify-between gap-3">
              <span className="font-semibold text-[#5d4a33]">新增地点</span>
              <span className="text-xs uppercase tracking-[0.18em]">自定义</span>
            </div>
            <div className="mt-4 space-y-3">
              <input
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                placeholder="地点名称"
                value={newPlace.name}
                onChange={e => setNewPlace(prev => ({ ...prev, name: e.target.value }))}
                onKeyDown={handleNewKeyDown}
              />
              <input
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                placeholder="一句话描述（可选）"
                value={newPlace.short}
                onChange={e => setNewPlace(prev => ({ ...prev, short: e.target.value }))}
                onKeyDown={handleNewKeyDown}
              />
              <input
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                placeholder="地址"
                value={newPlace.address}
                onChange={e => setNewPlace(prev => ({ ...prev, address: e.target.value }))}
                onKeyDown={handleNewKeyDown}
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                  placeholder="纬度"
                  value={newPlace.lat}
                  onChange={e => setNewPlace(prev => ({ ...prev, lat: e.target.value }))}
                  onKeyDown={handleNewKeyDown}
                />
                <input
                  className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                  placeholder="经度"
                  value={newPlace.lng}
                  onChange={e => setNewPlace(prev => ({ ...prev, lng: e.target.value }))}
                  onKeyDown={handleNewKeyDown}
                />
              </div>
              <select
                className="w-full rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-sm text-[#3a372f] outline-none"
                value={newPlace.category}
                onChange={e => setNewPlace(prev => ({ ...prev, category: e.target.value }))}
              >
                {Object.entries(categoryConfig).filter(([k]) => k !== 'all').map(([k, cfg]) => (
                  <option key={k} value={k}>{cfg.label}</option>
                ))}
              </select>
              <button
                onClick={addNewPlace}
                className="w-full rounded-2xl bg-thai-teal px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b4f45]"
              >添加地点</button>
              <p className="text-xs leading-5 text-[#7a6652]">请输入名称和坐标后点击添加，地点会保存到浏览器本地存储。</p>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 rounded-[28px] border border-[#e7d9c2] bg-[#fcfaf6] p-5 shadow-[0_8px_30px_rgba(111,92,63,0.08)]">
            <div className="flex items-center justify-between gap-3 text-sm text-[#6f5f4a]">
              <span>当前地点数量</span>
              <span className="font-semibold text-[#2b3b33]">{filteredMarkers.length} / {markers.length}</span>
            </div>
            {userLocation && (
              <div className="mt-2 text-xs text-[#8a7a65]">
                已获取您的位置，可按距离排序
              </div>
            )}
          </div>

          <div className="mt-4 rounded-3xl border border-[#f0e1c6] bg-[#fff8f1] p-5 text-xs leading-6 text-[#7a6652]">
            Tip: 点击列表卡片可快速定位地图，☆ 收藏地点，查看详情可浏览更多信息。
          </div>
        </aside>

        <main className="relative rounded-[40px] border border-[#d7c4a4] bg-[#fbf6ef] p-3 shadow-[0_24px_80px_rgba(38,34,21,0.12)]">
          <div className="h-full rounded-[32px] overflow-hidden border border-[#f0e0c8] bg-white shadow-[inset_0_0_0_1px_rgba(223,203,160,0.24)]">
            <Map markers={filteredMarkers} onReady={api => (mapApiRef.current = api)} activeId={activeCardId} />
          </div>
          {selectedPlace && (
            <DetailsModal
              place={selectedPlace}
              onClose={() => setSelectedPlace(null)}
              isFavorite={favorites.includes(selectedPlace.id)}
              onToggleFavorite={() => toggleFavorite(selectedPlace.id)}
              userLocation={userLocation}
            />
          )}
        </main>
      </div>
    </div>
  )
}
