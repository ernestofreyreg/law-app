"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { customersApi } from "@/lib/api"

interface CustomerFormModalProps {
  isOpen: boolean
  onClose: () => void
  customerId?: string // If provided, we're editing an existing customer
}

export function CustomerFormModal({ isOpen, onClose, customerId }: CustomerFormModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditMode = !!customerId

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    notes: "",
  })

  // Fetch customer data if in edit mode
  const { data: customerData, isLoading: isLoadingCustomer } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customersApi.getById(customerId!),
    enabled: isEditMode && isOpen,
  })

  // Update form data when customer data is loaded
  useEffect(() => {
    if (customerData && isEditMode) {
      setFormData({
        name: customerData.name || "",
        email: customerData.email || "",
        phoneNumber: customerData.phoneNumber || "",
        address: customerData.address || "",
        notes: customerData.notes || "",
      })
    }
  }, [customerData, isEditMode])

  const createCustomerMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      toast({
        title: "Customer created",
        description: "The customer has been created successfully.",
      })

      // Invalidate and refetch customers query
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      handleClose()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer",
        variant: "destructive",
      })
    },
  })

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => customersApi.update(id, data),
    onSuccess: () => {
      toast({
        title: "Customer updated",
        description: "The customer has been updated successfully.",
      })

      // Invalidate and refetch customers query and the specific customer
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      queryClient.invalidateQueries({ queryKey: ["customer", customerId] })
      handleClose()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update customer",
        variant: "destructive",
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isEditMode) {
      updateCustomerMutation.mutate({ id: customerId!, data: formData })
    } else {
      createCustomerMutation.mutate(formData)
    }
  }

  const handleClose = () => {
    // Reset form when closing
    if (!isEditMode) {
      setFormData({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        notes: "",
      })
    }
    onClose()
  }

  const isLoading = createCustomerMutation.isPending || updateCustomerMutation.isPending || isLoadingCustomer

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Customer" : "Add New Customer"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Update the customer's information below." : "Enter the details of your new customer."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                placeholder="(123) 456-7890"
                required
                value={formData.phoneNumber}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St, City, State, ZIP"
                value={formData.address}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Additional information about the customer"
                rows={4}
                value={formData.notes}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Customer"
                  : "Create Customer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
