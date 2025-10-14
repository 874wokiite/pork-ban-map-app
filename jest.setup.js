import '@testing-library/jest-dom'

// Mock Google Maps API
const mockGoogleMaps = {
  maps: {
    Map: jest.fn(() => ({
      setCenter: jest.fn(),
      setZoom: jest.fn(),
      addListener: jest.fn(),
    })),
    Marker: jest.fn(() => ({
      setMap: jest.fn(),
      addListener: jest.fn(),
    })),
    LatLng: jest.fn((lat, lng) => ({ lat, lng })),
    MapTypeId: {
      ROADMAP: 'roadmap',
    },
  },
}

// Global window mock for tests
Object.defineProperty(window, 'google', {
  value: mockGoogleMaps,
  writable: true,
})

// Mock environment variables
process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = 'test-api-key'

// Mock DOM methods that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})