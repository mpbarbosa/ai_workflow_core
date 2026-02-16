# Browser API Integration Debugging Checklist

**Purpose**: Systematic debugging guide for browser API integration issues  
**Source**: Guia Turístico Geolocation API and browser-specific bugs  
**Transferability**: 60% (highly browser-specific, but patterns apply to any platform-specific APIs)

---

## 1. Evidence Collection

- [ ] **Capture browser console output** (Chrome DevTools, Firefox Console)
- [ ] **Record browser version** (Chrome 120, Firefox 115, Safari 17, etc.)
- [ ] **Document API availability** (does navigator.geolocation exist?)
- [ ] **Check API permissions** (granted, denied, prompt)
- [ ] **Save full error messages** (exact text, error codes)
- [ ] **Capture browser warnings** (deprecation notices, security warnings)

---

## 2. Browser API Availability Check

### API Detection
- [ ] **Check API exists** before using
```javascript
if ('geolocation' in navigator) {
  // Safe to use
} else {
  // Fallback or error message
  console.error('Geolocation API not available');
}
```
- [ ] **Test in target browsers** (Chrome, Firefox, Safari, Edge)
- [ ] **Check browser version requirements** (MDN browser compatibility table)
- [ ] **Document minimum versions** in README/docs
- [ ] **Provide fallback** for unsupported browsers

### Feature Detection Pattern
```javascript
function checkBrowserFeatures() {
  const features = {
    geolocation: 'geolocation' in navigator,
    speechSynthesis: 'speechSynthesis' in window,
    serviceWorker: 'serviceWorker' in navigator,
    webGL: !!document.createElement('canvas').getContext('webgl'),
  };
  
  console.log('Browser Features:', features);
  return features;
}
```

---

## 3. Browser API Permission Handling

### Geolocation Permission Flow
- [ ] **Check current permission state**
```javascript
navigator.permissions.query({ name: 'geolocation' })
  .then(result => {
    console.log('Geolocation permission:', result.state);
    // 'granted', 'denied', or 'prompt'
  });
```
- [ ] **Handle all permission states**
  - **granted**: Proceed with API call
  - **denied**: Show error message, disable features
  - **prompt**: User will be prompted, handle both accept/reject
- [ ] **Test permission revocation** (user denies after granting)
- [ ] **Provide permission request UI** (explain why needed)
- [ ] **Handle permission in HTTPS/localhost** (required for production)

### Permission Error Handling
```javascript
navigator.geolocation.getCurrentPosition(
  position => {
    console.log('Success:', position);
  },
  error => {
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.error('User denied geolocation');
        // Show help message
        break;
      case error.POSITION_UNAVAILABLE:
        console.error('Location unavailable');
        break;
      case error.TIMEOUT:
        console.error('Request timeout');
        break;
    }
  },
  { timeout: 10000, maximumAge: 0, enableHighAccuracy: true }
);
```

---

## 4. Browser API Object Structure Analysis

### Property Enumerability Investigation
- [ ] **Test property enumeration**
```javascript
// Check what properties are enumerable
const position = { /* from geolocation API */ };
console.log('Enumerable keys:', Object.keys(position.coords));
// Browser API: Returns [] (getters are non-enumerable!)

console.log('All keys:', Object.getOwnPropertyNames(position.coords));
// Returns: ['latitude', 'longitude', 'accuracy', ...]

// Test each property
['latitude', 'longitude'].forEach(prop => {
  const descriptor = Object.getOwnPropertyDescriptor(
    position.coords, prop
  );
  console.log(`${prop}:`, descriptor);
  // { get: [Function], enumerable: false, configurable: true }
});
```

