# Async Flow & Network Debugging Checklist

**Purpose**: Systematic debugging guide for asynchronous operations and network request issues  
**Source**: Guia Turístico CORS retry and async chain debugging  
**Transferability**: 85% (some CORS patterns are web-specific, but async patterns universal)

---

## 1. Evidence Collection

- [ ] **Capture complete console logs** including network errors
- [ ] **Extract timing information** (request start, completion, failure)
- [ ] **Save network tab output** (Chrome DevTools → Network)
- [ ] **Document error messages** (exact text, error codes)
- [ ] **Capture stack traces** for async errors
- [ ] **Record timing sequences** (what happens when)

---

## 2. Async Chain Analysis

### Promise Chain Mapping
- [ ] **Identify all async operations** (fetch, Promise, async/await)
- [ ] **Document promise chain** (A.then(B).then(C).catch(D))
- [ ] **Trace data transformations** at each step
- [ ] **Check for unhandled rejections** (Promise without .catch())
- [ ] **Verify error propagation** (does catch block receive all errors?)

### Timing & Race Conditions
- [ ] **Document expected timing** (how long should each operation take?)
- [ ] **Measure actual timing** (console.time/timeEnd or timestamps)
- [ ] **Identify race conditions** (does order matter? Can operations overlap?)
- [ ] **Check for timing assumptions** (code expects A before B)
- [ ] **Test with delayed responses** (simulate slow network)

### Visual Flow Diagram
- [ ] **Create ASCII diagram** showing async flow
```
[API Call] → fetchAddress()
    ├─→ Direct API ❌ (CORS error)
    └─→ Retry Logic
        └─→ CORS Proxy ✅ (success)
            └─→ notifyObservers("Address fetched")
```
- [ ] **Mark success/failure paths**
- [ ] **Show retry mechanisms**
- [ ] **Include timing annotations**

---

## 3. Network Request Validation

### Request Inspection
- [ ] **Check request URL** (typos, missing parameters, wrong endpoint)
- [ ] **Verify HTTP method** (GET, POST, PUT, DELETE)
- [ ] **Inspect headers** (Content-Type, Authorization, Accept)
- [ ] **Check request body** (JSON format, required fields)
- [ ] **Verify query parameters** (encoding, special characters)

### Response Analysis
- [ ] **Check status code** (200, 400, 404, 500, etc.)
- [ ] **Inspect response headers** (Content-Type, CORS headers)
- [ ] **Validate response body** (JSON structure, expected fields)
- [ ] **Check for partial responses** (truncated data, missing fields)
- [ ] **Measure response size** (too large? Too small?)

### Error Response Handling
- [ ] **Document error format** (JSON error object structure)
- [ ] **Check error codes** (application-specific error codes)
- [ ] **Verify error messages** are user-friendly
- [ ] **Test error propagation** to UI layer
- [ ] **Check for generic error handling** (are specific errors lost?)

---

## 4. CORS (Cross-Origin Resource Sharing) Analysis

### CORS Error Detection
- [ ] **Check for CORS errors** in console (specific error message)
- [ ] **Identify blocked origin** (which domain is blocked?)
- [ ] **Verify request headers** (Origin, Referer)
- [ ] **Check preflight requests** (OPTIONS method)
- [ ] **Test in different browsers** (CORS behavior varies)

### CORS Configuration Validation
- [ ] **Check server CORS headers** (Access-Control-Allow-Origin)
- [ ] **Verify allowed methods** (Access-Control-Allow-Methods)
- [ ] **Check allowed headers** (Access-Control-Allow-Headers)
- [ ] **Test credentials handling** (Access-Control-Allow-Credentials)
- [ ] **Verify wildcard usage** (* is restricted with credentials)

### CORS Proxy Pattern
- [ ] **Implement proxy fallback** (try direct → fallback to proxy)
- [ ] **Document proxy URL** (what proxy service is used?)
- [ ] **Test proxy availability** (is it rate-limited? Reliable?)
- [ ] **Check proxy headers** (does it add/remove headers?)
- [ ] **Measure proxy latency** (how much slower than direct?)

---

## 5. Retry Logic Implementation

