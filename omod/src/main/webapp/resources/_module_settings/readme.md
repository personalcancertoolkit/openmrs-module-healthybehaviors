Enabled behaviors dictite which behaviors the `behavior_data_loader.js` object is able to load, or loads upon all. 
- This enables users of this module to turn on and off specific behaviors from their implementation
- if `enabled_behaviors.json` does not exist, `enabled_behaviors.default.json` is used in its place
- `enabled_behaviors.default.json` should not be changed if contributing to the repository.