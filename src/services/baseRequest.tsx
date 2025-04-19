export async function getData(url: string, token?: string) {
  try {
    let authToken;
    if (token) {
      authToken = token || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      if (!authToken) {
        throw new Error("No valid token provided");
      }
    }
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function postData(url: string, data: any, token?: string) {
  try {
    let authToken;
    if (token) {
      authToken = token || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      if (!authToken) {
        throw new Error("No valid token provided");
      }
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function patchData(url: string, data: any, token?: string) {
  try {
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error posting data:", error);
    throw error;
  }
}

export async function putData(url: string, data: any, token?: string) {
  try {
    let authToken;
    if (token) {
      authToken = token || process.env.NEXT_PUBLIC_GITHUB_TOKEN;
      if (!authToken) {
        throw new Error("No valid token provided");
      }
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error updating data:", error);
    throw error;
  }
}

export async function deleteData(url: string, data?: any, token?: string) {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting data:", error);
    throw error;
  }
}
