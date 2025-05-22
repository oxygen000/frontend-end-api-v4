import { apiClient } from './client';
import type { RecognitionResult } from './types';

/**
 * Functions for face recognition and verification
 */

/**
 * Recognize a face using file upload
 * @param file The image file to analyze
 * @param preselectedId Optional user ID to narrow search
 * @param includeThreshold Optional similarity threshold (0-1) to include similar faces
 * @param maxResults Optional maximum number of similar results to return
 * @returns Recognition result with user data if recognized and similar matches
 */
const recognizeFace = async (
  file: File,
  preselectedId?: string,
  includeThreshold: number = 0.6,
  maxResults: number = 5
): Promise<RecognitionResult> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    if (preselectedId) {
      formData.append('id', preselectedId);
    }

    // Add parameters for similar faces
    formData.append('include_similar', 'true');
    formData.append('similarity_threshold', includeThreshold.toString());
    formData.append('max_results', maxResults.toString());

    const response = await apiClient.post('/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Face recognition error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Recognition failed with unknown error'
    );
  }
};

/**
 * Recognize a face using base64 image
 * @param base64Image Base64-encoded image data
 * @param preselectedId Optional user ID to narrow search
 * @param includeThreshold Optional similarity threshold (0-1) to include similar faces
 * @param maxResults Optional maximum number of similar results to return
 * @returns Recognition result with user data if recognized and similar matches
 */
const recognizeFaceBase64 = async (
  base64Image: string,
  preselectedId?: string,
  includeThreshold: number = 0.6,
  maxResults: number = 5
): Promise<RecognitionResult> => {
  try {
    // Ensure the base64 string is properly formatted
    const formattedBase64 = base64Image.startsWith('data:image')
      ? base64Image.split(',')[1]
      : base64Image;

    if (!formattedBase64) {
      throw new Error(
        'No image provided. Please upload a file or provide base64 data.'
      );
    }

    // Create the payload
    const formData = new FormData();
    formData.append('image_base64', formattedBase64);

    if (preselectedId) {
      formData.append('id', preselectedId);
    }

    // Add parameters for similar faces
    formData.append('include_similar', 'true');
    formData.append('similarity_threshold', includeThreshold.toString());
    formData.append('max_results', maxResults.toString());

    const response = await apiClient.post('/recognize', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Base64 recognition error:', error);
    throw new Error(
      error instanceof Error
        ? error.message
        : 'Recognition failed with unknown error'
    );
  }
};

/**
 * Check if the API is available and functioning
 * @returns True if API is healthy, false otherwise
 */
const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Export recognition API functions
export const recognitionApi = {
  recognizeFace,
  recognizeFaceBase64,
  checkApiHealth,
};

export default recognitionApi;
