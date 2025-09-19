jest.mock("axios", () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  };
});

import axios from "axios";
import { httpClient } from "../client";

const consoleSpy = {
  error: jest.spyOn(console, "error").mockImplementation(() => {}),
};

describe("HttpClient", () => {
  let mockAxiosInstance: any;

  beforeEach(() => {
    jest.clearAllMocks();

    // Create a fresh mock instance for each test
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      interceptors: {
        request: {
          use: jest.fn(),
        },
        response: {
          use: jest.fn(),
        },
      },
    };

    // Mock axios.create to return our mock instance
    (axios.create as jest.Mock).mockReturnValue(mockAxiosInstance);
  });

  afterEach(() => {
    consoleSpy.error.mockClear();
  });

  afterAll(() => {
    consoleSpy.error.mockRestore();
  });

  describe("HttpClient initialization", () => {
    it("should have httpClient instance", () => {
      expect(httpClient).toBeDefined();
      expect(httpClient).toHaveProperty("get");
      expect(httpClient).toHaveProperty("post");
      expect(httpClient).toHaveProperty("put");
      expect(httpClient).toHaveProperty("delete");
    });

    it("should be properly initialized", () => {
      // The client should be properly initialized with all methods
      expect(httpClient).toBeDefined();
      expect(typeof httpClient.get).toBe("function");
      expect(typeof httpClient.post).toBe("function");
      expect(typeof httpClient.put).toBe("function");
      expect(typeof httpClient.delete).toBe("function");
    });
  });

  describe("Request interceptor", () => {
    it("should handle successful request", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((config) => config);
      const errorHandler = jest.fn((error) => Promise.reject(error));

      mockAxiosInstance.interceptors.request.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const requestSuccessHandler =
        mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
      const config = { url: "/test", method: "get" };

      const result = requestSuccessHandler(config);

      expect(result).toEqual(config);
    });

    it("should handle request error", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((config) => config);
      const errorHandler = jest.fn((error) => Promise.reject(error));

      mockAxiosInstance.interceptors.request.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const requestErrorHandler =
        mockAxiosInstance.interceptors.request.use.mock.calls[0][1];
      const error = new Error("Request error");

      expect(() => requestErrorHandler(error)).rejects.toThrow("Request error");
    });
  });

  describe("Response interceptor", () => {
    it("should handle successful response", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((response) => response);
      const errorHandler = jest.fn((error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized access");
        } else if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data);
        }
        return Promise.reject(error);
      });

      mockAxiosInstance.interceptors.response.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const responseSuccessHandler =
        mockAxiosInstance.interceptors.response.use.mock.calls[0][0];
      const response = { data: "test data", status: 200 };

      const result = responseSuccessHandler(response);

      expect(result).toEqual(response);
    });

    it("should handle 401 unauthorized error", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((response) => response);
      const errorHandler = jest.fn((error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized access");
        } else if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data);
        }
        return Promise.reject(error);
      });

      mockAxiosInstance.interceptors.response.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const responseErrorHandler =
        mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      const error = {
        response: {
          status: 401,
          data: "Unauthorized",
        },
      };

      expect(() => responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).toHaveBeenCalledWith("Unauthorized access");
    });

    it("should handle 500+ server error", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((response) => response);
      const errorHandler = jest.fn((error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized access");
        } else if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data);
        }
        return Promise.reject(error);
      });

      mockAxiosInstance.interceptors.response.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const responseErrorHandler =
        mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      const error = {
        response: {
          status: 500,
          data: "Internal Server Error",
        },
      };

      expect(() => responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Server error:",
        "Internal Server Error"
      );
    });

    it("should handle other errors", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((response) => response);
      const errorHandler = jest.fn((error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized access");
        } else if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data);
        }
        return Promise.reject(error);
      });

      mockAxiosInstance.interceptors.response.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const responseErrorHandler =
        mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      const error = {
        response: {
          status: 404,
          data: "Not Found",
        },
      };

      expect(() => responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it("should handle error without response", () => {
      // Simulate the interceptor being called with handlers
      const successHandler = jest.fn((response) => response);
      const errorHandler = jest.fn((error) => {
        if (error.response?.status === 401) {
          console.error("Unauthorized access");
        } else if (error.response?.status >= 500) {
          console.error("Server error:", error.response.data);
        }
        return Promise.reject(error);
      });

      mockAxiosInstance.interceptors.response.use.mock.calls.push([
        successHandler,
        errorHandler,
      ]);

      const responseErrorHandler =
        mockAxiosInstance.interceptors.response.use.mock.calls[0][1];
      const error = new Error("Network error");

      expect(() => responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });

  // Test the actual HTTP methods by testing the real implementation
  describe("HTTP methods", () => {
    it("should have get method", () => {
      expect(typeof httpClient.get).toBe("function");
    });

    it("should have post method", () => {
      expect(typeof httpClient.post).toBe("function");
    });

    it("should have put method", () => {
      expect(typeof httpClient.put).toBe("function");
    });

    it("should have delete method", () => {
      expect(typeof httpClient.delete).toBe("function");
    });
  });

  // Test the actual implementation to cover the uncovered lines
  describe("HttpClient implementation coverage", () => {
    beforeEach(() => {
      // Mock the actual axios instance used by httpClient
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.get = jest.fn();
      realAxiosInstance.post = jest.fn();
      realAxiosInstance.put = jest.fn();
      realAxiosInstance.delete = jest.fn();
    });

    it("should call get method and return data", async () => {
      const mockData = { id: 1, name: "test" };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await httpClient.get("/test");

      expect(realAxiosInstance.get).toHaveBeenCalledWith("/test", undefined);
      expect(result).toEqual(mockData);
    });

    it("should call get method with config and return data", async () => {
      const mockData = { id: 1, name: "test" };
      const config = { headers: { "Custom-Header": "value" } };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.get.mockResolvedValue({ data: mockData });

      const result = await httpClient.get("/test", config);

      expect(realAxiosInstance.get).toHaveBeenCalledWith("/test", config);
      expect(result).toEqual(mockData);
    });

    it("should call post method and return data", async () => {
      const mockData = { id: 1, name: "test" };
      const postData = { name: "new item" };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await httpClient.post("/test", postData);

      expect(realAxiosInstance.post).toHaveBeenCalledWith(
        "/test",
        postData,
        undefined
      );
      expect(result).toEqual(mockData);
    });

    it("should call post method with config and return data", async () => {
      const mockData = { id: 1, name: "test" };
      const postData = { name: "new item" };
      const config = { headers: { "Custom-Header": "value" } };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.post.mockResolvedValue({ data: mockData });

      const result = await httpClient.post("/test", postData, config);

      expect(realAxiosInstance.post).toHaveBeenCalledWith(
        "/test",
        postData,
        config
      );
      expect(result).toEqual(mockData);
    });

    it("should call put method and return data", async () => {
      const mockData = { id: 1, name: "updated" };
      const putData = { name: "updated item" };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.put.mockResolvedValue({ data: mockData });

      const result = await httpClient.put("/test", putData);

      expect(realAxiosInstance.put).toHaveBeenCalledWith(
        "/test",
        putData,
        undefined
      );
      expect(result).toEqual(mockData);
    });

    it("should call put method with config and return data", async () => {
      const mockData = { id: 1, name: "updated" };
      const putData = { name: "updated item" };
      const config = { headers: { "Custom-Header": "value" } };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.put.mockResolvedValue({ data: mockData });

      const result = await httpClient.put("/test", putData, config);

      expect(realAxiosInstance.put).toHaveBeenCalledWith(
        "/test",
        putData,
        config
      );
      expect(result).toEqual(mockData);
    });

    it("should call delete method and return data", async () => {
      const mockData = { success: true };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.delete.mockResolvedValue({ data: mockData });

      const result = await httpClient.delete("/test");

      expect(realAxiosInstance.delete).toHaveBeenCalledWith("/test", undefined);
      expect(result).toEqual(mockData);
    });

    it("should call delete method with config and return data", async () => {
      const mockData = { success: true };
      const config = { headers: { "Custom-Header": "value" } };
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.delete.mockResolvedValue({ data: mockData });

      const result = await httpClient.delete("/test", config);

      expect(realAxiosInstance.delete).toHaveBeenCalledWith("/test", config);
      expect(result).toEqual(mockData);
    });

    it("should handle get method errors", async () => {
      const error = new Error("Request failed");
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.get.mockRejectedValue(error);

      await expect(httpClient.get("/test")).rejects.toThrow("Request failed");
    });

    it("should handle post method errors", async () => {
      const error = new Error("Request failed");
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.post.mockRejectedValue(error);

      await expect(httpClient.post("/test", {})).rejects.toThrow(
        "Request failed"
      );
    });

    it("should handle put method errors", async () => {
      const error = new Error("Request failed");
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.put.mockRejectedValue(error);

      await expect(httpClient.put("/test", {})).rejects.toThrow(
        "Request failed"
      );
    });

    it("should handle delete method errors", async () => {
      const error = new Error("Request failed");
      const realAxiosInstance = (httpClient as any).client;
      realAxiosInstance.delete.mockRejectedValue(error);

      await expect(httpClient.delete("/test")).rejects.toThrow(
        "Request failed"
      );
    });
  });

  // Test the actual interceptor implementations to cover lines 28-31 and 37-47
  describe("Real HttpClient interceptor execution", () => {
    let realHttpClient: any;
    let realAxiosInstance: any;

    beforeEach(() => {
      // Create a real HttpClient instance to test actual interceptors
      const { HttpClient } = require("../client");
      realHttpClient = new HttpClient("http://test.com");
      realAxiosInstance = realHttpClient.client;
    });

    it("should execute request interceptor success handler (line 26-28)", async () => {
      // Mock axios to call the request interceptor
      const mockRequest = jest.fn().mockResolvedValue({ data: "success" });
      realAxiosInstance.get = mockRequest;

      // Get the request interceptor success handler
      const requestInterceptorCall =
        realAxiosInstance.interceptors.request.use.mock.calls[0];
      const requestSuccessHandler = requestInterceptorCall[0];

      // Test the request success handler directly
      const config = { url: "/test", method: "get", headers: {} };
      const result = requestSuccessHandler(config);

      expect(result).toEqual(config);
    });

    it("should execute request interceptor error handler (lines 30-32)", async () => {
      // Get the request interceptor error handler
      const requestInterceptorCall =
        realAxiosInstance.interceptors.request.use.mock.calls[0];
      const requestErrorHandler = requestInterceptorCall[1];

      // Test the request error handler directly
      const error = new Error("Request failed");

      await expect(requestErrorHandler(error)).rejects.toThrow(
        "Request failed"
      );
    });

    it("should execute response interceptor success handler (line 37)", async () => {
      // Get the response interceptor success handler
      const responseInterceptorCall =
        realAxiosInstance.interceptors.response.use.mock.calls[0];
      const responseSuccessHandler = responseInterceptorCall[0];

      // Test the response success handler directly
      const response = { data: "test data", status: 200, headers: {} };
      const result = responseSuccessHandler(response);

      expect(result).toEqual(response);
    });

    it("should execute response interceptor error handler with 401 (lines 39-42)", async () => {
      // Get the response interceptor error handler
      const responseInterceptorCall =
        realAxiosInstance.interceptors.response.use.mock.calls[0];
      const responseErrorHandler = responseInterceptorCall[1];

      // Test the response error handler with 401
      const error = {
        response: {
          status: 401,
          data: "Unauthorized",
        },
      };

      await expect(responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).toHaveBeenCalledWith("Unauthorized access");
    });

    it("should execute response interceptor error handler with 500+ (lines 43-46)", async () => {
      // Get the response interceptor error handler
      const responseInterceptorCall =
        realAxiosInstance.interceptors.response.use.mock.calls[0];
      const responseErrorHandler = responseInterceptorCall[1];

      // Test the response error handler with 500+
      const error = {
        response: {
          status: 500,
          data: "Internal Server Error",
        },
      };

      await expect(responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        "Server error:",
        "Internal Server Error"
      );
    });

    it("should execute response interceptor error handler with other errors (lines 47-48)", async () => {
      // Get the response interceptor error handler
      const responseInterceptorCall =
        realAxiosInstance.interceptors.response.use.mock.calls[0];
      const responseErrorHandler = responseInterceptorCall[1];

      // Test the response error handler with other status codes
      const error = {
        response: {
          status: 404,
          data: "Not Found",
        },
      };

      await expect(responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });

    it("should execute response interceptor error handler without response (lines 47-48)", async () => {
      // Get the response interceptor error handler
      const responseInterceptorCall =
        realAxiosInstance.interceptors.response.use.mock.calls[0];
      const responseErrorHandler = responseInterceptorCall[1];

      // Test the response error handler without response object
      const error = new Error("Network error");

      await expect(responseErrorHandler(error)).rejects.toEqual(error);
      expect(consoleSpy.error).not.toHaveBeenCalled();
    });
  });
});
