"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

const budgetRangeOptions = [
  { value: "Budget ($0-$1000)", label: "Budget ($0-$1000)" },
  { value: "Moderate ($1000-$3000)", label: "Moderate ($1000-$3000)" },
  { value: "Luxury ($3000-$5000)", label: "Luxury ($3000-$5000)" },
  { value: "Premium ($5000+)", label: "Premium ($5000+)" },
];

const travelStyleOptions = [
  { value: "cultural", label: "Cultural" },
  { value: "historical", label: "Historical" },
  { value: "cuisine", label: "Cuisine" },
  { value: "art", label: "Art" },
  { value: "nature", label: "Nature" },
  { value: "adventure", label: "Adventure" },
  { value: "relaxation", label: "Relaxation" },
];

const travelPaceOptions = [
  { value: "relaxed", label: "Relaxed" },
  { value: "balanced", label: "Balanced" },
  { value: "fast", label: "Fast-Paced" },
];

const accommodationOptions = [
  { value: "budget", label: "Budget Hotels" },
  { value: "mid-range", label: "Mid-Range Hotels" },
  { value: "luxury", label: "Luxury Hotels" },
  { value: "boutique", label: "Boutique Hotels" },
  { value: "apartment", label: "Apartments" },
];

const diningOptions = [
  { value: "casual", label: "Casual Dining" },
  { value: "mid-range", label: "Mid-Range Restaurants" },
  { value: "fine", label: "Fine Dining" },
  { value: "street", label: "Street Food" },
  { value: "mix", label: "Mix of Everything" },
];

export default function ProfileDetails() {
  const [activeTab, setActiveTab] = useState("personal");
  const [editMode, setEditMode] = useState(false);
  const [editPrefsMode, setEditPrefsMode] = useState(false);

  // Personal Information
  const [phone, setPhone] = useState("123456");
  const [address, setAddress] = useState("123 Main St");
  const [nationality, setNationality] = useState("USA");
  const [passport, setPassport] = useState("A1234567");
  const [expiry, setExpiry] = useState("2030-01-01");

  // Travel Preferences
  const [budget, setBudget] = useState(budgetRangeOptions[0].label);
  const [travelStyle, setTravelStyle] = useState(travelStyleOptions[0].label);
  const [travelPace, setTravelPace] = useState(travelPaceOptions[1].label);
  const [accommodation, setAccommodation] = useState(
    accommodationOptions[0].label
  );
  const [dining, setDining] = useState(diningOptions[0].label);
  const [selectedActivities, setSelectedActivities] = useState<string[]>([
    "cultural",
    "historical",
    "cuisine",
    "art",
  ]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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

      <Tabs
        defaultValue="personal"
        className="w-full"
        onValueChange={handleTabChange}
      >
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
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    readOnly={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    readOnly={!editMode}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background text-foreground border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Travel Documents</h3>
                <div className="space-y-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  {editMode ? (
                    <Select value={nationality} onValueChange={setNationality}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your nationality" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "USA",
                          "Canada",
                          "Mexico",
                          "United Kingdom",
                          "Germany",
                          "France",
                          "Italy",
                          "Spain",
                          "Australia",
                          "Japan",
                          "China",
                          "India",
                          "Brazil",
                          "South Korea",
                          "South Africa",
                          "Philippines",
                        ].map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="nationality" value={nationality} readOnly />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passport">Passport Number</Label>
                  <Input
                    id="passport"
                    value={passport}
                    onChange={(e) => setPassport(e.target.value)}
                    readOnly={!editMode}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expiry">Passport Expiry</Label>
                  <Input
                    id="expiry"
                    type="date"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    readOnly={!editMode}
                  />
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
                  {editPrefsMode ? (
                    <Select value={budget} onValueChange={setBudget}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRangeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="budget" value={budget} readOnly />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="style">Travel Style</Label>
                  {editPrefsMode ? (
                    <Select value={travelStyle} onValueChange={setTravelStyle}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel style" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelStyleOptions.map((option) => (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="style" value={travelStyle} readOnly />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pace">Travel Pace</Label>
                  {editPrefsMode ? (
                    <Select value={travelPace} onValueChange={setTravelPace}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select travel pace" />
                      </SelectTrigger>
                      <SelectContent>
                        {travelPaceOptions.map((option) => (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="pace" value={travelPace} readOnly />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-background text-foreground border">
              <CardContent className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">Preferences</h3>
                <div className="space-y-2">
                  <Label htmlFor="accommodation">Accommodation Type</Label>
                  {editPrefsMode ? (
                    <Select
                      value={accommodation}
                      onValueChange={setAccommodation}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select accommodation type" />
                      </SelectTrigger>
                      <SelectContent>
                        {accommodationOptions.map((option) => (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="accommodation" value={accommodation} readOnly />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dining">Dining Preferences</Label>
                  {editPrefsMode ? (
                    <Select value={dining} onValueChange={setDining}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select dining preference" />
                      </SelectTrigger>
                      <SelectContent>
                        {diningOptions.map((option) => (
                          <SelectItem key={option.value} value={option.label}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input id="dining" value={dining} readOnly />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Preferred Activities
                  </p>
                  {editPrefsMode ? (
                    <MultiSelect
                      // defaultValue={["cultural", "historical", "cuisine", "art"]}
                      value={selectedActivities}
                      onChange={setSelectedActivities}
                      options={[
                        { value: "cultural", label: "Cultural Experiences" },
                        { value: "historical", label: "Historical Sites" },
                        { value: "cuisine", label: "Local Cuisine" },
                        { value: "art", label: "Art Galleries" },
                        { value: "nature", label: "Nature & Outdoors" },
                        { value: "shopping", label: "Shopping" },
                        { value: "nightlife", label: "Nightlife" },
                        { value: "sports", label: "Sports & Recreation" },
                      ]}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {selectedActivities.map((activity) => {
                        const label = {
                          cultural: "Cultural Experiences",
                          historical: "Historical Sites",
                          cuisine: "Local Cuisine",
                          art: "Art Galleries",
                          nature: "Nature & Outdoors",
                          shopping: "Shopping",
                          nightlife: "Nightlife",
                          sports: "Sports & Recreation",
                        }[activity];

                        return (
                          <Badge
                            key={activity}
                            variant="outline"
                            className="bg-secondary text-secondary-foreground"
                          >
                            {label}
                          </Badge>
                        );
                      })}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
