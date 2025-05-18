"use client"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Edit, User, Phone, Mail, Calendar, FileText, Briefcase, Clock, CheckCircle, ArrowLeft } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { customersApi, mattersApi } from "@/lib/api"
import { MatterFormModal } from "@/components/modals/matter-form-modal"

export default function MatterDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const matterId = params.id as string
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("details")

  // First, we need to find which customer this matter belongs to
  const {
    data: customers = [],
    isLoading: isLoadingCustomers,
    error: customersError,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: customersApi.getAll,
  })

  // This query will track our found matter and customer
  const {
    data: matterWithCustomer,
    isLoading: isLoadingMatter,
    error: matterError,
  } = useQuery({
    queryKey: ["matter-with-customer", matterId],
    queryFn: async () => {
      // Search through all customers to find the matter
      for (const customer of customers) {
        try {
          const matters = await mattersApi.getByCustomerId(customer.id)
          const foundMatter = matters.find((m: any) => m.id === matterId)

          if (foundMatter) {
            return {
              matter: foundMatter,
              customer: customer,
            }
          }
        } catch (error) {
          console.error(`Error fetching matters for customer ${customer.id}:`, error)
        }
      }

      // If we get here, we didn't find the matter
      throw new Error("Matter not found")
    },
    enabled: customers.length > 0 && !isLoadingCustomers,
    retry: 1,
  })

  const isLoading = isLoadingCustomers || isLoadingMatter

  const formatDate = (dateString: string) => {
    if (!dateString) return "—"
    try {
      return new Date(dateString).toLocaleDateString()
    } catch (e) {
      return "Invalid date"
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (customersError || matterError || !matterWithCustomer) {
    return (
      <DashboardLayout>
        <div className="py-8 text-center">
          <p className="text-muted-foreground">Matter not found or could not be loaded.</p>
          <Button asChild className="mt-4">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  const { matter, customer } = matterWithCustomer

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild className="h-8 w-8 mr-2">
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{matter.name}</h1>
            <p className="text-muted-foreground">Matter details and information</p>
          </div>
        </div>

        {/* Customer Summary Card */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg font-medium">Customer Information</CardTitle>
            <CardDescription>
              This matter is associated with{" "}
              <Link href={`/dashboard/customers/${customer.id}`} className="text-primary hover:underline">
                {customer.name}
              </Link>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <User className="mr-2 h-4 w-4" />
                  Name
                </div>
                <p className="font-medium">{customer.name}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="mr-2 h-4 w-4" />
                  Phone
                </div>
                <p className="font-medium">{customer.phoneNumber}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </div>
                <p className="font-medium">{customer.email || "—"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={() => setIsEditModalOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Matter
          </Button>
        </div>

        <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="details">Matter Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Matter Information</CardTitle>
                <CardDescription>Details about this legal matter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      Name
                    </div>
                    <p className="font-medium">{matter.name}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Briefcase className="mr-2 h-4 w-4" />
                      Practice Area
                    </div>
                    <p className="font-medium">{matter.practiceArea || "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Status
                    </div>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        matter.status === "open"
                          ? "bg-green-100 text-green-800"
                          : matter.status === "closed"
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {matter.status ? matter.status.charAt(0).toUpperCase() + matter.status.slice(1) : "Unknown"}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Open Date
                    </div>
                    <p className="font-medium">{formatDate(matter.openDate)}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Close Date
                    </div>
                    <p className="font-medium">{matter.closeDate ? formatDate(matter.closeDate) : "—"}</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      Created
                    </div>
                    <p className="font-medium">{formatDate(matter.createdAt)}</p>
                  </div>
                </div>

                {matter.description && (
                  <div className="mt-6 space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <FileText className="mr-2 h-4 w-4" />
                      Description
                    </div>
                    <p className="whitespace-pre-line">{matter.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Manage documents related to this matter</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">No documents found</h3>
                  <p className="mb-4 text-sm text-muted-foreground">This matter doesn't have any documents yet.</p>
                  <Button>
                    <FileText className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Edit Matter Modal */}
        <MatterFormModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          customerId={customer.id}
          matterId={matterId}
        />
      </div>
    </DashboardLayout>
  )
}
