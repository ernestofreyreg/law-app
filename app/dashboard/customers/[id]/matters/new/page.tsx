"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { mattersApi } from "@/lib/api"

export default function NewMatterPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const customerId = params.id as string
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    status: "open",
    openDate: new Date().toISOString().split("T")[0],
    closeDate: "",
    practiceArea: "",
  })

  const createMatterMutation = useMutation({
    mutationFn: (data: any) => mattersApi.create(customerId, data),
    onSuccess: () => {
      toast({
        title: "Matter created",
        description: "The legal matter has been created successfully.",
      })

      // Invalidate and refetch matters query
      queryClient.invalidateQueries({ queryKey: ["matters", customerId] })

      router.push(`/dashboard/customers/${customerId}?tab=matters`)
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create matter",
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

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    createMatterMutation.mutate(formData)
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Matter</h1>
          <p className="text-muted-foreground">Create a new legal matter for this customer.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Matter Information</CardTitle>
              <CardDescription>Enter the details of the new legal matter.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Matter Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g., Smith Divorce Case"
                  required
                  value={formData.name}
                  onChange={handleChange}
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
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="status">Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => handleSelectChange("status", value)}>
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
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="closeDate">Close Date</Label>
                  <Input
                    id="closeDate"
                    name="closeDate"
                    type="date"
                    value={formData.closeDate}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMatterMutation.isPending}>
                {createMatterMutation.isPending ? "Creating..." : "Create Matter"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