### Getter vs Property Detection
- [ ] **Identify getter properties** (common in browser APIs)
```javascript
function hasGetter(obj, prop) {
  const descriptor = Object.getOwnPropertyDescriptor(obj, prop);
  return descriptor && typeof descriptor.get === 'function';
}

console.log('latitude is getter:', hasGetter(position.coords, 'latitude'));
// true for browser APIs
```
- [ ] **Document getter-based APIs** (Geolocation, MediaStream, etc.)
- [ ] **Avoid spread operator on getters** (use explicit extraction)
- [ ] **Test serialization** (JSON.stringify may lose getters)

### Object Cloning Strategies
```javascript
// WRONG: Spread operator (loses non-enumerable properties)
const copy1 = { ...position.coords };
console.log(copy1);  // {} - Empty object!

// WRONG: Object.assign (same issue)
const copy2 = Object.assign({}, position.coords);
console.log(copy2);  // {} - Empty object!

// CORRECT: Explicit property extraction
const copy3 = {
  latitude: position.coords.latitude,
  longitude: position.coords.longitude,
  accuracy: position.coords.accuracy
};
console.log(copy3);  // { latitude: ..., longitude: ..., accuracy: ... } ✅

// ALTERNATIVE: Use Object.getOwnPropertyNames
function cloneBrowserAPIObject(obj, props) {
  const clone = {};
  props.forEach(prop => {
    if (prop in obj) {
      clone[prop] = obj[prop];
    }
  });
  return clone;
}

const copy4 = cloneBrowserAPIObject(position.coords, [
  'latitude', 'longitude', 'accuracy', 'altitude', 
  'altitudeAccuracy', 'heading', 'speed'
]);
```

---

## 5. Browser-Specific Behavior Testing

### Cross-Browser Validation
- [ ] **Test in Chrome** (Blink engine)
- [ ] **Test in Firefox** (Gecko engine)
- [ ] **Test in Safari** (WebKit engine)
- [ ] **Test in Edge** (Chromium-based, similar to Chrome)
- [ ] **Document browser differences** in behavior

