# Data Structure Mismatch Debugging Checklist

**Purpose**: Systematic debugging guide for data structure incompatibilities between components  
**Source**: Guia Turístico coordinate extraction and API contract bugs  
**Transferability**: 90% (applicable to any system with component interfaces)

---

## 1. Evidence Collection

- [ ] **Capture actual data structures** (console.log(JSON.stringify(data, null, 2)))
- [ ] **Document expected structures** from code/documentation
- [ ] **Save test mock structures** for comparison
- [ ] **Record error messages** (TypeError, undefined property, etc.)
- [ ] **Extract stack traces** showing where failure occurs
- [ ] **Capture type information** (typeof, instanceof results)

---

## 2. Producer-Consumer Contract Analysis

### Identify Data Flow
- [ ] **Map data flow** from producer to consumer
```
[Producer: API/Service] → [Data Structure] → [Consumer: Component]
     GeolocationAPI           Coordinates         PositionManager
```
- [ ] **Document intermediate transformations** (mapping, filtering, etc.)
- [ ] **Identify all consumers** of the data (who uses this structure?)
- [ ] **Check for multiple producers** (inconsistent structure sources)

### Contract Documentation
- [ ] **Document producer contract** (what structure does it output?)
```javascript
// Producer: navigator.geolocation.getCurrentPosition()
// Output Structure:
{
  coords: {
    latitude: number,
    longitude: number,
    accuracy: number,
    altitude: number | null,
    altitudeAccuracy: number | null,
    heading: number | null,
    speed: number | null
  },
  timestamp: number
}
```
- [ ] **Document consumer contract** (what structure does it expect?)
```javascript
// Consumer: PositionManager.update()
// Expected Structure:
{
  latitude: number,
  longitude: number
}
```
- [ ] **Identify mismatch** (nested vs flat, different property names, etc.)

---

## 3. Structure Comparison

