import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'

// Fix default icon paths for bundlers (Vite/Webpack)
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
})

const categoryColors = {
  restaurant: '#b08b4f',
  cafe: '#1565c0',
  bar: '#7b1fa2',
  streetfood: '#e65100',
  other: '#0d6554',
}

function createCustomIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width:28px;height:28px;border-radius:50%;
      background:${color};border:3px solid #fff;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      display:flex;align-items:center;justify-content:center;
    "><div style="width:8px;height:8px;background:#fff;border-radius:50%;"></div></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14],
  })
}

export default function Map({ markers = [], onReady, activeId }){
  const mapRef = useRef(null)
  const containerRef = useRef(null)
  const apiRef = useRef(null)
  const pendingActiveIdRef = useRef(null)

  function formatSourceBadges(source){
    const labels = {
      michelin: '米其林推荐',
      asia50: '亚洲前50榜',
      blackpearl: '黑珍珠榜',
      other: '本地推荐'
    }
    const items = Array.isArray(source) ? source : (typeof source === 'string' ? source.split(',') : [])
    return items.map(item => item.trim()).filter(Boolean).map(item => {
      const parts = item.split('-')
      const parsed = parts.length > 1 && /^\d{4}$/.test(parts[0]) ? { year: parts[0], base: parts.slice(1).join('-') } : { year: null, base: item }
      const label = parsed.year && parsed.base !== 'other' ? `${parsed.year}${labels[parsed.base] || parsed.base}` : (labels[parsed.base] || parsed.base)
      const color = parsed.base === 'michelin' ? '#b08b4f' : parsed.base === 'asia50' ? '#1565c0' : parsed.base === 'blackpearl' ? '#7b1fa2' : '#d8b192'
      const textColor = parsed.base === 'other' ? '#4a3825' : '#ffffff'
      return `<span style="display:inline-block;margin-right:6px;margin-top:6px;padding:4px 10px;border-radius:999px;background:${color};color:${textColor};font-size:0.8rem;font-weight:600;">${label}</span>`
    }).join('')
  }

  function buildBasicPopupHtml(place){
    return `<strong>${place.name}</strong><br/>${place.address || place.short || ''}${formatSourceBadges(place.source) ? `<div style="margin-top:8px">${formatSourceBadges(place.source)}</div>` : ''}`
  }

  function buildCarouselHtml(photos){
    if (!Array.isArray(photos) || !photos.length) return ''
    const photoItems = photos.map((url, index) => `
      <img src="${url}" data-carousel-image="${index}" style="display:${index === 0 ? 'block' : 'none'};width:100%;height:180px;object-fit:cover;border-radius:18px;" />
    `).join('')
    return `
      <div style="position:relative;margin-bottom:12px;border-radius:18px;overflow:hidden;background:#f4efe6;">
        ${photoItems}
        ${photos.length > 1 ? `<button data-carousel-prev style="position:absolute;top:50%;left:10px;transform:translateY(-50%);border:none;background:rgba(0,0,0,0.4);color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;">‹</button>
        <button data-carousel-next style="position:absolute;top:50%;right:10px;transform:translateY(-50%);border:none;background:rgba(0,0,0,0.4);color:#fff;width:32px;height:32px;border-radius:50%;cursor:pointer;">›</button>` : ''}
      </div>
    `
  }

  function buildDetailPopupHtml(place){
    const details = place.details || place
    const photoHtml = buildCarouselHtml(details.photos)
    const extraRows = []
    if (details.avgPrice) extraRows.push(`<div style="margin-top:8px;font-size:0.9rem;color:#4f4537;">人均：${details.avgPrice}</div>`)
    if (details.hours) extraRows.push(`<div style="margin-top:6px;font-size:0.9rem;color:#4f4537;">营业时间：${details.hours}</div>`)
    if (details.phone) extraRows.push(`<div style="margin-top:6px;font-size:0.9rem;color:#4f4537;">电话：${details.phone}</div>`)
    const websiteRow = details.website ? `<a href="${details.website}" target="_blank" rel="noreferrer" style="display:inline-block;margin-top:10px;padding:8px 12px;border-radius:999px;background:#1f5f48;color:#fff;text-decoration:none;font-size:0.85rem;">访问官网/预约</a>` : ''
    return `
      <div style="max-width:300px;font-family:sans-serif;color:#2d3c35;">
        ${photoHtml}
        <div style="padding:0 2px;">
          <div style="font-size:1rem;font-weight:700;margin-bottom:6px;color:#1f352f;">${place.name}</div>
          ${place.short ? `<div style="font-size:0.9rem;color:#5f5f47;margin-bottom:10px;">${place.short}</div>` : ''}
          ${formatSourceBadges(place.source) ? `<div style="margin-bottom:10px">${formatSourceBadges(place.source)}</div>` : ''}
          <div style="font-size:0.9rem;color:#5f5f47;line-height:1.5;">${place.address || ''}</div>
          ${extraRows.join('')}
          ${websiteRow}
        </div>
      </div>
    `
  }

  function attachCarouselControls(container){
    if (!container) return
    const carousel = container.querySelector('[data-carousel-prev]')
    const next = container.querySelector('[data-carousel-next]')
    const images = Array.from(container.querySelectorAll('[data-carousel-image]'))
    if (!images.length || !carousel || !next) return
    let activeIndex = images.findIndex(img => img.style.display !== 'none')
    if (activeIndex === -1) activeIndex = 0
    const update = (newIndex) => {
      images.forEach((img, idx) => {
        img.style.display = idx === newIndex ? 'block' : 'none'
      })
      activeIndex = newIndex
    }
    carousel.onclick = () => update((activeIndex - 1 + images.length) % images.length)
    next.onclick = () => update((activeIndex + 1) % images.length)
  }

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = L.map(containerRef.current, {
      center: [13.7563, 100.5018],
      zoom: 12,
      zoomControl: false,
    })
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)
    mapRef.current = map

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers
  useEffect(()=>{
    const map = mapRef.current
    if (!map) return
    if (map._markerGroup) map.removeLayer(map._markerGroup)
    const group = L.layerGroup()
    const markersMap = new Map()
    markers.forEach(m => {
      if (!m.lat || !m.lng) return
      const color = categoryColors[m.category] || categoryColors.other
      const icon = createCustomIcon(color)
      const marker = L.marker([m.lat, m.lng], { icon })
      if (m.name) marker.bindPopup(buildBasicPopupHtml(m))
      marker.on('popupopen', e => {
        attachCarouselControls(e.popup.getElement())
      })
      marker.addTo(group)
      if (m.id != null) markersMap.set(String(m.id), marker)
    })
    group.addTo(map)
    map._markerGroup = group
    map._markersMap = markersMap

    const api = {
      map,
      markersMap,
      openDetailPopup: id => {
        const marker = markersMap.get(String(id))
        const place = markers.find(item => item.id === id)
        if (!marker || !place) return
        marker.bindPopup(buildDetailPopupHtml(place))
        marker.openPopup()
        if (place.lat && place.lng) {
          map.setView([place.lat, place.lng], 15, { animate: true })
        }
      }
    }
    apiRef.current = api
    if (typeof onReady === 'function') onReady(api)
    // Handle pending activeId
    if (pendingActiveIdRef.current != null) {
      api.openDetailPopup(pendingActiveIdRef.current)
      pendingActiveIdRef.current = null
    }
  }, [markers, onReady])

  // Handle activeId changes
  useEffect(() => {
    if (activeId != null) {
      if (apiRef.current) {
        apiRef.current.openDetailPopup(activeId)
      } else {
        pendingActiveIdRef.current = activeId
      }
    }
  }, [activeId])

  return (
    <div className="h-full w-full rounded-lg overflow-hidden">
      <div ref={containerRef} id="map" className="h-full w-full" style={{minHeight: 400}} />
    </div>
  )
}
