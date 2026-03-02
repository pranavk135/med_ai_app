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

    # Use dynamic PORT from environment or fallback to 8000
    port = int(os.environ.get("PORT", 8000))
    # Disable reload in production (when PORT is provided by hosting like Render)
    is_prod = "PORT" in os.environ
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=not is_prod)