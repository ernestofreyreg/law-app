import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  authApi,
  customersApi,
  mattersApi,
  getToken,
  handleApiResponse,
} from "../api";

describe("API Functions", () => {
  const mockToken = "test-token";
  const mockResponse = { data: "test data" };
  const mockError = { message: "Test error" };

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
  });

  describe("getToken", () => {
    it("should return token from localStorage", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
      expect(getToken()).toBe(mockToken);
    });

    it("should return null when no token exists", () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null);
      expect(getToken()).toBeNull();
    });
  });

  describe("handleApiResponse", () => {
    it("should return data for successful response", async () => {
      const response = {
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response;

      const result = await handleApiResponse(response);
      expect(result).toEqual(mockResponse);
    });

    it("should throw error for failed response", async () => {
      const response = {
        ok: false,
        json: () => Promise.resolve(mockError),
      } as Response;

      await expect(handleApiResponse(response)).rejects.toThrow(
        mockError.message
      );
    });
  });

  describe("authApi", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
    });

    it("should handle signup", async () => {
      const userData = {
        email: "test@example.com",
        password: "password123",
        firmName: "Test Firm",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await authApi.signup(userData);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/signup"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(userData),
        })
      );
    });

    it("should handle login", async () => {
      const credentials = {
        email: "test@example.com",
        password: "password123",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await authApi.login(credentials);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/login"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify(credentials),
        })
      );
    });

    it("should handle getMe", async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await authApi.getMe();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/auth/me"),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        })
      );
    });
  });

  describe("customersApi", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
      vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
    });

    it("should handle getAll", async () => {
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await customersApi.getAll();
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/customers"),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        })
      );
    });

    it("should handle getById", async () => {
      const customerId = "123";
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await customersApi.getById(customerId);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/customers/${customerId}`),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        })
      );
    });

    it("should handle create", async () => {
      const customerData = {
        name: "Test Customer",
        email: "test@example.com",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await customersApi.create(customerData);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/customers"),
        expect.objectContaining({
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(customerData),
        })
      );
    });

    it("should handle update", async () => {
      const customerId = "123";
      const customerData = {
        name: "Updated Customer",
      };

      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await customersApi.update(customerId, customerData);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/customers/${customerId}`),
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${mockToken}`,
          },
          body: JSON.stringify(customerData),
        })
      );
    });

    it("should handle delete", async () => {
      const customerId = "123";
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await customersApi.delete(customerId);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/customers/${customerId}`),
        expect.objectContaining({
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        })
      );
    });
  });

  describe("mattersApi", () => {
    beforeEach(() => {
      global.fetch = vi.fn();
      vi.mocked(localStorage.getItem).mockReturnValue(mockToken);
    });

    it("should handle getByCustomerId", async () => {
      const customerId = "123";
      vi.mocked(global.fetch).mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse),
      } as Response);

      const result = await mattersApi.getByCustomerId(customerId);
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining(`/api/customers/${customerId}/matters`),
        expect.objectContaining({
          headers: {
            Authorization: `Bearer ${mockToken}`,
          },
        })
      );
    });
  });
});
