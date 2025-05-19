import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerFormModal } from "../customer-form-modal";
import { customersApi } from "@/lib/api";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mock the API
vi.mock("@/lib/api", () => ({
  customersApi: {
    create: vi.fn(),
    update: vi.fn(),
    getById: vi.fn(),
  },
}));

// Mock the toast hook
vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock next/navigation
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("CustomerFormModal", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });
    vi.clearAllMocks();
  });

  const renderWithQueryClient = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
    );
  };

  it("renders add new customer form correctly", () => {
    renderWithQueryClient(
      <CustomerFormModal isOpen={true} onClose={() => {}} />
    );

    expect(screen.getByText("Add New Customer")).toBeInTheDocument();
    expect(screen.getByLabelText("Name *")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Phone Number *")).toBeInTheDocument();
    expect(screen.getByLabelText("Address")).toBeInTheDocument();
    expect(screen.getByLabelText("Notes")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Create Customer" })
    ).toBeInTheDocument();
  });

  it("renders edit customer form correctly", async () => {
    const mockCustomer = {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St",
      notes: "Test notes",
    };

    vi.mocked(customersApi.getById).mockResolvedValue(mockCustomer);

    renderWithQueryClient(
      <CustomerFormModal isOpen={true} onClose={() => {}} customerId="1" />
    );

    await waitFor(() => {
      expect(screen.getByText("Edit Customer")).toBeInTheDocument();
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
      expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
      expect(screen.getByDisplayValue("123 Main St")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test notes")).toBeInTheDocument();
    });
  });

  it("handles form submission for new customer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const mockCustomer = {
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St",
      notes: "Test notes",
    };

    vi.mocked(customersApi.create).mockResolvedValue({
      id: "1",
      ...mockCustomer,
    });

    renderWithQueryClient(
      <CustomerFormModal isOpen={true} onClose={onClose} />
    );

    await user.type(screen.getByLabelText("Name *"), mockCustomer.name);
    await user.type(screen.getByLabelText("Email"), mockCustomer.email);
    await user.type(
      screen.getByLabelText("Phone Number *"),
      mockCustomer.phoneNumber
    );
    await user.type(screen.getByLabelText("Address"), mockCustomer.address);
    await user.type(screen.getByLabelText("Notes"), mockCustomer.notes);

    await user.click(screen.getByRole("button", { name: "Create Customer" }));

    await waitFor(() => {
      expect(customersApi.create).toHaveBeenCalledWith(mockCustomer);
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("handles form submission for editing customer", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const mockCustomer = {
      name: "John Doe",
      email: "john@example.com",
      phoneNumber: "1234567890",
      address: "123 Main St",
      notes: "Test notes",
    };

    vi.mocked(customersApi.getById).mockResolvedValue(mockCustomer);
    vi.mocked(customersApi.update).mockResolvedValue(mockCustomer);

    renderWithQueryClient(
      <CustomerFormModal isOpen={true} onClose={onClose} customerId="1" />
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    });

    const updatedName = "Jane Doe";
    await user.clear(screen.getByLabelText("Name *"));
    await user.type(screen.getByLabelText("Name *"), updatedName);

    await user.click(screen.getByRole("button", { name: "Update Customer" }));

    await waitFor(() => {
      expect(customersApi.update).toHaveBeenCalledWith("1", {
        ...mockCustomer,
        name: updatedName,
      });
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("validates required fields", async () => {
    const user = userEvent.setup();
    renderWithQueryClient(
      <CustomerFormModal isOpen={true} onClose={() => {}} />
    );

    await user.click(screen.getByRole("button", { name: "Create Customer" }));

    expect(screen.getByLabelText("Name *")).toBeInvalid();
    expect(screen.getByLabelText("Phone Number *")).toBeInvalid();
  });
});