### Common Browser Differences
- [ ] **API availability** (some browsers don't support certain APIs)
- [ ] **Error message formats** (different text across browsers)
- [ ] **Permission UI** (different prompts, different locations)
- [ ] **Performance characteristics** (speed, accuracy)
- [ ] **CORS behavior** (stricter in some browsers)

### Mobile vs Desktop Testing
- [ ] **Test on mobile browsers** (Chrome Mobile, Safari iOS)
- [ ] **Check mobile-specific APIs** (DeviceOrientation, Vibration)
- [ ] **Test with device sensors** (GPS, accelerometer)
- [ ] **Verify touch events** vs mouse events
- [ ] **Test with network variations** (WiFi, 4G, offline)

---

## 6. Geolocation API Specific Patterns

### Configuration Options
- [ ] **Set timeout appropriately** (10 seconds typical)
```javascript
{
  timeout: 10000,           // 10 seconds
  maximumAge: 0,            // Don't use cached position
  enableHighAccuracy: true  // Use GPS (more battery)
}
```
- [ ] **Consider battery impact** (enableHighAccuracy drains battery)
- [ ] **Use cached positions** when appropriate (maximumAge > 0)
- [ ] **Test timeout scenarios** (what happens after 10s?)

### Continuous Tracking Pattern
```javascript
let watchId = null;

function startTracking() {
  watchId = navigator.geolocation.watchPosition(
    position => {
      console.log('Position update:', position.coords);
      // Update UI
    },
    error => {
      console.error('Tracking error:', error);
    },
    { enableHighAccuracy: true, maximumAge: 30000 }
  );
}

function stopTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
    console.log('Tracking stopped');
  }
}
```

### Position Change Detection
- [ ] **Implement minimum distance threshold** (avoid noise)
```javascript
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Haversine formula
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distance in meters
}

// Usage
const distance = calculateDistance(
  lastPosition.latitude, lastPosition.longitude,
  newPosition.latitude, newPosition.longitude
);

if (distance > 20) {  // 20 meter threshold
  console.log(`Moved ${distance.toFixed(1)}m`);
  // Update position
}
```

---

## 7. Web Speech API Patterns

### Voice Loading with Retry
```javascript
class VoiceLoader {
  async loadVoices(maxAttempts = 10) {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        console.log(`Voices loaded (attempt ${attempt})`);
        return voices;
      }
      
      // Exponential backoff
      const delay = Math.min(100 * Math.pow(2, attempt - 1), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    throw new Error('Failed to load voices after max attempts');
  }
}
```

### Brazilian Portuguese Voice Selection
```javascript
function selectBestVoice(voices) {
  // Priority 1: Exact match (pt-BR)
  let voice = voices.find(v => v.lang === 'pt-BR');
  if (voice) return voice;
  
  // Priority 2: Portuguese variant (pt-*)
  voice = voices.find(v => v.lang.startsWith('pt-'));
  if (voice) return voice;
  
  // Priority 3: Any local voice (better quality)
  voice = voices.find(v => !v.localService && v.lang.startsWith('pt-'));
  if (voice) return voice;
  
  // Fallback: First available
  return voices[0] || null;
}
```

---

## 8. HTTPS and Security Context Requirements

### HTTPS Requirement Check
- [ ] **Verify HTTPS in production** (required for Geolocation, Camera, etc.)
```javascript
if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
  console.warn('Geolocation requires HTTPS in production');
  // Show error to user
}
```
- [ ] **Test on localhost** (HTTP allowed)
- [ ] **Test with HTTPS certificate** (self-signed OK for testing)
- [ ] **Check mixed content** (HTTPS page loading HTTP resources)
- [ ] **Document HTTPS requirement** in deployment docs

### Secure Context APIs
- [ ] **Geolocation API** - requires HTTPS
- [ ] **Camera/Microphone** (getUserMedia) - requires HTTPS
- [ ] **Service Workers** - requires HTTPS
- [ ] **Web Bluetooth** - requires HTTPS
- [ ] **Payment Request API** - requires HTTPS

---

## 9. Mock vs Real Browser API Testing

### Creating Realistic Mocks
- [ ] **Capture real API structure** in browser console
```javascript
navigator.geolocation.getCurrentPosition(pos => {
  console.log('Real structure:', JSON.stringify({
    coords: Object.getOwnPropertyNames(pos.coords).reduce((acc, key) => {
      acc[key] = pos.coords[key];
      return acc;
    }, {}),
    timestamp: pos.timestamp
  }, null, 2));
});
```
- [ ] **Mock with non-enumerable properties**
```javascript
function createGeolocationMock(lat, lon) {
  const coords = {};
  
  // Define as getters (non-enumerable)
  Object.defineProperty(coords, 'latitude', {
    get: () => lat,
    enumerable: false,
    configurable: true
  });
  
  Object.defineProperty(coords, 'longitude', {
    get: () => lon,
    enumerable: false,
    configurable: true
  });
  
  // Add other properties...
  
  return {
    coords: coords,
    timestamp: Date.now()
  };
}
```
- [ ] **Test spread operator on mock** (should behave like real API)
```javascript
const mockPos = createGeolocationMock(-23.5407145, -46.5928052);
const spread = { ...mockPos.coords };
console.log(Object.keys(spread).length);  // Should be 0, like real API
```

### Test Environment Configuration
- [ ] **Use jsdom for Node.js tests** (simulates browser environment)
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js']
};
```
- [ ] **Mock browser APIs in tests**
```javascript
// jest.setup.js
global.navigator.geolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn()
};
```
- [ ] **Run E2E tests in real browser** (Puppeteer, Playwright)

---

## 10. Common Browser API Bugs

### Bug Type 1: Assuming Enumerable Properties
- [ ] **Symptom**: Empty object after spread operator
- [ ] **Check**: Property descriptor (enumerable: false)
- [ ] **Fix**: Use explicit property extraction
- [ ] **Example**: `{...coords}` → `{ latitude: coords.latitude, ... }`

### Bug Type 2: HTTPS Requirement Not Met
- [ ] **Symptom**: API not available or permission denied
- [ ] **Check**: Protocol (http vs https)
- [ ] **Fix**: Deploy with HTTPS or test on localhost
- [ ] **Example**: Geolocation fails on http://example.com

### Bug Type 3: Permission Denied Without User Feedback
- [ ] **Symptom**: API call fails silently
- [ ] **Check**: Error callback implementation
- [ ] **Fix**: Add user-friendly error messages
- [ ] **Example**: Show "Location access denied" message

### Bug Type 4: Timeout Without Retry
- [ ] **Symptom**: Position request hangs or times out
- [ ] **Check**: Timeout configuration (too short/long?)
- [ ] **Fix**: Implement retry with exponential backoff
- [ ] **Example**: Retry 3 times with 5s, 10s, 20s timeouts

### Bug Type 5: Browser Compatibility Not Checked
- [ ] **Symptom**: App breaks in specific browsers
- [ ] **Check**: API availability before use
- [ ] **Fix**: Add feature detection and fallbacks
- [ ] **Example**: Check `if ('geolocation' in navigator)` first

---

## 11. Performance and Battery Optimization

### Geolocation Optimization
- [ ] **Use appropriate accuracy setting**
```javascript
{
  enableHighAccuracy: false  // Use WiFi/cell towers, not GPS
}
```
- [ ] **Implement position caching**
```javascript
{
  maximumAge: 60000  // Accept 1-minute-old position
}
```
- [ ] **Stop tracking when not needed**
```javascript
// Clear watch when page not visible
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    stopTracking();
  } else {
    startTracking();
  }
});
```
- [ ] **Implement minimum distance threshold** (reduce updates)
- [ ] **Debounce rapid position updates**

---

## 12. Documentation Requirements

### Browser API Usage Documentation
```markdown
## Browser API Dependencies

