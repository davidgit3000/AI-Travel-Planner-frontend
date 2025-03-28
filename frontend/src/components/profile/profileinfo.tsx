"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function ProfileDetails() {
  const [editMode, setEditMode] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Personal Information
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Anderson");
  const [email, setEmail] = useState("john.anderson@example.com");
  const [phone, setPhone] = useState("123456");
  const [address, setAddress] = useState("123 Main St");

  const inputClassName = `border-slate-300 focus:border-slate-500 ${
    !editMode
      ? "bg-slate-200 dark:bg-slate-700/40 cursor-not-allowed"
      : "focus-ring-2 bg-background dark:bg-slate-600/90" // view : edit
  }`;

  useEffect(() => {
    if (editMode && firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, [editMode]);

  return (
    <div className="w-full md:w-2/3 p-6 text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-10 mb-6">
        <h2 className="text-4xl font-bold mb-4 sm:mb-0">
          {firstName} {lastName}
        </h2>
        <button
          onClick={() => setEditMode((prev) => !prev)}
          className="px-8 h-10 text-white bg-blue-600 hover:bg-blue-500 rounded-md transition-colors"
        >
          {editMode ? "Save Changes" : "Edit Profile"}
        </button>
      </div>

      <Card className="bg-background text-foreground border-slate-300 rounded-xl shadow-lg shadow-slate-400">
        <CardContent className="p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                ref={firstNameInputRef}
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                readOnly={!editMode}
                className={inputClassName}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                readOnly={!editMode}
                className={inputClassName}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!editMode}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!editMode}
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly={!editMode}
              className={inputClassName}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