### Retry Strategy
- [ ] **Define retry conditions** (network error? 5xx status? Timeout?)
- [ ] **Set retry limits** (max 3 attempts typical)
- [ ] **Implement backoff strategy** (exponential backoff: 100ms, 200ms, 400ms)
- [ ] **Add jitter** (randomize delays to avoid thundering herd)
- [ ] **Document terminal conditions** (when to stop retrying)

### Retry Implementation Checklist
- [ ] **Count attempts** (track retry number)
- [ ] **Log each retry** (timestamp, attempt number, reason)
- [ ] **Check for infinite loops** (does retry exit eventually?)
- [ ] **Preserve original error** (don't lose first error in retry chain)
- [ ] **Test retry exhaustion** (what happens after max retries?)

### Retry Pattern Example
```javascript
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Attempt ${attempt}/${maxRetries}: ${url}`);
      const response = await fetch(url, options);
      
      if (response.ok) {
        return await response.json();
      }
      
      // Check if retryable status code
      if (response.status >= 500 || response.status === 429) {
        lastError = new Error(`HTTP ${response.status}`);
        await delay(Math.pow(2, attempt - 1) * 100); // Exponential backoff
        continue;
      }
      
      // Non-retryable error
      throw new Error(`HTTP ${response.status}`);
      
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      await delay(Math.pow(2, attempt - 1) * 100);
    }
  }
  
  throw lastError;
}
```

---

## 6. Error Propagation Analysis

### Error Handling Path
- [ ] **Trace error from source** to final handler
- [ ] **Check catch blocks** at each level
- [ ] **Verify error transformation** (is error wrapped/modified?)
- [ ] **Test error display** (does user see meaningful message?)
- [ ] **Check error logging** (is error logged for debugging?)

### Observer Notification on Error
- [ ] **Document error events** (e.g., "Geocoding error")
- [ ] **Verify observers receive error event** (not just success events)
- [ ] **Check error data structure** (what information is passed?)
- [ ] **Test UI error state** (does UI show error appropriately?)
- [ ] **Verify error recovery** (can user retry? Does system auto-recover?)

---

## 7. Async Testing Strategy

### Test Timing Control
- [ ] **Use fake timers** (Jest: jest.useFakeTimers())
- [ ] **Control promise resolution** (resolve manually in tests)
- [ ] **Mock network requests** (fetch, axios, etc.)
- [ ] **Test timeout scenarios** (what if request never completes?)
- [ ] **Test race conditions** (parallel requests, order sensitivity)

### Test Coverage Checklist
- [ ] **Success path** (happy path with valid response)
- [ ] **Network error** (fetch throws error)
- [ ] **HTTP error** (4xx, 5xx status codes)
- [ ] **Timeout** (request exceeds time limit)
- [ ] **Retry exhaustion** (all retries fail)
- [ ] **CORS error** (specific to web)
- [ ] **Partial response** (JSON parsing error)
- [ ] **Concurrent requests** (multiple operations in parallel)

---

## 8. Real Network Testing

### Browser DevTools Validation
- [ ] **Open Network tab** (Chrome DevTools → Network)
- [ ] **Enable "Preserve log"** (keep logs across page loads)
- [ ] **Filter by type** (XHR, Fetch, JS)
- [ ] **Check request details** (Headers, Payload, Preview, Response)
- [ ] **Measure timing** (Waiting, Content Download)

### Network Condition Simulation
- [ ] **Test with throttling** (DevTools → Network → Throttling)
- [ ] **Test offline mode** (DevTools → Network → Offline)
- [ ] **Test slow 3G** (realistic mobile conditions)
- [ ] **Test packet loss** (use browser extensions or OS settings)
- [ ] **Test request cancellation** (navigate away during request)

---

## 9. Common Async/Network Bugs

### Bug Type 1: Unhandled Promise Rejection
- [ ] **Symptom**: Silent failure, no error message
- [ ] **Check**: Missing .catch() or try/catch
- [ ] **Fix**: Add error handling at promise chain end
- [ ] **Example**: `fetch(url).then(r => r.json()).then(process)` → add `.catch(handleError)`

### Bug Type 2: CORS Blocked Request
- [ ] **Symptom**: Network error, CORS message in console
- [ ] **Check**: Server CORS headers, preflight requests
- [ ] **Fix**: Add CORS headers on server OR use CORS proxy
- [ ] **Example**: Direct API fails → retry with `cors-anywhere` proxy

### Bug Type 3: Race Condition
- [ ] **Symptom**: Inconsistent behavior, wrong data displayed
- [ ] **Check**: Multiple requests completing in wrong order
- [ ] **Fix**: Add request cancellation or request ID tracking
- [ ] **Example**: User types fast → cancel previous search requests

### Bug Type 4: Timeout Without Feedback
- [ ] **Symptom**: Request hangs indefinitely
- [ ] **Check**: Missing timeout configuration
- [ ] **Fix**: Add AbortController with timeout
- [ ] **Example**: `setTimeout(() => controller.abort(), 5000)`

### Bug Type 5: Error Lost in Chain
- [ ] **Symptom**: Generic "something went wrong" shown to user
- [ ] **Check**: Error transformation losing original message
- [ ] **Fix**: Preserve original error details through chain
- [ ] **Example**: Keep `error.response.data` when wrapping errors

---

## 10. Performance Optimization

### Request Optimization
- [ ] **Implement caching** (avoid redundant requests)
- [ ] **Use request deduplication** (multiple components requesting same data)
- [ ] **Add request cancellation** (AbortController for stale requests)
- [ ] **Batch requests** (combine multiple requests when possible)
- [ ] **Use pagination** (don't fetch all data at once)

### Async Operation Optimization
- [ ] **Parallelize independent operations** (Promise.all for concurrent fetches)
- [ ] **Use streaming** for large responses (fetch + Response.body.getReader())
- [ ] **Implement prefetching** (anticipate next request)
- [ ] **Add loading states** (show progress during long operations)
- [ ] **Optimize retry delays** (balance UX and server load)

---

## 11. Documentation Requirements

### Async Flow Diagram
```markdown
## Async Flow: fetchAddress()