### Geolocation API
- **Required**: Yes
- **Browser Support**: Chrome 5+, Firefox 3.5+, Safari 5+, Edge 12+
- **HTTPS Required**: Yes (production only, localhost exempt)
- **Permissions**: User must grant location access
- **Fallback**: Manual address input

### Configuration
```javascript
{
  timeout: 10000,           // 10 second timeout
  maximumAge: 30000,        // 30 second cache
  enableHighAccuracy: true  // Use GPS
}
```

### Known Issues
1. **Non-enumerable properties**: Use explicit extraction, not spread operator
2. **Permission denial**: Show clear error message to user
3. **HTTPS requirement**: Deploy with SSL certificate
```

---

## 13. Success Criteria

- [ ] ✅ **API availability checked** before use
- [ ] ✅ **Permissions handled gracefully** (all states)
- [ ] ✅ **Non-enumerable properties handled** (explicit extraction)
- [ ] ✅ **HTTPS requirement met** (production deployment)
- [ ] ✅ **Cross-browser testing complete** (Chrome, Firefox, Safari)
- [ ] ✅ **Real device testing done** (mobile + desktop)
- [ ] ✅ **Error messages user-friendly** (actionable guidance)
- [ ] ✅ **Performance optimized** (battery-conscious)

---

## Quick Reference: Browser API Debugging Workflow

```
1. CHECK API availability (feature detection)
   ↓
2. VERIFY permissions (granted/denied/prompt)
   ↓
3. INSPECT object structure (enumerable properties?)
   ↓
4. TEST in real browser (not just mocks)
   ↓
5. VALIDATE across browsers (Chrome, Firefox, Safari)
   ↓
6. DOCUMENT requirements (HTTPS, permissions, etc.)
   ↓
7. OPTIMIZE performance (battery, caching, thresholds)
```

---

**Template Version**: 1.0  
**Last Updated**: 2026-02-14  
**Source Session**: Guia Turístico Geolocation API Debugging  
**Transferability**: Medium (60%) - Highly browser-specific, but patterns apply to platform APIs
