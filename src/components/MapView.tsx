import { useEffect, useRef } from 'react'
import {
  AttributionControl,
  Map as LibreMap,
  NavigationControl,
  type GeoJSONSource,
  type MapLayerMouseEvent,
  type SymbolLayerSpecification
} from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MAP_ICON_FILES } from '../config'
import type { Place, UserLocation } from '../types'

interface MapViewProps {
  places: Place[]
  selected: Place | null
  onSelect: (place: Place) => void
  userLocation: UserLocation | null
}

interface RestaurantMarkerProperties {
  placeId: string
  imageId: string
  selected: boolean
}

interface RestaurantFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    id: string
    geometry: { type: 'Point'; coordinates: [number, number] }
    properties: RestaurantMarkerProperties
  }>
}

interface UserLocationFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
    geometry: { type: 'Point'; coordinates: [number, number] }
    properties: Record<string, never>
  }>
}

const RESTAURANT_SOURCE_ID = 'restaurant-places'
const RESTAURANT_LAYER_ID = 'restaurant-pins'
const SELECTED_RESTAURANT_LAYER_ID = 'restaurant-pins-selected'
const USER_LOCATION_SOURCE_ID = 'user-location'
const USER_LOCATION_HALO_LAYER_ID = 'user-location-halo'
const USER_LOCATION_DOT_LAYER_ID = 'user-location-dot'

export const RESTAURANT_LAYER_IDS = [RESTAURANT_LAYER_ID, SELECTED_RESTAURANT_LAYER_ID] as const

export function restaurantMarkerImageId(place: Pick<Place, 'collection' | 'iconType'>) {
  const iconFile = MAP_ICON_FILES[place.iconType] ?? 'vietnam'
  return `restaurant-pin-${place.collection}-${iconFile}`
}

export function restaurantMarkerAssetPath(place: Pick<Place, 'collection' | 'iconType'>) {
  const iconFile = MAP_ICON_FILES[place.iconType] ?? 'vietnam'
  return `map-pins/${place.collection}-${iconFile}.png`
}

export function createRestaurantFeatureCollection(places: Place[], selectedId: string | null): RestaurantFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.map((place) => ({
      type: 'Feature',
      id: place.id,
      geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
      properties: {
        placeId: place.id,
        imageId: restaurantMarkerImageId(place),
        selected: selectedId === place.id
      }
    }))
  }
}

export function createUserLocationFeatureCollection(location: UserLocation | null): UserLocationFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: location ? [{
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [location.lng, location.lat] },
      properties: {}
    }] : []
  }
}

export function restaurantLayerSpecifications(): SymbolLayerSpecification[] {
  const commonLayout: NonNullable<SymbolLayerSpecification['layout']> = {
    'icon-image': ['get', 'imageId'],
    'icon-anchor': 'bottom',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true
  }

  return [
    {
      id: RESTAURANT_LAYER_ID,
      type: 'symbol',
      source: RESTAURANT_SOURCE_ID,
      filter: ['==', ['get', 'selected'], false],
      layout: { ...commonLayout, 'icon-size': 1 }
    },
    {
      id: SELECTED_RESTAURANT_LAYER_ID,
      type: 'symbol',
      source: RESTAURANT_SOURCE_ID,
      filter: ['==', ['get', 'selected'], true],
      layout: { ...commonLayout, 'icon-size': 1.26 }
    }
  ]
}

async function ensureRestaurantImages(
  map: LibreMap,
  places: Place[],
  pendingImages: Map<string, Promise<void>>
) {
  const uniquePlaces = new Map(places.map((place) => [restaurantMarkerImageId(place), place]))
  await Promise.all([...uniquePlaces].map(async ([imageId, place]) => {
    if (map.hasImage(imageId)) return
    let pending = pendingImages.get(imageId)
    if (!pending) {
      pending = map.loadImage(`${import.meta.env.BASE_URL}${restaurantMarkerAssetPath(place)}`).then(({ data }) => {
        if (!map.hasImage(imageId)) map.addImage(imageId, data, { pixelRatio: 2 })
      }).finally(() => pendingImages.delete(imageId))
      pendingImages.set(imageId, pending)
    }
    await pending
  }))
}

