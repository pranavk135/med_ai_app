import os
from dotenv import load_dotenv

# Load API keys BEFORE any AI sub-modules are evaluated!
load_dotenv()

import uvicorn

if __name__ == "__main__":
    import sys

    backend_dir = os.path.dirname(os.path.abspath(__file__))
    if backend_dir not in sys.path:
        sys.path.insert(0, backend_dir)

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)