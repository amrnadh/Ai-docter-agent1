import logging
import os
import time

import httpx

logger = logging.getLogger(__name__)

# HTTP statuses / errors HF returns while a free Space is asleep or booting.
_WAKING_STATUSES = {502, 503, 504}
WAKING_MESSAGE = (
    "The imaging model is waking up (free-tier hosting sleeps when idle). "
    "This takes about a minute. Please try again shortly."
)


class HFSpaceClient:
    def __init__(self):
        self.pytorch_space_url = os.getenv("HF_PYTORCH_SPACE_URL", "https://amar-nadh-medsage-pytorch.hf.space").rstrip("/")
        self.tensorflow_space_url = os.getenv("HF_TENSORFLOW_SPACE_URL", "https://amar-nadh-medsage-tensorflow.hf.space").rstrip("/")
        # Private Spaces need a token; public ones ignore it.
        token = os.getenv("HUGGINGFACE_TOKEN")
        self.headers = {"Authorization": f"Bearer {token}"} if token else {}
        # First request after sleep also downloads weights, so allow a while.
        self.timeout = httpx.Timeout(90.0, connect=15.0)
        self.retries = int(os.getenv("HF_WAKE_RETRIES", "2"))

    def _post_image_sync(self, url: str, image_bytes: bytes, filename: str = "image.jpg") -> dict:
        last_error = ""
        for attempt in range(self.retries + 1):
            try:
                with httpx.Client(timeout=self.timeout, headers=self.headers) as client:
                    files = {"file": (filename, image_bytes, "image/jpeg")}
                    response = client.post(url, files=files)
                if response.status_code in _WAKING_STATUSES:
                    last_error = f"HTTP {response.status_code}"
                else:
                    response.raise_for_status()
                    return response.json()
            except (httpx.ConnectError, httpx.TimeoutException) as e:
                last_error = repr(e)
            except Exception as e:
                logger.error(f"Error calling HF Space at {url}: {e}")
                return {"error": str(e), "success": False}
            if attempt < self.retries:
                time.sleep(10 * (attempt + 1))
        logger.warning(f"HF Space at {url} still waking after retries: {last_error}")
        return {"error": WAKING_MESSAGE, "warming_up": True, "success": False}

    def space_status(self, base_url: str) -> str:
        """'ready' | 'waking' | 'down'. Calling /health also nudges a sleeping Space awake."""
        try:
            r = httpx.get(f"{base_url}/health", timeout=8.0, headers=self.headers)
            if r.status_code == 200:
                return "ready"
            return "waking" if r.status_code in _WAKING_STATUSES else "down"
        except (httpx.ConnectError, httpx.TimeoutException):
            return "waking"
        except Exception:
            return "down"

    def status(self) -> dict:
        return {
            "pytorch": self.space_status(self.pytorch_space_url),
            "tensorflow": self.space_status(self.tensorflow_space_url),
        }

    def predict_brain_tumor(self, image_bytes: bytes) -> dict:
        return self._post_image_sync(f"{self.pytorch_space_url}/predict/brain-tumor", image_bytes)

    def predict_brain_tumor_vit(self, image_bytes: bytes) -> dict:
        return self._post_image_sync(f"{self.pytorch_space_url}/predict/brain-tumor-vit", image_bytes)

    def predict_covid_xray(self, image_bytes: bytes) -> dict:
        return self._post_image_sync(f"{self.pytorch_space_url}/predict/covid-xray", image_bytes)

    def predict_skin_lesion(self, image_bytes: bytes) -> dict:
        return self._post_image_sync(f"{self.pytorch_space_url}/predict/skin-lesion", image_bytes)

    def predict_xray_pneumonia(self, image_bytes: bytes, filename: str = "image.jpg") -> dict:
        return self._post_image_sync(f"{self.tensorflow_space_url}/predict/xray-pneumonia", image_bytes, filename=filename)


# Global singleton
hf_client = HFSpaceClient()
