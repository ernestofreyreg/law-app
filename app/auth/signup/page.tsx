"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useMutation } from "@tanstack/react-query"
import { authApi } from "@/lib/api"

export default function SignupPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firmName: "",
  })

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: () => {
      toast({
        title: "Account created",
        description: "Your account has been created successfully.",
      })

      router.push("/auth/login")
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to sign up",
        variant: "destructive",
      })
    },
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    signupMutation.mutate(formData)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Enter your details to create your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="firmName">Firm Name</Label>
              <Input
                id="firmName"
                name="firmName"
                placeholder="Your Law Firm"
                required
                value={formData.firmName}
                onChange={handleChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={signupMutation.isPending}>
              {signupMutation.isPending ? "Creating account..." : "Sign up"}
            </Button>
            <div className="text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary underline">
                Log in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
