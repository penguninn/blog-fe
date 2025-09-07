export interface AssetInfo {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

export interface UploadAssetResponse {
  success?: boolean;
  data: AssetInfo;
}

