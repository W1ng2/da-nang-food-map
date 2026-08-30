import { useEffect, useRef } from 'react'
import {
  AttributionControl,
  Map as LibreMap,
  NavigationControl,
  type CircleLayerSpecification,
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
  michelinLabel: string
  selected: boolean
}

interface RestaurantFeatureCollection {
  type: 'FeatureCollection'
  features: Array<{
    type: 'Feature'
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
const RESTAURANT_CLUSTER_LAYER_ID = 'restaurant-clusters'
const RESTAURANT_CLUSTER_COUNT_LAYER_ID = 'restaurant-cluster-count'
const RESTAURANT_LAYER_ID = 'restaurant-pins'
const SELECTED_RESTAURANT_LAYER_ID = 'restaurant-pins-selected'
const USER_LOCATION_SOURCE_ID = 'user-location'
const USER_LOCATION_HALO_LAYER_ID = 'user-location-halo'
const USER_LOCATION_DOT_LAYER_ID = 'user-location-dot'

export const RESTAURANT_LAYER_IDS = [RESTAURANT_LAYER_ID, SELECTED_RESTAURANT_LAYER_ID] as const
export const RESTAURANT_CLUSTER_OPTIONS = {
  cluster: true,
  clusterRadius: 48,
  clusterMaxZoom: 13,
  generateId: true
} as const

export function restaurantMarkerImageId(place: Pick<Place, 'iconType' | 'michelin'>) {
  const iconFile = MAP_ICON_FILES[place.iconType] ?? 'vietnam'
  return `restaurant-pin-cuisine-${iconFile}${place.michelin ? '-michelin' : ''}`
}

export function restaurantMarkerAssetPath(place: Pick<Place, 'iconType' | 'michelin'>) {
  const iconFile = MAP_ICON_FILES[place.iconType] ?? 'vietnam'
  return `map-pins/cuisine-${iconFile}${place.michelin ? '-michelin' : ''}.png`
}

export function createRestaurantFeatureCollection(places: Place[], selectedId: string | null): RestaurantFeatureCollection {
  return {
    type: 'FeatureCollection',
    features: places.map((place) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [place.lng, place.lat] },
      properties: {
        placeId: place.id,
        imageId: restaurantMarkerImageId(place),
        michelinLabel: place.michelin,
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

export function restaurantLayerSpecifications(): Array<CircleLayerSpecification | SymbolLayerSpecification> {
  const commonLayout: NonNullable<SymbolLayerSpecification['layout']> = {
    'icon-image': ['get', 'imageId'],
    'icon-anchor': 'bottom',
    'icon-allow-overlap': true,
    'icon-ignore-placement': true
  }

  return [
    {
      id: RESTAURANT_CLUSTER_LAYER_ID,
      type: 'circle',
      source: RESTAURANT_SOURCE_ID,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': ['step', ['get', 'point_count'], '#cf8d20', 10, '#d2672c', 25, '#a72e28'],
        'circle-radius': ['step', ['get', 'point_count'], 19, 10, 23, 25, 28],
        'circle-stroke-width': 3,
        'circle-stroke-color': '#fffaf0'
      }
    },
    {
      id: RESTAURANT_CLUSTER_COUNT_LAYER_ID,
      type: 'symbol',
      source: RESTAURANT_SOURCE_ID,
      filter: ['has', 'point_count'],
      layout: {
        'text-field': ['get', 'point_count_abbreviated'],
        'text-size': 12
      },
      paint: { 'text-color': '#fffaf0' }
    },
    {
      id: RESTAURANT_LAYER_ID,
      type: 'symbol',
      source: RESTAURANT_SOURCE_ID,
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'selected'], false]],
      layout: { ...commonLayout, 'icon-size': 1 }
    },
    {
      id: SELECTED_RESTAURANT_LAYER_ID,
      type: 'symbol',
      source: RESTAURANT_SOURCE_ID,
      filter: ['all', ['!', ['has', 'point_count']], ['==', ['get', 'selected'], true]],
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
    const handleClusterClick = async (event: MapLayerMouseEvent) => {
      const clusterId = Number(event.features?.[0]?.properties?.cluster_id)
      const coordinates = event.features?.[0]?.geometry.type === 'Point'
        ? event.features[0].geometry.coordinates as [number, number]
        : null
      const source = map.getSource(RESTAURANT_SOURCE_ID) as GeoJSONSource | undefined
      if (!source || !Number.isFinite(clusterId) || !coordinates) return
      const zoom = await source.getClusterExpansionZoom(clusterId)
      map.easeTo({ center: coordinates, zoom, duration: 450 })
    }
    const showPointer = () => { map.getCanvas().style.cursor = 'pointer' }
    const hidePointer = () => { map.getCanvas().style.cursor = '' }

    const initialiseWebGlMarkers = async () => {
      await ensureRestaurantImages(map, placesRef.current, pendingImagesRef.current)
      if (disposed) return

      map.addSource(RESTAURANT_SOURCE_ID, {
        type: 'geojson',
        data: createRestaurantFeatureCollection(placesRef.current, selectedRef.current?.id ?? null),
        ...RESTAURANT_CLUSTER_OPTIONS
      })
      for (const layer of restaurantLayerSpecifications()) map.addLayer(layer)

      // Data can finish loading while the map's first style frame is being created.
      // Re-sync after the source exists so that neither the source nor its images can
      // remain at the empty initial render.
      const latestPlaces = placesRef.current
      await ensureRestaurantImages(map, latestPlaces, pendingImagesRef.current)
      if (disposed) return
      const restaurantSource = map.getSource(RESTAURANT_SOURCE_ID) as GeoJSONSource
      restaurantSource.setData(createRestaurantFeatureCollection(latestPlaces, selectedRef.current?.id ?? null))

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
      map.on('click', RESTAURANT_CLUSTER_LAYER_ID, handleClusterClick)
      map.on('mouseenter', RESTAURANT_CLUSTER_LAYER_ID, showPointer)
      map.on('mouseleave', RESTAURANT_CLUSTER_LAYER_ID, hidePointer)
      containerRef.current?.setAttribute('data-restaurant-marker-renderer', 'webgl-symbol')
      containerRef.current?.setAttribute('data-michelin-marker-renderer', 'embedded-webgl-pin-badge')
      containerRef.current?.setAttribute('data-restaurant-source-count', String(latestPlaces.length))
      containerRef.current?.setAttribute('data-restaurant-clustering', 'true')
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
            aria-label={`${place.name}，${place.iconType}${place.michelin ? `，MICHELIN ${place.michelin}` : ''}`}
            onClick={() => onSelect(place)}
          >
            {place.name}
          </button>
        ))}
      </div>
    </div>
  )
}
