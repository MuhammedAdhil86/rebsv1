import axiosInstance from "./axiosinstance";
import { 
  getAssetDashboard, 
  postCreateAsset, 
  getAssetType, 
  getAssetAllocatebyId, 
  getAssetstype, 
  postAssetAllocation, 
  postReturnAsset, 
  FetchAssets, 
  addAssetType 
} from "../api/api";

/**
 * @description Senior Developer Transformation Layer.
 * This is the "Gatekeeper" that ensures the Detail Component 
 * receives the image and correct naming conventions.
 */
const transformAsset = (asset) => ({
  id: asset.id ?? "",
  asset_name: asset.asset_name || asset.name || "N/A", 
  asset_type: asset.asset_type || asset.type || "General",
  asset_type_id: asset.asset_type_id || "N/A",
  asset_status: asset.asset_status || asset.status || "available",
  condition: asset.condition ?? "Good",
  purchase_date: asset.purchase_date ?? null,
  last_maintenance: asset.last_maintenance ?? null,
  created_on: asset.created_on || asset.createdOn || null,
  
  // ✅ CRITICAL: Ensure the image URL is passed through
  image: asset.image || null,
  
  // ✅ CRITICAL: Staff details for the Detail Component
  staff_id: asset.staff_id || null,
  staff_name: asset.staff_name || "N/A",

  // Digital Assets logic
  isDigital: Boolean(
    asset.is_digital || 
    (asset.asset_type || asset.type || "").toLowerCase().includes("digital")
  ),
});

/**
 * @description Centralized Error Handler
 */
const handleError = (error, context) => {
  const normalizedError = error instanceof Error 
    ? error 
    : new Error(`${context} failed`, { cause: error });
  
  if (import.meta.env.DEV) {
    console.group(`❌ Service Error: ${context}`);
    console.error("Original Error:", normalizedError.cause || error);
    console.groupEnd();
  }
  throw normalizedError;
};

// --- SERVICES ---

export const fetchAssets = async () => {
  try {
    const { data } = await axiosInstance.get(FetchAssets);
    
    if (import.meta.env.DEV) {
      console.groupCollapsed("📡 API Trace: fetchAssets (Inventory)");
      console.table(data?.data?.slice(0, 5));
      console.groupEnd();
    }

    if (!data?.data || !Array.isArray(data.data)) return [];

    return data.data.map(transformAsset);
  } catch (error) {
    handleError(error, "fetchAssets");
  }
};

export const fetchDashboard = async () => {
  try {
    const { data } = await axiosInstance.get(getAssetDashboard);
    return data?.data ?? null;
  } catch (error) {
    handleError(error, "fetchDashboard");
  }
};

export const createAsset = async (assetData) => {
  try {
    const { data } = await axiosInstance.post(postCreateAsset, assetData);
    return data?.data ?? data;
  } catch (error) {
    handleError(error, "createAsset");
  }
};

export const assetType = async () => {
  try {
    const { data } = await axiosInstance.get(getAssetType);
    return data?.data ?? [];
  } catch (error) {
    handleError(error, "assetType");
  }
};

export const addAsset = async (assetTypeData) => {
  try {
    const { data } = await axiosInstance.post(addAssetType, assetTypeData);
    return data;
  } catch (error) {
    handleError(error, "addAsset");
  }
};

export const fetchAssetAllocationById = async (id) => {
  try {
    const { data } = await axiosInstance.get(getAssetAllocatebyId(id));
    return data;
  } catch (error) {
    handleError(error, `fetchAssetAllocationById(${id})`);
  }
};

export const allocateAsset = async (payload) => {
  try {
    const { data } = await axiosInstance.post(postAssetAllocation, payload);
    return data;
  } catch (error) {
    throw error.response?.data || new Error(error.message);
  }
};

export const returnAsset = async (assetId, staffId) => {
  try {
    const { data } = await axiosInstance.post(postReturnAsset, {
      asset_id: assetId,
      staff_id: staffId,
    });
    return data;
  } catch (error) {
    throw error.response?.data || new Error(error.message);
  }
};

export const updateAsset = async (id, editAsset) => {
  try {
    const { data } = await axiosInstance.put(
      `/admin/asset/update/${id}`,
      editAsset,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
    return data;
  } catch (error) {
    handleError(error, `updateAsset(${id})`);
  }
};