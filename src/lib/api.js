/**
 * API Configuration and Services
 * Base URL: http://localhost:3200/application
 */

const API_BASE_URL = "https://www.selloutweb.co.uk/application";

/**
 * Submit Application (First step in the flow)
 * POST /application/apply
 *
 * @param {FormData} formData - Contains:
 *   - name (required)
 *   - email (required)
 *   - phone (optional)
 *   - result_card_1 (file, optional)
 *   - result_card_2 (file, optional)
 *   - cnic (file, optional)
 *   - certificate (file, optional)
 *   - passport (file, optional)
 *
 * @returns {Promise<{success: boolean, message: string, data: {application_id: string, submitted_at: string}}>}
 */
export async function submitApplication(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/apply`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit application");
    }

    return data;
  } catch (error) {
    console.error("Submit application error:", error);
    throw error;
  }
}

/**
 * Accept Application (Admin action)
 * POST /application/accept
 *
 * @param {string} token - JWT token from admin email link
 *
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function acceptApplication(token) {
  try {
    const response = await fetch(`${API_BASE_URL}/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to accept application");
    }

    return data;
  } catch (error) {
    console.error("Accept application error:", error);
    throw error;
  }
}

/**
 * Complete Profile (Student final step)
 * POST /application/complete-profile
 *
 * @param {FormData} formData - Contains:
 *   - token (required) - JWT token from student email link
 *   - marital_status (required)
 *   - visa_eligible (required)
 *   - signature (file, required) - Image file named "signature"
 *
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function completeProfile(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/complete-profile`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to complete profile");
    }

    return data;
  } catch (error) {
    console.error("Complete profile error:", error);
    throw error;
  }
}

export { API_BASE_URL };
