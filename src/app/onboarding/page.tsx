"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/theme-toggle";
import { Globe } from "lucide-react";

export default function Onboarding() {
  const router = useRouter();
  const [postalCode, setPostalCode] = useState("");
  const [language, setLanguage] = useState("en");
  const [role, setRole] = useState("");

  useEffect(() => {
    // Get role from localStorage
    const tempRole = localStorage.getItem("tempRole");
    if (tempRole) {
      setRole(tempRole);
    } else {
      // If no role, redirect to home
      router.push("/");
    }
  }, [router]);

  const handleComplete = () => {
    // Save user preferences to localStorage
    localStorage.setItem("postalCode", postalCode);
    localStorage.setItem("language", language);
    localStorage.setItem("role", role);
    localStorage.setItem("onboarded", "true");
    
    // Redirect based on role
    if (role === "donor") {
      router.push("/donor");
    } else if (role === "receiver") {
      router.push("/receiver");
    } else if (role === "org") {
      router.push("/org");
    } else {
      router.push("/feed");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary"></div>
            <span className="text-xl font-bold">Metra</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Globe className="h-5 w-5" />
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight">Complete Your Profile</h1>
            <p className="mt-2 text-muted-foreground">
              Set up your preferences to get started
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Profile Setup</CardTitle>
              <CardDescription>
                Configure your account settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="postal-code">Postal Code</Label>
                <Input
                  id="postal-code"
                  placeholder="Enter your postal code"
                  value={postalCode}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPostalCode(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="donor">Donor</SelectItem>
                    <SelectItem value="receiver">Receiver</SelectItem>
                    <SelectItem value="org">Organization Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleComplete}
                disabled={!postalCode || !role}
              >
                Complete Setup
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}