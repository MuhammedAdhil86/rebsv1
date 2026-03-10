import axiosInstance from "./axiosinstance";
import { 
  getAssetDashboard, 
  postCreateAsset, 
  getAssetType, 
  getAssetAllocatebyId, 
   getAssets,
  postAssetAllocation, 
  postReturnAsset, 
  addAssetType 
} from "../api/api";

export const fetchAssets = async () => {
  try {
    const response = await axiosInstance.get(getAssets);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchDashboard = async () => {
  try {
    const response = await axiosInstance.get(getAssetDashboard);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const createAsset = async (assetData) => {
  try {
    const response = await axiosInstance.post(postCreateAsset, assetData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const assetType = async () => {
  try {
    const response = await axiosInstance.get(getAssetType);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAssetAllocationById = async (id) => {
  try {
    const response = await axiosInstance.get(getAssetAllocatebyId(id));
    // Log the raw response to check status_code and data structure
    console.log("Fetch Allocation Response for ID:", id, response.data);
    return response.data;
  } catch (error) {
    // Log the error details for debugging
    console.error("Error fetching asset allocation by ID:", id, error);
    throw error;
  }
};
export const allocateAsset = async (payload) => {
  try {
    const response = await axiosInstance.post(postAssetAllocation, payload);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const returnAsset = async (assetId, staffId) => {
  try {
    const response = await axiosInstance.post(postReturnAsset, {
      asset_id: assetId,
      staff_id: staffId,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error.message;
  }
};

export const fetchAssetAllocateId = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/assetallocation/get/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addAsset = async (assetType) => {
  try {
    const response = await axiosInstance.post(addAssetType, assetType);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAsset = async (id, editAsset) => {
  try {
    const response = await axiosInstance.put(
      `/admin/asset/update/${id}`,
      editAsset,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};