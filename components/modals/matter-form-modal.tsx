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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { mattersApi } from "@/lib/api"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface MatterFormModalProps {
  isOpen: boolean
  onClose: () => void
  customerId: string
  matterId?: string // If provided, we're editing an existing matter
}

export function MatterFormModal({ isOpen, onClose, customerId, matterId }: MatterFormModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const isEditMode = !!matterId
  const [validationError, setValidationError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "open",
    openDate: new Date().toISOString().split("T")[0],
    closeDate: "",
    practiceArea: "",
  })

  // Fetch matter data if in edit mode
  const { data: matterData, isLoading: isLoadingMatter } = useQuery({
    queryKey: ["matter", customerId, matterId],
    queryFn: () => mattersApi.getById(customerId, matterId!),
    enabled: isEditMode && isOpen,
  })

  // Update form data when matter data is loaded
  useEffect(() => {
    if (matterData && isEditMode) {
      setFormData({
        name: matterData.name || "",
        description: matterData.description || "",
        status: matterData.status || "open",
        openDate: matterData.openDate
          ? new Date(matterData.openDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        closeDate: matterData.closeDate ? new Date(matterData.closeDate).toISOString().split("T")[0] : "",
        practiceArea: matterData.practiceArea || "",
      })
    }
  }, [matterData, isEditMode])

  const createMatterMutation = useMutation({
    mutationFn: (data: any) => mattersApi.create(customerId, data),
    onSuccess: () => {
      toast({
        title: "Matter created",
        description: "The legal matter has been created successfully.",
      })

      // Invalidate and refetch matters query
      queryClient.invalidateQueries({ queryKey: ["matters", customerId] })
      handleClose()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create matter",
        variant: "destructive",
      })
    },
  })

  const updateMatterMutation = useMutation({
    mutationFn: (data: any) => mattersApi.update(customerId, matterId!, data),
    onSuccess: () => {
      toast({
        title: "Matter updated",
        description: "The legal matter has been updated successfully.",
      })

      // Invalidate and refetch matters query and the specific matter
      queryClient.invalidateQueries({ queryKey: ["matters", customerId] })
      queryClient.invalidateQueries({ queryKey: ["matter", customerId, matterId] })
      queryClient.invalidateQueries({ queryKey: ["matter-with-customer", matterId] })
      queryClient.invalidateQueries({ queryKey: ["all-matters"] })
      queryClient.invalidateQueries({ queryKey: ["all-matters-dashboard"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      handleClose()
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update matter",
        variant: "destructive",
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })

    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError(null)
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear validation error when user makes changes
    if (validationError) {
      setValidationError(null)
    }
  }

  const validateForm = (): boolean => {
    // Check if status is closed but no close date is provided
    if (formData.status === "closed" && !formData.closeDate) {
      setValidationError("A close date is required when status is set to Closed")
      return false
    }

    setValidationError(null)
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    if (isEditMode) {
      updateMatterMutation.mutate(formData)
    } else {
      createMatterMutation.mutate(formData)
    }
  }

  const handleClose = () => {
    // Reset form when closing if not in edit mode
    if (!isEditMode) {
      setFormData({
        name: "",
        description: "",
        status: "open",
        openDate: new Date().toISOString().split("T")[0],
        closeDate: "",
        practiceArea: "",
      })
    }
    setValidationError(null)
    onClose()
  }

  const practiceAreas = [
    "Family Law",
    "Criminal Law",
    "Corporate Law",
    "Real Estate",
    "Intellectual Property",
    "Immigration",
    "Tax Law",
    "Employment Law",
    "Personal Injury",
    "Estate Planning",
    "Other",
  ]

  const isLoading = createMatterMutation.isPending || updateMatterMutation.isPending || isLoadingMatter

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Matter" : "Add New Matter"}</DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the legal matter's information below."
                : "Enter the details of the new legal matter."}
            </DialogDescription>
          </DialogHeader>

          {validationError && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{validationError}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Matter Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Smith Divorce Case"
                required
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Details about the legal matter"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="practiceArea">Practice Area *</Label>
                <Select
                  value={formData.practiceArea}
                  onValueChange={(value) => handleSelectChange("practiceArea", value)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select practice area" />
                  </SelectTrigger>
                  <SelectContent>
                    {practiceAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="openDate">Open Date *</Label>
                <Input
                  id="openDate"
                  name="openDate"
                  type="date"
                  required
                  value={formData.openDate}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="closeDate" className={formData.status === "closed" ? "font-medium" : ""}>
                  Close Date {formData.status === "closed" && "*"}
                </Label>
                <Input
                  id="closeDate"
                  name="closeDate"
                  type="date"
                  value={formData.closeDate}
                  onChange={handleChange}
                  disabled={isLoading}
                  required={formData.status === "closed"}
                  className={formData.status === "closed" && !formData.closeDate ? "border-red-500" : ""}
                />
                {formData.status === "closed" && (
                  <p className="text-xs text-muted-foreground">Required when status is Closed</p>
                )}
              </div>
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
                  ? "Update Matter"
                  : "Create Matter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