[User Action] → getCurrentPosition()
    ↓
[GeolocationService] → success callback
    ↓
[PositionManager] → notifyObservers("PositionManager updated")
    ↓
[ReverseGeocoder] → fetchAddress()
    ├─→ Direct API ❌ (CORS error - 15ms)
    │   └─→ Log error, prepare retry
    └─→ CORS Proxy Retry
        ├─→ Proxy URL: https://cors-anywhere.herokuapp.com/...
        ├─→ Success ✅ (420ms total)
        └─→ notifyObservers("Address fetched", data)
            └─→ [HTMLAddressDisplayer] → render address
```

### Timing Analysis
- [ ] **Create timing table**
```
| Operation          | Expected | Actual | Status |
|-------------------|----------|--------|--------|
| Geolocation API   | < 1s     | 0.5s   | ✅      |
| Direct Geocoding  | < 500ms  | 15ms   | ❌ CORS |
| CORS Proxy Retry  | < 2s     | 420ms  | ✅      |
| Total Flow        | < 3s     | 935ms  | ✅      |
```

---

## 12. Success Criteria

- [ ] ✅ **All async operations complete** (no hanging promises)
- [ ] ✅ **All errors handled gracefully** (no unhandled rejections)
- [ ] ✅ **CORS issues resolved** (either server-side or proxy)
- [ ] ✅ **Retry logic working** (auto-recovery from transient failures)
- [ ] ✅ **Performance acceptable** (operations complete in reasonable time)
- [ ] ✅ **Real network testing successful** (validated in browser)
- [ ] ✅ **Error messages user-friendly** (actionable, not technical)

---

## Quick Reference: Async Debugging Workflow

```
1. CAPTURE network logs + console output
   ↓
2. EXTRACT timing sequence (when did what happen)
   ↓
3. DIAGRAM async flow (success/failure paths)
   ↓
4. IDENTIFY bottlenecks/failures
   ↓
5. TEST retry logic + error handling
   ↓
6. VALIDATE with real network conditions
   ↓
7. OPTIMIZE (caching, parallelization, cancellation)
   ↓
8. DOCUMENT (flow diagrams, timing analysis)
```

---

**Template Version**: 1.0  
**Last Updated**: 2026-02-14  
**Source Session**: Guia Turístico CORS & Async Debugging  
**Transferability**: Medium-High (85%) - Core async patterns universal, CORS specific to web