### Visual Comparison
- [ ] **Create side-by-side comparison**
```
PRODUCER (API Response)      CONSUMER (Expected)
{                            {
  coords: {                    latitude: -23.5407145,  ← MISMATCH!
    latitude: -23.5407145,     longitude: -46.5928052 ← MISMATCH!
    longitude: -46.5928052   }
  },
  timestamp: 1707875197756
}
```
- [ ] **Mark mismatches** with annotations
- [ ] **Identify extra fields** (producer has, consumer doesn't need)
- [ ] **Identify missing fields** (consumer needs, producer doesn't provide)

### Property Path Analysis
- [ ] **Document access paths** for each property
```
Producer: position.coords.latitude
Consumer: position.latitude
         ^^^^^^^^^^^ WRONG PATH!
```
- [ ] **Check nesting levels** (flat vs nested)
- [ ] **Verify property names** (camelCase, snake_case, exact spelling)
- [ ] **Test property existence** (hasOwnProperty, optional chaining)

---

## 4. Type System Validation

### Type Checking
- [ ] **Document expected types** for each field
```javascript
interface Position {
  latitude: number;   // Expected: number
  longitude: number;  // Expected: number
}
```
- [ ] **Check actual types** at runtime
```javascript
console.log(typeof position.latitude);  // Actual: "number" or "undefined"?
```
- [ ] **Identify type coercion issues** (string "123" vs number 123)
- [ ] **Check for null/undefined** where values expected
- [ ] **Test with edge cases** (NaN, Infinity, negative numbers)

### TypeScript/JSDoc Validation
- [ ] **Add type annotations** (TypeScript or JSDoc)
```javascript
/**
 * @param {Object} position
 * @param {number} position.latitude
 * @param {number} position.longitude
 */
function update(position) { ... }
```
- [ ] **Run type checker** (tsc --noEmit or VSCode)
- [ ] **Fix type errors** one at a time
- [ ] **Use type guards** for runtime validation
```javascript
function isValidPosition(pos) {
  return pos && 
         typeof pos.latitude === 'number' &&
         typeof pos.longitude === 'number';
}
```

---

## 5. Destructuring & Spread Operator Issues

### Destructuring Pattern Validation
- [ ] **Check destructuring assignments**
```javascript
// WRONG: Expects flat structure
const { latitude, longitude } = position;
// position = { coords: { latitude: ..., longitude: ... } }
// Result: latitude = undefined, longitude = undefined

// CORRECT: Match actual structure
const { coords: { latitude, longitude } } = position;
```
- [ ] **Test with actual data** (not just mocks)
- [ ] **Add default values** for optional properties
```javascript
const { latitude = 0, longitude = 0 } = coords || {};
```
- [ ] **Use optional chaining** for nested properties
```javascript
const lat = position?.coords?.latitude;
```

### Spread Operator Validation
- [ ] **Identify spread usage** ({...obj} or [...arr])
```javascript
const pos = { ...coords };  // Check what this produces
console.log(Object.keys(pos));  // Are all properties copied?
```
- [ ] **Check source enumerability** (Object.keys vs Object.getOwnPropertyNames)
```javascript
// Browser API Coordinates object has NON-ENUMERABLE properties!
console.log(Object.keys(coords));  // Returns: []
console.log(coords.latitude);      // Returns: -23.5407145 (getter)
```
- [ ] **Test spread with browser APIs** (often have getters, not enumerable)
- [ ] **Replace spread with explicit extraction** if needed
```javascript
// WRONG: Spread on browser API
const pos = { ...coords };  // Results in: {}

// CORRECT: Explicit property extraction
const pos = {
  latitude: coords.latitude,
  longitude: coords.longitude
};
```

---

## 6. Mock vs Reality Validation

### Test Mock Comparison
- [ ] **Extract test mock structure**
```javascript
// Test mock (incorrect)
const mockPosition = {
  latitude: -23.5407145,    // ← Flat structure
  longitude: -46.5928052
};
```
- [ ] **Extract real API structure** (console.log in browser)
```javascript
// Real browser API (actual)
const realPosition = {
  coords: {                  // ← Nested structure
    latitude: -23.5407145,
    longitude: -46.5928052,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: 1707875197756
};
```
- [ ] **Identify structural differences**
- [ ] **Update mocks to match reality** (most important fix!)
- [ ] **Re-run tests with updated mocks**

### Enumerable Property Testing
- [ ] **Check property enumerability**
```javascript
const descriptor = Object.getOwnPropertyDescriptor(coords, 'latitude');
console.log(descriptor.enumerable);  // false for browser API getters
```
- [ ] **Test spread operator** on real objects
```javascript
const copy = { ...coords };
console.log(JSON.stringify(copy));  // "{}" if properties are getters
```
- [ ] **Document non-enumerable properties** in tests
- [ ] **Use explicit extraction** instead of spread

---

## 7. API Contract Validation

### Interface Definition
- [ ] **Define explicit interfaces** (TypeScript, JSDoc, or documentation)
```typescript
// Define what each component expects
interface GeoPosition {
  latitude: number;
  longitude: number;
}

interface APIResponse {
  coords: {
    latitude: number;
    longitude: number;
  };
  timestamp: number;
}
```
- [ ] **Document transformation functions**
```javascript
/**
 * Converts browser Geolocation position to GeoPosition
 * @param {Position} browserPosition - Browser API position object
 * @returns {GeoPosition} Standardized position object
 */
function toBrowserPosition(browserPosition) {
  return {
    latitude: browserPosition.coords.latitude,
    longitude: browserPosition.coords.longitude
  };
}
```
- [ ] **Add adapter layer** if necessary (bridge incompatible interfaces)

### Adapter Pattern Implementation
- [ ] **Create adapter class/function** to bridge mismatch
```javascript
class GeolocationAdapter {
  /**
   * Adapts browser Position to application GeoPosition
   */
  static adapt(browserPosition) {
    return {
      latitude: browserPosition.coords.latitude,
      longitude: browserPosition.coords.longitude,
      accuracy: browserPosition.coords.accuracy,
      timestamp: browserPosition.timestamp
    };
  }
}

// Usage
const appPosition = GeolocationAdapter.adapt(browserPosition);
```
- [ ] **Test adapter with real data** (not just mocks)
- [ ] **Add error handling** for invalid input
```javascript
static adapt(browserPosition) {
  if (!browserPosition?.coords) {
    throw new Error('Invalid browser position structure');
  }
  // ... rest of adaptation
}
```

---

## 8. Common Data Structure Bugs

### Bug Type 1: Nested vs Flat Structure Mismatch
- [ ] **Symptom**: `undefined` when accessing properties
- [ ] **Check**: Property access path (direct vs nested)
- [ ] **Fix**: Update access path OR flatten structure
- [ ] **Example**: `position.latitude` → `position.coords.latitude`

### Bug Type 2: Property Name Mismatch
- [ ] **Symptom**: Expected property doesn't exist
- [ ] **Check**: Exact spelling, case sensitivity
- [ ] **Fix**: Rename property OR use correct name
- [ ] **Example**: `lat` vs `latitude`, `lng` vs `longitude`

### Bug Type 3: Type Mismatch
- [ ] **Symptom**: Wrong type passed to function
- [ ] **Check**: `typeof` validation, type guards
- [ ] **Fix**: Add type conversion OR type validation
- [ ] **Example**: String "123" passed where number expected

### Bug Type 4: Spread Operator on Non-Enumerable Properties
- [ ] **Symptom**: Empty object `{}` after spread
- [ ] **Check**: Source object has getters (browser APIs)
- [ ] **Fix**: Use explicit property extraction
- [ ] **Example**: `{...coords}` → `{ latitude: coords.latitude, ... }`

### Bug Type 5: Array vs Object Confusion
- [ ] **Symptom**: Array methods fail or object iteration wrong
- [ ] **Check**: `Array.isArray()` validation
- [ ] **Fix**: Use correct data structure OR convert
- [ ] **Example**: `[{id: 1}]` treated as object, need array methods

### Bug Type 6: Missing Null/Undefined Checks
- [ ] **Symptom**: TypeError: Cannot read property 'x' of undefined
- [ ] **Check**: Null/undefined protection
- [ ] **Fix**: Add optional chaining OR explicit checks
- [ ] **Example**: `obj.prop` → `obj?.prop` or `obj && obj.prop`

---

## 9. Test Update Strategy

### Update Tests to Match Reality
- [ ] **Identify failing tests** with wrong assumptions
- [ ] **Compare test mock to real API response** (console.log both)
- [ ] **Update mock structure** to match reality
```javascript
// BEFORE (incorrect mock)
const mockPosition = {
  latitude: -23.5407145,
  longitude: -46.5928052
};

// AFTER (matches browser API)
const mockPosition = {
  coords: {
    latitude: -23.5407145,
    longitude: -46.5928052,
    accuracy: 10,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    speed: null
  },
  timestamp: Date.now()
};
```
- [ ] **Add property enumerability tests**
```javascript
test('coords has non-enumerable properties', () => {
  const descriptor = Object.getOwnPropertyDescriptor(
    mockPosition.coords, 'latitude'
  );
  expect(descriptor.enumerable).toBe(false);
});
```
- [ ] **Test spread operator behavior**
```javascript
test('spread operator on coords produces empty object', () => {
  const copy = { ...mockPosition.coords };
  expect(Object.keys(copy)).toHaveLength(0);
});
```

---

## 10. Visual Validation

### Data Flow Diagram
```
[Browser API]
      ↓
  Position {
    coords: Coordinates {
      latitude: -23.5407145  ← getter (non-enumerable)
      longitude: -46.5928052 ← getter (non-enumerable)
    },
    timestamp: 1707875197756
  }
      ↓
  [Adapter] ← Explicit extraction
      ↓
  GeoPosition {
    latitude: -23.5407145   ← enumerable property
    longitude: -46.5928052  ← enumerable property
  }
      ↓
  [PositionManager]
```

### Before/After Comparison
```markdown
## BEFORE (Broken)
const pos = { ...position };  // ← Spread on nested structure
// Result: pos = { coords: { ... }, timestamp: ... }
// Access: pos.latitude → undefined ❌

## AFTER (Fixed)
const pos = { 
  latitude: position.coords.latitude,
  longitude: position.coords.longitude
};
// Result: pos = { latitude: ..., longitude: ... }
// Access: pos.latitude → -23.5407145 ✅
```

---

## 11. Documentation Requirements

### Data Structure Documentation
- [ ] **Document all interfaces** in code comments
- [ ] **Create structure diagrams** for complex objects
- [ ] **Add examples** of actual data
- [ ] **Document transformations** (adapter functions)
- [ ] **Note non-standard behaviors** (non-enumerable properties)

### Bug Report Template
```markdown
## Data Structure Mismatch Bug

**Symptom**: [What error occurs]

**Root Cause**: [Structure mismatch details]

**Producer Structure**:
```json
{
  "actual": "structure",
  "from": "API"
}
```

**Consumer Expected**:
```json
{
  "expected": "structure",
  "by": "Component"
}
```

**Fix**: [Adapter, path change, mock update]

**Validation**: [Test results after fix]
```

---

## 12. Success Criteria

- [ ] ✅ **All property accesses succeed** (no undefined)
- [ ] ✅ **All type checks pass** (correct types at runtime)
- [ ] ✅ **All tests use realistic mocks** (match actual API structure)
- [ ] ✅ **All spread operators work correctly** (or replaced with explicit extraction)
- [ ] ✅ **All destructuring succeeds** (matches actual structure)
- [ ] ✅ **Documentation updated** (interfaces, adapters documented)
- [ ] ✅ **Real API testing successful** (validated in browser/production)

---

## Quick Reference: Data Structure Debugging Workflow

```
1. CAPTURE actual data structure (console.log with stringify)
   ↓
2. DOCUMENT expected structure (from code/docs)
   ↓
3. COMPARE producer vs consumer (side-by-side)
   ↓
4. IDENTIFY mismatch (nesting, naming, type, enumerability)
   ↓
5. FIX one of: adapter, access path, mock structure
   ↓
6. VALIDATE with real API (not just updated mocks)
   ↓
7. DOCUMENT interface contracts (prevent future bugs)
```

---

**Template Version**: 1.0  
**Last Updated**: 2026-02-14  
**Source Session**: Guia Turístico Coordinate Extraction & API Contract Bugs  
**Transferability**: High (90%) - Applicable to any system with component interfaces
