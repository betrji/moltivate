# Shared contracts

`session-contract.json` is the JSON Schema for the workout-session contract
consumed by the backend foundation. It is generated, not hand-written —
regenerate it after changing `services/api/app/schemas.py::WorkoutSessionContract`:

```sh
cd services/api
python scripts/export_contract.py
```

No other contracts (mobile client types, Anchor IDL) exist yet; see
[architecture.md](../../architecture.md) for the proposed full layout.
