import { useEffect, useRef } from 'react'
import { AttributionControl, Map as LibreMap, Marker as LibreMarker, NavigationControl, type Marker } from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_ICON_FILES } from '../config'
import type { Place, UserLocation } from '../types'

interface MapViewProps {
  places: Place[]
  selected: Place | null
  onSelect: (place: Place) => void
  userLocation: UserLocation | null
}

export function createPlaceMarkerElement(place: Place, isSelected: boolean, onSelect: (place: Place) => void) {
  const button = document.createElement('button')
  button.type = 'button'
  button.className = `map-marker${isSelected ? ' is-selected' : ''}`
  button.style.transition = 'none'
  button.setAttribute('aria-label', `${place.name}，${place.iconType}`)

  const visual = document.createElement('span')
  visual.className = `map-pin map-pin--${place.collection}${isSelected ? ' is-selected' : ''}`
  const iconFile = MAP_ICON_FILES[place.iconType]
  if (iconFile) {
    const image = document.createElement('img')
    image.src = `${import.meta.env.BASE_URL}map-icons/${iconFile}.svg`
    image.alt = ''
    visual.append(image)
  } else {
    const fallback = document.createElement('span')
    fallback.textContent = place.icon
    visual.append(fallback)
  }
  button.append(visual)
  button.addEventListener('click', () => onSelect(place))
  return button
}

export function MapView({ places, selected, onSelect, userLocation }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LibreMap | null>(null)
  const markerRefs = useRef<Marker[]>([])
  const userMarkerRef = useRef<Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    const map = new LibreMap({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors'
          }
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }]
      },
      center: [108.223, 16.067],
      zoom: 12.1,
      attributionControl: false
    })
    map.addControl(new AttributionControl({ compact: true }), 'top-right')
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
    mapRef.current = map
    return () => { map.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return
    markerRefs.current.forEach((marker) => marker.remove())
    markerRefs.current = places.map((place) => {
      const button = createPlaceMarkerElement(place, selected?.id === place.id, onSelect)
      return new LibreMarker({ element: button, anchor: 'bottom' }).setLngLat([place.lng, place.lat]).addTo(map)
    })
  }, [places, selected, onSelect])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selected) return
    map.flyTo({ center: [selected.lng, selected.lat], zoom: Math.max(map.getZoom(), 14), offset: [0, -110], duration: 700 })
  }, [selected])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !userLocation) return
    if (!userMarkerRef.current) {
      const marker = document.createElement('div')
      marker.className = 'user-location-marker'
      marker.setAttribute('aria-label', '我的位置')
      userMarkerRef.current = new LibreMarker({ element: marker }).setLngLat([userLocation.lng, userLocation.lat]).addTo(map)
    } else userMarkerRef.current.setLngLat([userLocation.lng, userLocation.lat])
    map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14.5, duration: 800 })
  }, [userLocation])

  return <div className="map-canvas" ref={containerRef} aria-label="峴港餐廳地圖" />
}
