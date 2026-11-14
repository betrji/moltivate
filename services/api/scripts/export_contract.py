"""Regenerate packages/contracts/session-contract.json from the pydantic
model that is the actual source of truth: app.schemas.WorkoutSessionContract.

Run from services/api/: `python scripts/export_contract.py`
"""

import json
import pathlib
import sys

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent.parent))

from app.schemas import WorkoutSessionContract  # noqa: E402

OUTPUT_PATH = pathlib.Path(__file__).resolve().parent.parent.parent.parent / "packages" / "contracts" / "session-contract.json"


def main() -> None:
    schema = WorkoutSessionContract.model_json_schema()
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(schema, indent=2) + "\n")
    print(f"wrote {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