export function MapView({ places, selected, onSelect, userLocation }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LibreMap | null>(null)
  const placesRef = useRef(places)
  const selectedRef = useRef(selected)
  const onSelectRef = useRef(onSelect)
  const userLocationRef = useRef(userLocation)
  const pendingImagesRef = useRef(new Map<string, Promise<void>>())
  const placeSyncVersionRef = useRef(0)

  placesRef.current = places
  selectedRef.current = selected
  onSelectRef.current = onSelect
  userLocationRef.current = userLocation

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return
    let disposed = false
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
    let completedMoveCount = 0
    containerRef.current.dataset.mapMoveCount = '0'
    map.on('moveend', () => {
      completedMoveCount += 1
      if (containerRef.current) containerRef.current.dataset.mapMoveCount = String(completedMoveCount)
    })

    const handleRestaurantClick = (event: MapLayerMouseEvent) => {
      const placeId = String(event.features?.[0]?.properties?.placeId ?? '')
      const place = placesRef.current.find((candidate) => candidate.id === placeId)
      if (place) onSelectRef.current(place)
    }
    const showPointer = () => { map.getCanvas().style.cursor = 'pointer' }
    const hidePointer = () => { map.getCanvas().style.cursor = '' }

    const initialiseWebGlMarkers = async () => {
      await ensureRestaurantImages(map, placesRef.current, pendingImagesRef.current)
      if (disposed) return

      map.addSource(RESTAURANT_SOURCE_ID, {
        type: 'geojson',
        data: createRestaurantFeatureCollection(placesRef.current, selectedRef.current?.id ?? null)
      })
      for (const layer of restaurantLayerSpecifications()) map.addLayer(layer)

      map.addSource(USER_LOCATION_SOURCE_ID, {
        type: 'geojson',
        data: createUserLocationFeatureCollection(userLocationRef.current)
      })
      map.addLayer({
        id: USER_LOCATION_HALO_LAYER_ID,
        type: 'circle',
        source: USER_LOCATION_SOURCE_ID,
        paint: { 'circle-radius': 14, 'circle-color': '#177ad8', 'circle-opacity': 0.18 }
      })
      map.addLayer({
        id: USER_LOCATION_DOT_LAYER_ID,
        type: 'circle',
        source: USER_LOCATION_SOURCE_ID,
        paint: {
          'circle-radius': 7,
          'circle-color': '#177ad8',
          'circle-stroke-width': 4,
          'circle-stroke-color': '#ffffff'
        }
      })

      for (const layerId of RESTAURANT_LAYER_IDS) {
        map.on('click', layerId, handleRestaurantClick)
        map.on('mouseenter', layerId, showPointer)
        map.on('mouseleave', layerId, hidePointer)
      }
      containerRef.current?.setAttribute('data-restaurant-marker-renderer', 'webgl-symbol')
      containerRef.current?.setAttribute('data-user-location-renderer', 'webgl-circle')
      containerRef.current?.setAttribute('data-user-location-visible', String(Boolean(userLocationRef.current)))
    }

    map.once('load', () => {
      initialiseWebGlMarkers().catch((error) => {
        console.error('Failed to initialise restaurant marker layers', error)
      })
    })

    return () => {
      disposed = true
      map.remove()
      pendingImagesRef.current.clear()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    const source = map?.getSource(RESTAURANT_SOURCE_ID) as GeoJSONSource | undefined
    if (!map || !source) return
    const syncVersion = ++placeSyncVersionRef.current
    ensureRestaurantImages(map, places, pendingImagesRef.current).then(() => {
      if (placeSyncVersionRef.current !== syncVersion || mapRef.current !== map) return
      source.setData(createRestaurantFeatureCollection(places, selected?.id ?? null))
    }).catch((error) => console.error('Failed to update restaurant marker layers', error))
  }, [places, selected])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !selected) return
    map.flyTo({ center: [selected.lng, selected.lat], zoom: Math.max(map.getZoom(), 14), offset: [0, -110], duration: 700 })
  }, [selected])

  useEffect(() => {
    const map = mapRef.current
    const source = map?.getSource(USER_LOCATION_SOURCE_ID) as GeoJSONSource | undefined
    if (!map || !source) return
    source.setData(createUserLocationFeatureCollection(userLocation))
    containerRef.current?.setAttribute('data-user-location-visible', String(Boolean(userLocation)))
    if (userLocation) map.flyTo({ center: [userLocation.lng, userLocation.lat], zoom: 14.5, duration: 800 })
  }, [userLocation])

  return (
    <div className="map-view">
      <div className="map-canvas" ref={containerRef} aria-label="峴港餐廳地圖" />
      <div className="map-place-accessibility" aria-label="地圖上的餐廳">
        {places.map((place) => (
          <button
            className="map-place-accessible"
            type="button"
            key={place.id}
            aria-label={`${place.name}，${place.iconType}`}
            onClick={() => onSelect(place)}
          >
            {place.name}
          </button>
        ))}
      </div>
    </div>
  )
}
