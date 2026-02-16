# Observer Pattern Debugging Checklist

**Purpose**: Systematic debugging guide for Observer/Subject pattern integration issues  
**Source**: Guia Turístico debugging session (4 bugs fixed)  
**Transferability**: 95% (applicable to any event-driven architecture)

---

## 1. Evidence Collection (ALWAYS START HERE)

- [ ] **Capture complete console logs** with timestamps (ISO 8601 format)
- [ ] **Extract event timeline** showing notification order
- [ ] **Identify all observer registrations** (where addObserver() is called)
- [ ] **Document event names** used throughout the system
- [ ] **Capture actual vs expected behavior** with specific examples
- [ ] **Save original test results** (pass/fail counts, coverage)

---

## 2. Event Flow Analysis

### Event Propagation Chain
- [ ] **Trace subject.notifyObservers() calls** in console logs
- [ ] **Identify all observers being notified** (expect list of classes)
- [ ] **Verify notification order** matches expected sequence
- [ ] **Check for missing observers** (registered but not notified)
- [ ] **Check for extra observers** (notified but shouldn't be)

### Event Type Validation
- [ ] **Document all event names** used in the system (e.g., "PositionManager updated", "Address fetched")
- [ ] **Check observer.update(event) filtering logic** - does it accept the event?
- [ ] **Look for event name typos** (case sensitivity, spacing, spelling)
- [ ] **Verify event constants** are used consistently (avoid string literals)
- [ ] **Test with wrong event types** to ensure proper rejection

### Visual Flow Diagram
- [ ] **Create ASCII diagram** showing Subject → Observer flow
```
[Subject] → notifyObservers("EventName")
    ├─→ [Observer1] ✅ or ❌
    ├─→ [Observer2] ✅ or ❌
    └─→ [Observer3] ✅ or ❌
```
- [ ] **Mark successful paths** with ✅
- [ ] **Mark failing paths** with ❌ and reason
- [ ] **Show data passed** at each step

---

## 3. Data Structure Validation

### Parameter Inspection
- [ ] **Check observer.update(event, data) signature** - what parameters does it expect?
- [ ] **Inspect actual data passed** in console logs (log JSON.stringify(data))
- [ ] **Compare expected vs actual structure** - match object shapes
- [ ] **Look for destructuring failures** ({ latitude, longitude } vs { coords: { latitude, longitude }})
- [ ] **Check for null/undefined** where objects are expected

### API Contract Validation
- [ ] **Document producer's data structure** (what Subject sends)
- [ ] **Document consumer's expectations** (what Observer needs)
- [ ] **Identify mismatches** between producer and consumer
- [ ] **Check for nested properties** (coords.latitude vs latitude)
- [ ] **Verify enumerable properties** (important for spread operator)

### Spread Operator Issues (JavaScript-specific)
- [ ] **Identify spread operator usage** ({...object} or [...array])
- [ ] **Check if source is browser API object** (Coordinates, Geolocation, etc.)
- [ ] **Test enumerable properties** with Object.keys() or for...in
- [ ] **Replace spread with explicit destructuring** if needed
- [ ] **Test with real browser APIs** not just mocks

---

## 4. Observer Registration Analysis

### Registration Validation
- [ ] **List all addObserver() calls** with observer class names
- [ ] **Verify observers are registered** before events fire
- [ ] **Check registration timing** (lifecycle methods, initialization)
- [ ] **Look for duplicate registrations** (memory leaks)
- [ ] **Verify removeObserver() calls** (cleanup)

### Observer Implementation Check
- [ ] **Confirm observer.update() method exists** in each class
- [ ] **Check method signature** matches Subject.notifyObservers() call
- [ ] **Verify event filtering logic** (if observer handles multiple events)
- [ ] **Test observer in isolation** (unit test with fake events)
- [ ] **Check for errors in update() implementation** (try/catch logging)

---

## 5. Multi-Phase Notification Analysis

### Phase Detection
- [ ] **Identify notification phases** (e.g., Position → Geocoding → Address Display)
- [ ] **Document expected phase sequence** (Phase 1 → Phase 2 → Phase 3)
- [ ] **Check for phase skipping** (Phase 1 → Phase 3 without Phase 2)
- [ ] **Verify phase transitions** (correct event names between phases)
- [ ] **Test each phase independently** (mock intermediate phases)

### Cascading Notifications
- [ ] **Check if observers are also subjects** (observer receives event, then notifies others)
- [ ] **Trace cascading chains** (A → B → C → D)
- [ ] **Verify data transformation** at each cascade level
- [ ] **Look for circular notifications** (A → B → A loop)
- [ ] **Test phase isolation** (what if Phase 2 fails?)

---

## 6. Test Reality Validation

### Mock vs Real Behavior
- [ ] **Compare test mock structure** to real API response (console.log both)
- [ ] **Identify enumerable property differences** (browser APIs have non-enumerable getters)
- [ ] **Test with real browser APIs** in addition to mocks
- [ ] **Check for tests passing with wrong data** (false positives)
- [ ] **Update mocks to match reality** (copy real structure)

### Real Browser Testing
- [ ] **Run in actual browser** (Chrome DevTools, Firefox Console)
- [ ] **Test with real geolocation API** (navigator.geolocation)
- [ ] **Verify CORS behavior** with real network requests
- [ ] **Check async timing** in real network conditions
- [ ] **Capture real console output** for comparison with tests

---

## 7. Root Cause Diagnosis

### Common Observer Pattern Bugs (Evidence-Based)

**Bug Type 1: Event Type Mismatch**
- [ ] **Symptom**: Observer.update() called but does nothing
- [ ] **Check**: Event filtering logic (if statement)
- [ ] **Fix**: Add event name to accepted list OR fix typo
- [ ] **Example**: `if (event === "PositionManager updated")` but receiving "Position updated"

**Bug Type 2: Data Structure Mismatch**
- [ ] **Symptom**: TypeError, undefined property access
- [ ] **Check**: Parameter destructuring vs actual structure
- [ ] **Fix**: Match destructuring to actual data shape
- [ ] **Example**: Expecting `{ latitude, longitude }` but receiving `{ coords: { latitude, longitude }}`

**Bug Type 3: Spread Operator on Browser API**
- [ ] **Symptom**: Empty object `{}` or missing properties after spread
- [ ] **Check**: Source is browser API with getters
- [ ] **Fix**: Use explicit destructuring instead of spread
- [ ] **Example**: `const pos = { ...coords }` fails, use `{ latitude: coords.latitude, longitude: coords.longitude }`

**Bug Type 4: Wrong Event Propagation**
- [ ] **Symptom**: Display components receive wrong event
- [ ] **Check**: Subject notifying with wrong event name
- [ ] **Fix**: Use correct event constant for each notification
- [ ] **Example**: ReverseGeocoder notifying with "PositionManager updated" instead of "Address fetched"

---

## 8. Fix Implementation Strategy

### Incremental Approach (ONE BUG AT A TIME)
- [ ] **Fix the most foundational bug first** (event type validation before data structure)
- [ ] **Validate fix with test** (update test to match reality)
- [ ] **Run all tests** after each fix (no regressions)
- [ ] **Capture new console output** to verify fix
- [ ] **Document what changed** in checkpoint or commit message

### Testing After Fix
- [ ] **Update tests to match reality** (no false positives)
- [ ] **Run full test suite** (npm test or equivalent)
- [ ] **Test in real browser** (manual validation)
- [ ] **Check console for new errors** (no new bugs introduced)
- [ ] **Verify all phases work** end-to-end

---

## 9. Documentation Requirements

### Bug Report Template
```markdown
## Bug #N: [Short Description]

**Symptom**: [What goes wrong - be specific]

**Root Cause**: [WHY it happens - analysis]

**Evidence**: [Console logs, test output, screenshots]

**Fix**: [Code changes made - diffs]

**Validation**: [How we know it's fixed - test results]
```

### Flow Diagram Requirements
- [ ] **Before diagram** showing broken flow
- [ ] **After diagram** showing fixed flow
- [ ] **Highlight changes** with annotations
- [ ] **Include event names** and data structures
- [ ] **Show all phases** if multi-phase pattern

---

## 10. Success Criteria

- [ ] ✅ **All observers receive expected events** (no missing notifications)
- [ ] ✅ **All event types validated correctly** (no rejections of valid events)
- [ ] ✅ **All data structures match** (no TypeErrors, no undefined access)
- [ ] ✅ **All tests passing** with realistic mocks
- [ ] ✅ **Real browser testing successful** (end-to-end validation)
- [ ] ✅ **Console logs clean** (no errors, proper event flow)
- [ ] ✅ **Documentation complete** (checkpoints, flow diagrams, bug reports)

---

## Quick Reference: Evidence-First Workflow

```
1. CAPTURE console logs (raw evidence)
   ↓
2. EXTRACT event timeline (what happened when)
   ↓
3. DIAGRAM flow (visual representation)
   ↓
4. IDENTIFY mismatches (expected vs actual)
   ↓
5. HYPOTHESIZE root cause (WHY not just WHAT)
   ↓
6. FIX incrementally (one bug at a time)
   ↓
7. VALIDATE with tests + real browser
   ↓
8. DOCUMENT (checkpoint with flow diagrams)
```

---

**Template Version**: 1.0  
**Last Updated**: 2026-02-14  
**Source Session**: Guia Turístico Observer Pattern Debugging (4 bugs fixed)  
**Transferability**: High (95%) - Applicable to any Observer/Subject pattern implementation
