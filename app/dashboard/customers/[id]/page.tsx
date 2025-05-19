"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Edit,
  Plus,
  FileText,
  User,
  Phone,
  Mail,
  MapPin,
  StickyNoteIcon as NotesIcon,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { customersApi, mattersApi } from "@/lib/api";
import { CustomerFormModal } from "@/components/modals/customer-form-modal";
import { MatterFormModal } from "@/components/modals/matter-form-modal";
import Link from "next/link";

interface Customer {
  id: string;
  name: string;
  phoneNumber: string;
  email: string;
  address: string;
  notes: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface Matter {
  id: string;
  name: string;
  description: string;
  status: string;
  openDate: string;
  closeDate?: string;
  practiceArea: string;
  customerId: string;
  createdAt: string;
  updatedAt: string;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const customerId = params.id as string;
  const [activeTab, setActiveTab] = useState("details");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddMatterModalOpen, setIsAddMatterModalOpen] = useState(false);
  const [editMatterId, setEditMatterId] = useState<string | null>(null);

  const {
    data: customer,
    isLoading: isLoadingCustomer,
    error: customerError,
  } = useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => customersApi.getById(customerId),
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch customer",
        variant: "destructive",
      });
    },
    retry: 1,
  });

  const { data: matters = [], isLoading: isLoadingMatters } = useQuery({
    queryKey: ["matters", customerId],
    queryFn: () => mattersApi.getByCustomerId(customerId),
    onError: (error: Error) => {
      console.error("Error fetching matters:", error);
      // Don't show toast for matters error to avoid overwhelming the user
      // if the API endpoint doesn't exist yet
    },
    enabled: !!customer, // Only fetch matters if customer exists
    retry: 1,
  });

  const isLoading = isLoadingCustomer;

  const handleEditMatter = (matterId: string) => {
    setEditMatterId(matterId);
  };

  const handleCloseEditMatterModal = () => {
    setEditMatterId(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "—";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (e) {
      return "Invalid date";
    }
  };

  return (
    <DashboardLayout>
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      ) : customerError || !customer ? (
        <div className="py-8 text-center">
          <p className="text-muted-foreground">
            Customer not found or could not be loaded.
          </p>
          <Button asChild className="mt-4">
            <Link href="/dashboard/customers">Back to Customers</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {customer.name}
              </h1>
              <p className="text-muted-foreground">
                Customer details and matters
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button onClick={() => setIsAddMatterModalOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Matter
              </Button>
            </div>
          </div>

          <Tabs
            defaultValue="details"
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList>
              <TabsTrigger value="details">Customer Details</TabsTrigger>
              <TabsTrigger value="matters">Matters</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Information</CardTitle>
                  <CardDescription>
                    Details about {customer.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
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
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-2 h-4 w-4" />
                        Address
                      </div>
                      <p className="font-medium">{customer.address || "—"}</p>
                    </div>
                  </div>
                  {customer.notes && (
                    <div className="mt-6 space-y-1">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <NotesIcon className="mr-2 h-4 w-4" />
                        Notes
                      </div>
                      <p className="whitespace-pre-line">{customer.notes}</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-muted-foreground">
                    <div>Created: {formatDate(customer.createdAt)}</div>
                    <div>Last updated: {formatDate(customer.updatedAt)}</div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="matters">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Matters</CardTitle>
                  <CardDescription>
                    All legal matters for {customer.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isLoadingMatters ? (
                    <div className="flex justify-center py-8">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                    </div>
                  ) : matters && matters.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Practice Area</TableHead>
                            <TableHead>Open Date</TableHead>
                            <TableHead className="hidden md:table-cell">
                              Close Date
                            </TableHead>
                            <TableHead className="text-right">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {matters.map((matter: Matter) => (
                            <TableRow key={matter.id}>
                              <TableCell className="font-medium">
                                <Link
                                  href={`/dashboard/matters/${matter.id}`}
                                  className="hover:text-primary hover:underline"
                                >
                                  {matter.name}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <div
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    matter.status === "open"
                                      ? "bg-green-100 text-green-800"
                                      : matter.status === "closed"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                  }`}
                                >
                                  {matter.status
                                    ? matter.status.charAt(0).toUpperCase() +
                                      matter.status.slice(1)
                                    : "Unknown"}
                                </div>
                              </TableCell>
                              <TableCell>
                                {matter.practiceArea || "—"}
                              </TableCell>
                              <TableCell>
                                {formatDate(matter.openDate)}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {matter.closeDate
                                  ? formatDate(matter.closeDate)
                                  : "—"}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  aria-label="Edit matter"
                                  onClick={() => handleEditMatter(matter.id)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <h3 className="mb-1 text-lg font-medium">
                        No matters found
                      </h3>
                      <p className="mb-4 text-sm text-muted-foreground">
                        This customer doesn't have any legal matters yet.
                      </p>
                      <Button onClick={() => setIsAddMatterModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Matter
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Edit Customer Modal */}
          <CustomerFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            customerId={customerId}
          />

          {/* Add Matter Modal */}
          <MatterFormModal
            isOpen={isAddMatterModalOpen}
            onClose={() => setIsAddMatterModalOpen(false)}
            customerId={customerId}
          />

          {/* Edit Matter Modal */}
          {editMatterId && (
            <MatterFormModal
              isOpen={!!editMatterId}
              onClose={handleCloseEditMatterModal}
              customerId={customerId}
              matterId={editMatterId}
            />
          )}
        </div>
      )}
    </DashboardLayout>
  );
}
