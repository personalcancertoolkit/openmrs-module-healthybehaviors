## Requirements for a Valid Behavior
- `unique_behavior_id` must be defined and must be the same as the `.json` file name


## Chart data
- chart data requires the `chart_static.type` and `chart_static.options` data to be defined exactly as its expected to be implemented, it is simply passed along
- the eventual `chart.data` object (which ChartJS expects), however, is generated by the abstract_behavior_class, based on both the `chart_static.dataset_options` (staticly defined) and `history` (database defined/dynamic) data/
    - class maps history to dataset_options based on the type of chart.
- note, data is ordered in ASC order by time stamp. 