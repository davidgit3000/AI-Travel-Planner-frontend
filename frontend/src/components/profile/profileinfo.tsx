"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export default function ProfileDetails() {
  const [activeTab, setActiveTab] = useState("personal")
  const [editMode, setEditMode] = useState(false)
  const [editPrefsMode, setEditPrefsMode] = useState(false)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  return (
    <div className="w-full rounded-xl bg-background p-6 shadow-md text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">John Anderson</h2>
          <p className="text-muted-foreground">john.anderson@example.com</p>
        </div>

        {activeTab === "personal" && (
          <button
            onClick={() => setEditMode((prev) => !prev)}
            className="mt-4 md:mt-0 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {editMode ? "Save Changes" : "Edit Profile"}
          </button>
        )}

        {activeTab === "preferences" && (
          <button
            onClick={() => setEditPrefsMode((prev) => !prev)}
            className="mt-4 md:mt-0 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md"
          >
            {editPrefsMode ? "Save Preferences" : "Edit Preferences"}
          </button>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full" onValueChange={handleTabChange}>
        <TabsList className="mb-6">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="preferences">Travel Preferences</TabsTrigger>
        </TabsList>

        {/* PERSONAL INFO */}
        <TabsContent value="personal">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-background text-foreground border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Contact Information</h3>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="123456" readOnly={!editMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue="123 Main St" readOnly={!editMode} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background text-foreground border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Travel Documents</h3>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input id="nationality" defaultValue="USA" readOnly={!editMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input id="passport" defaultValue="A1234567" readOnly={!editMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Passport Expiry</Label>
                  <Input id="expiry" type="date" defaultValue="2030-01-01" readOnly={!editMode} />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TRAVEL PREFERENCES */}
        <TabsContent value="preferences">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-background text-foreground border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Travel Style</h3>
                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range</Label>
                  <Input id="budget" defaultValue="Premium ($5000+)" readOnly={!editPrefsMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Travel Style</Label>
                  <Input id="style" defaultValue="Cultural Explorer" readOnly={!editPrefsMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pace">Travel Pace</Label>
                  <Input id="pace" defaultValue="Balanced" readOnly={!editPrefsMode} />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background text-foreground border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation Type</Label>
                  <Input id="accommodation" defaultValue="Luxury Hotels" readOnly={!editPrefsMode} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dining">Dining Preferences</Label>
                  <Input id="dining" defaultValue="Fine Dining" readOnly={!editPrefsMode} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Preferred Activities</p>
                  <div className="flex flex-wrap gap-2">
                    {["Cultural Experiences", "Historical Sites", "Local Cuisine", "Art Galleries"].map((activity) => (
                      <Badge
                        key={activity}
                        variant="outline"
                        className="bg-secondary text-secondary-foreground"
                      >
                        {activity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
