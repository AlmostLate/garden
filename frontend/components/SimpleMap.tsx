'use client';

import { useState } from 'react';
import Map, { Layer, Source } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = 'ваш_публичный_токен';

const mockGarden = {
    type: 'Feature',
    geometry: {
        type: 'Polygon',
        coordinates: [[
            [37.6, 55.75],
            [37.61, 55.75],
            [37.61, 55.76],
            [37.6, 55.76],
            [37.6, 55.75]
        ]]
    }
};

export default function SimpleMap() {
    const [viewState, setViewState] = useState({
        longitude: 37.6,
        latitude: 55.75,
        zoom: 12
    });

    return (
        <Map
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/satellite-v9"
            mapboxAccessToken={MAPBOX_TOKEN}
            style={{ width: '100%', height: 400 }}
            attributionControl={false}
        >
            <Source id="garden" type="geojson" data={mockGarden}>
                <Layer
                    id="garden-fill"
                    type="fill"
                    paint={{
                        'fill-color': '#22c55e',
                        'fill-opacity': 0.3
                    }}
                />
                <Layer
                    id="garden-border"
                    type="line"
                    paint={{
                        'line-color': '#15803d',
                        'line-width': 2
                    }}
                />
            </Source>
        </Map>
    );
}