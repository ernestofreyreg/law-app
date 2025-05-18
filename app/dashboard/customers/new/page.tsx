"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { customersApi } from "@/lib/api"

export default function NewCustomerPage() {
  const router = useRouter()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    notes: "",
  })

  const createCustomerMutation = useMutation({
    mutationFn: customersApi.create,
    onSuccess: () => {
      toast({
        title: "Customer created",
        description: "The customer has been created successfully.",
      })

      // Invalidate and refetch customers query
      queryClient.invalidateQueries({ queryKey: ["customers"] })

      router.push("/dashboard/customers")
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create customer",
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
    createCustomerMutation.mutate(formData)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
          <p className="text-muted-foreground">Create a new customer record for your law firm.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Enter the details of your new customer.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  required
                  value={formData.name}
                  onChange={handleChange}
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createCustomerMutation.isPending}>
                {createCustomerMutation.isPending ? "Creating..." : "Create Customer"}
              </Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </DashboardLayout>
  )
}
