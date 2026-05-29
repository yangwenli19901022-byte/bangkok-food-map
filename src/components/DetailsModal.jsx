import React, { useEffect, useRef, useState } from 'react'

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

const categoryLabelMap = {
  restaurant: '餐厅',
  cafe: '咖啡馆',
  bar: '酒吧',
  streetfood: '街头美食',
  other: '本地推荐'
}

const categoryColors = {
  restaurant: '#b08b4f',
  cafe: '#1565c0',
  bar: '#7b1fa2',
  streetfood: '#e65100',
  other: '#836a55'
}

export default function DetailsModal({ place, onClose, isFavorite, onToggleFavorite, userLocation }) {
  const modalRef = useRef(null)
  const [currentPhoto, setCurrentPhoto] = useState(0)

  useEffect(() => {
    setCurrentPhoto(0)
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [place, onClose])

  if (!place) return null

  const photos = place.photos || []
  const distance = userLocation
    ? getDistanceKm(userLocation.lat, userLocation.lng, place.lat, place.lng)
    : null

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

  return (
    <div className="absolute inset-0 z-[2000] flex items-start justify-end p-4 pointer-events-none">
      <div
        ref={modalRef}
        className="pointer-events-auto w-full max-w-md max-h-[90vh] overflow-auto rounded-[32px] border border-[#d9c9a4] bg-[#fffdf8] shadow-[0_24px_80px_rgba(38,34,21,0.2)] backdrop-blur-md"
      >
        {/* Photo Carousel */}
        {photos.length > 0 && (
          <div className="relative">
            <div className="h-64 w-full overflow-hidden rounded-t-[32px] bg-[#f4efe6]">
              <img
                src={photos[currentPhoto]}
                alt={place.name}
                className="h-full w-full object-cover"
              />
            </div>
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentPhoto((i) => (i - 1 + photos.length) % photos.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                >
                  ‹
                </button>
                <button
                  onClick={() => setCurrentPhoto((i) => (i + 1) % photos.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white transition hover:bg-black/60"
                >
                  ›
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {photos.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPhoto(idx)}
                      className={`h-2 w-2 rounded-full transition ${idx === currentPhoto ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-2xl font-display font-semibold text-[#1f352f]">{place.name}</h2>
                {place.category && (
                  <span
                    className="rounded-full px-2.5 py-0.5 text-xs font-medium text-white"
                    style={{ backgroundColor: categoryColors[place.category] || categoryColors.other }}
                  >
                    {categoryLabelMap[place.category] || place.category}
                  </span>
                )}
              </div>
              {place.short && <p className="mt-2 text-sm text-[#716054] leading-relaxed">{place.short}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onToggleFavorite}
                className={`text-2xl leading-none transition ${isFavorite ? 'text-thai-gold' : 'text-[#d5c8b0] hover:text-thai-gold'}`}
                title={isFavorite ? '取消收藏' : '收藏'}
              >
                {isFavorite ? '★' : '☆'}
              </button>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#8a7a65] transition hover:bg-[#f0e6d6] hover:text-[#4a3825]"
                aria-label="关闭"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Source Badges */}
          {place.source && (
            <div className="mt-4 flex flex-wrap gap-2">
              {parseSourceItems(place.source).map(item => (
                <span key={item.raw} className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] ${sourceBadgeClasses[item.base] || sourceBadgeClasses.other}`}>
                  {formatSourceLabel(item)}
                </span>
              ))}
            </div>
          )}

          {/* Info Grid */}
          <div className="mt-6 space-y-4 rounded-3xl border border-[#f0e4cf] bg-[#fff9f2] p-5">
            {place.address && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">📍</span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-[#8a6f51]">地址</div>
                  <div className="mt-1 text-sm text-[#3d352f]">{place.address}</div>
                </div>
              </div>
            )}
            {distance != null && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">🧭</span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-[#8a6f51]">距离</div>
                  <div className="mt-1 text-sm text-[#3d352f]">
                    {distance < 1 ? `${(distance * 1000).toFixed(0)} 米` : `${distance.toFixed(1)} 公里`}
                  </div>
                </div>
              </div>
            )}
            {place.hours && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">🕒</span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-[#8a6f51]">营业时间</div>
                  <div className="mt-1 text-sm text-[#3d352f]">{place.hours}</div>
                </div>
              </div>
            )}
            {place.phone && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">📞</span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-[#8a6f51]">电话</div>
                  <div className="mt-1 text-sm text-[#3d352f]">{place.phone}</div>
                </div>
              </div>
            )}
            {place.avgPrice && (
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-lg">💰</span>
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-[#8a6f51]">人均消费</div>
                  <div className="mt-1 text-sm text-[#3d352f]">{place.avgPrice}</div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            {place.website && (
              <a
                href={place.website}
                target="_blank"
                rel="noreferrer"
                className="flex-1 rounded-2xl bg-thai-teal px-4 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-[#0b4f45]"
              >
                访问官网 / 预约
              </a>
            )}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 rounded-2xl border border-[#d8b57b] bg-white px-4 py-3 text-center text-sm font-semibold text-[#5d4a33] transition hover:bg-[#fff9f2]"
            >
              在地图中打开
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
