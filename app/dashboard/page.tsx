"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Calendar } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { customersApi, mattersApi, statsApi } from "@/lib/api"
import Link from "next/link"

export default function DashboardPage() {
  // Fetch stats for total customers and active matters
  const { data: stats = { totalCustomers: 0, activeMatters: 0 }, isLoading: isLoadingStats } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: statsApi.getStats,
  })

  // Fetch recent customers for display
  const { data: customers = [], isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  })

  // Fetch recent matters for display
  const { data: allMatters = [], isLoading: isLoadingMatters } = useQuery({
    queryKey: ["all-matters-dashboard"],
    queryFn: async () => {
      // This is a workaround since we don't have a direct API to get all matters
      const allMatters = []

      for (const customer of customers) {
        try {
          const matters = await mattersApi.getByCustomerId(customer.id)
          // Add customer info to each matter
          const mattersWithCustomer = matters.map((matter) => ({
            ...matter,
            customer,
          }))
          allMatters.push(...mattersWithCustomer)
        } catch (error) {
          console.error(`Error fetching matters for customer ${customer.id}:`, error)
        }
      }

      return allMatters
    },
    enabled: customers.length > 0 && !isLoadingCustomers,
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to your law practice management dashboard.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                ) : (
                  stats.totalCustomers
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <Link href="/dashboard/customers" className="hover:underline">
                  Manage your clients
                </Link>
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Matters</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingStats ? (
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                ) : (
                  stats.activeMatters
                )}
              </div>
              <p className="text-xs text-muted-foreground">Track your legal cases</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Actions in the last 30 days</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Customers</CardTitle>
              <CardDescription>Your most recently added clients</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCustomers ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : customers.length > 0 ? (
                <div className="space-y-4">
                  {customers.slice(0, 5).map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/dashboard/customers/${customer.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {customer.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">{customer.email || customer.phoneNumber}</p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(customer.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No customers found. Add your first customer to get started.
                </p>
              )}
            </CardContent>
          </Card>
          <Card className="col-span-1">
            <CardHeader>
              <CardTitle>Recent Matters</CardTitle>
              <CardDescription>Your most recently added legal matters</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingMatters ? (
                <div className="flex justify-center py-4">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : allMatters.length > 0 ? (
                <div className="space-y-4">
                  {allMatters.slice(0, 5).map((matter) => (
                    <div key={matter.id} className="flex items-center justify-between">
                      <div>
                        <Link
                          href={`/dashboard/matters/${matter.id}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {matter.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {matter.status.charAt(0).toUpperCase() + matter.status.slice(1)}
                        </p>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(matter.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No matters found. Add your first matter to get started.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
