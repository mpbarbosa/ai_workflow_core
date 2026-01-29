# Machine Learning Optimization Guide

**Version**: 2.7.0  
**Status**: Production Ready  
**Last Updated**: 2026-01-01

## Overview

The ML Optimization module provides predictive workflow intelligence that learns from historical execution patterns to optimize workflow performance.

## Quick Start

### Enable ML Optimization

```bash
# Basic ML optimization
./src/workflow/execute_tests_docs_workflow.sh --ml-optimize

# ML + other optimizations (RECOMMENDED)
./src/workflow/execute_tests_docs_workflow.sh \
  --ml-optimize \
  --smart-execution \
  --parallel \
  --auto

# Check ML system status
./src/workflow/execute_tests_docs_workflow.sh --show-ml-status
```

## Requirements

- **Minimum Training Samples**: 10 historical workflow executions
- **Dependencies**: `jq` (JSON processing), `bc` (calculations)
- **Storage**: `.ml_data/` directory (~1-5 MB for 100 runs)

## Features

### 1. Step Duration Prediction

Predicts how long each step will take based on:
- File change patterns (docs, code, tests, config)
- Number of files modified
- Lines added/deleted
- Directory depth
- Historical performance data

**Example Output**:
```
Predicted workflow duration: 12m (720s)
Step 5 (Test Review): 45s (based on 15 similar executions)
```

### 2. Smart Parallelization Recommendations

Automatically recommends optimal parallelization strategy:
- **Sequential**: For complex changes requiring careful validation
- **Parallel**: For independent validation steps
- **3-way-parallel**: For documentation-only changes
- **4-track-parallel**: For large code changes
- **test-sharding**: For extensive test suites

**Decision Factors**:
- Historical performance with/without parallelization
- Change type (docs-only, code-only, mixed)
- File count and complexity
- System resource availability

### 3. Skip Step Recommendations

ML learns which steps consistently find no issues for specific change patterns:

**Example Scenarios**:
- Documentation-only changes → Skip steps 5, 6, 7, 8, 9 (tests, code quality)
- Test-only changes → Skip steps 1, 2 (documentation updates)
- Configuration changes → Run full validation

**Learning Process**:
- Tracks which steps find issues for each change type
- Recommends skips when steps never found issues (5+ runs)
- Combines ML insights with rule-based safety checks

### 4. Anomaly Detection

Detects unusual workflow behavior:
- Steps taking 2x+ longer than predicted
- Unexpected failures in normally reliable steps
- Performance degradation trends

**Alerts**:
```
🚨 ANOMALY DETECTED: Step 7 took 180s (expected 60s)
   Deviation: 200%
```

### 5. Continuous Learning

System improves with each execution:
- Records features for every workflow run
- Tracks step durations and outcomes
- Updates predictions with recent data
- Retrains models every 24 hours

## Data Structure

### Training Data Format

```json
{
  "step": 5,
  "duration": 45,
  "features": {
    "change_type": "code_only",
    "total_files": 12,
    "code_files": 8,
    "test_files": 3,
    "lines_changed": 234
  },
  "issues_found": 2,
  "timestamp": 1735776000,
  "parallel": true,
  "date": "2026-01-01 19:30:00"
}
```

### Storage Locations

```
.ml_data/
├── training_data.jsonl      # Historical execution data
├── anomalies.jsonl          # Detected anomalies
├── predictions.json         # Current run predictions
└── models/
    ├── statistics.json      # Cached statistics
    └── last_training.txt    # Last training timestamp
```

## Performance Impact

### Expected Improvements

| Scenario | Baseline | With ML | Combined (ML + Smart + Parallel) |
|----------|----------|---------|----------------------------------|
| Docs Only | 23 min | 18 min (22% faster) | 2 min (91% faster) |
| Code Changes | 23 min | 17 min (26% faster) | 8 min (65% faster) |
| Full Changes | 23 min | 18 min (22% faster) | 12 min (48% faster) |

### Accuracy Metrics

**After 10 Runs**: 40-60% prediction accuracy  
**After 50 Runs**: 70-85% prediction accuracy  
**After 100 Runs**: 85-95% prediction accuracy

## Usage Examples

### Example 1: First-Time Setup

```bash
# Run 10 workflows to collect training data
for i in {1..10}; do
  ./src/workflow/execute_tests_docs_workflow.sh \
    --smart-execution \
    --parallel \
    --auto
done

# Check ML status
./src/workflow/execute_tests_docs_workflow.sh --show-ml-status

# Enable ML optimization
./src/workflow/execute_tests_docs_workflow.sh \
  --ml-optimize \
  --smart-execution \
  --parallel \
  --auto
```

