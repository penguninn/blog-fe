import axiosInstance from "@/api/axiosInstance";
import { API_ENDPOINTS } from "@/constants";
import type { AssetInfo } from "@/types";
import { normalizeEnvelope } from "@/utils/apiHelpers";

export interface UploadOptions {
  onProgress?: (percent: number) => void;
}

export const assetService = {
  uploadImage: async (file: File, options: UploadOptions = {}) => {
    const form = new FormData();
    form.append("file", file);

    const res = await axiosInstance.post<AssetInfo | { data: AssetInfo }>(
      API_ENDPOINTS.ASSETS_UPLOAD,
      form,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (evt) => {
          if (!options.onProgress) return;
          if (!evt.total) return options.onProgress(0);
          const pct = Math.min(99, Math.round((evt.loaded / evt.total) * 100));
          options.onProgress(pct);
        },
      }
    );

    const data = normalizeEnvelope<AssetInfo>(res.data as AssetInfo | import("@/types").ApiEnvelope<AssetInfo>);
    // Final tick to 100 after server confirms
    options.onProgress?.(100);
    return data;
  },
};

export type AssetService = typeof assetService;