### Example 2: Target Project with ML

```bash
# Target project with full optimization stack
./src/workflow/execute_tests_docs_workflow.sh \
  --target /path/to/project \
  --ml-optimize \
  --smart-execution \
  --parallel \
  --auto-commit \
  --auto
```

### Example 3: Monitoring ML Performance

```bash
# Check training data
cat .ml_data/training_data.jsonl | wc -l  # Number of samples

# View recent predictions
cat .ml_data/predictions.json | jq .

# Check for anomalies
cat .ml_data/anomalies.jsonl | tail -5
```

## Advanced Configuration

### Tuning Parameters

Edit `src/workflow/lib/ml_optimization.sh`:

```bash
# Minimum samples before ML activates
MIN_TRAINING_SAMPLES=10  # Default: 10, increase for better accuracy

# Retraining frequency
RETRAINING_INTERVAL=86400  # Default: 24 hours (in seconds)
```

### Feature Engineering

Current features extracted:
- `change_type`: docs_only, code_only, test_only, config_change, mixed
- `total_files`: Number of modified files
- `doc_files`: Documentation file count
- `code_files`: Source code file count
- `test_files`: Test file count
- `config_files`: Configuration file count
- `lines_added`: Lines added
- `lines_deleted`: Lines deleted
- `lines_changed`: Total line changes
- `max_depth`: Maximum directory depth
- `hour_of_day`: Execution time (0-23)
- `day_of_week`: Day of week (1-7)

## Troubleshooting

### ML System Not Ready

**Symptom**: `ML: Only X samples (need 10 for predictions)`

**Solution**:
```bash
# Run more workflows to collect training data
./src/workflow/execute_tests_docs_workflow.sh --auto

# Or reduce minimum samples (not recommended)
export MIN_TRAINING_SAMPLES=5
```

### Poor Prediction Accuracy

**Symptom**: `Prediction error: 150%`

**Possible Causes**:
1. Insufficient training data (< 50 samples)
2. High variability in workflow execution times
3. System resource contention
4. Change patterns not seen before

**Solutions**:
- Collect more training data
- Analyze anomalies: `cat .ml_data/anomalies.jsonl`
- Review statistics: `cat .ml_data/models/statistics.json | jq .`

### Data Reset

```bash
# Reset ML training data (start fresh)
rm -rf .ml_data/

# System will recreate on next run
./src/workflow/execute_tests_docs_workflow.sh --ml-optimize
```

## Best Practices

1. **Collect Diverse Training Data**
   - Run workflows with different change types
   - Include both small and large changes
   - Execute during different times of day

2. **Monitor Accuracy**
   - Review prediction validation after each run
   - Investigate anomalies
   - Reset data if accuracy < 50% after 50+ runs

3. **Combine Optimizations**
   - Use ML with `--smart-execution` and `--parallel`
   - Enable AI caching for token savings
   - Use workflow templates for consistent patterns

4. **Regular Maintenance**
   - Check ML status monthly: `--show-ml-status`
   - Review anomalies quarterly
   - Consider data reset if project structure changes significantly

## Integration with CI/CD

### GitHub Actions Example

```yaml
name: ML-Optimized Workflow

on: [push, pull_request]

jobs:
  workflow:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Run AI Workflow with ML
        run: |
          /path/to/ai_workflow/src/workflow/execute_tests_docs_workflow.sh \
            --ml-optimize \
            --smart-execution \
            --parallel \
            --auto \
            --ai-batch
      
      - name: Archive ML Data
        uses: actions/upload-artifact@v3
        with:
          name: ml-training-data
          path: .ml_data/
```

## Roadmap

### v2.8.0 (Planned)
- Multi-project ML model sharing
- Neural network-based predictions
- GPU acceleration support
- Real-time performance monitoring dashboard

### v3.0.0 (Future)
- Cross-repository ML insights
- Team-wide performance benchmarks
- Automated A/B testing of optimization strategies
- ML-driven test case prioritization

## Support

- **Documentation**: [docs/PROJECT_REFERENCE.md](PROJECT_REFERENCE.md)
- **Issues**: [GitHub Issues](https://github.com/mpbarbosa/ai_workflow/issues)
- **Contributing**: [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Last Updated**: 2026-01-01  
**Version**: 2.7.0  
**Author**: Marcelo Pereira Barbosa ([@mpbarbosa](https://github.com/mpbarbosa))
