"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getCurrentUser, updateUser } from "@/app/api/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function ProfileInfo() {
  const router = useRouter();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const firstNameInputRef = useRef<HTMLInputElement>(null);

  // Personal Information
  const [userId, setUserId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Track original values for change detection
  const [originalValues, setOriginalValues] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
  });

  const inputClassName = `border-slate-300 focus:border-slate-500 ${
    !editMode
      ? "bg-slate-200 dark:bg-slate-700/40 cursor-not-allowed"
      : "focus-ring-2 bg-background dark:bg-slate-600/90" // view : edit
  }`;

  useEffect(() => {
    async function loadUserData() {
      try {
        const user = await getCurrentUser();
        if (!user) {
          toast.error("User not authenticated. Please sign in first");
          router.push("/sign-in");
          return;
        }

        setUserId(user.userId);
        const [first, ...rest] = user.fullName.split(" ");
        const newFirstName = first;
        const newLastName = rest.join(" ");
        const newPhone = user.phoneNumber || "";
        const newAddress = user.address || "";

        setFirstName(newFirstName);
        setLastName(newLastName);
        setEmail(user.email);
        setPhone(newPhone);
        setAddress(newAddress);

        // Set original values
        setOriginalValues({
          firstName: newFirstName,
          lastName: newLastName,
          phone: newPhone,
          address: newAddress,
        });
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Could not load user data");
      } finally {
        setIsLoading(false);
      }
    }

    loadUserData();
  }, [router]);

  useEffect(() => {
    if (editMode && firstNameInputRef.current) {
      firstNameInputRef.current.focus();
    }
  }, [editMode]);

  const handleSave = async () => {
    if (!userId) return;

    setIsSaving(true);
    try {
      await updateUser(userId, {
        fullName: `${firstName} ${lastName}`.trim(),
        phoneNumber: phone,
        address,
      });

      setEditMode(false);
      setOriginalValues({
        firstName,
        lastName,
        phone,
        address,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Could not update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="text-gray-500 dark:text-gray-400">Please wait...</p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-2/3 p-6 text-foreground">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center my-10 mb-6">
        <h2 className="text-4xl font-bold mb-4 sm:mb-0">
          {firstName} {lastName}
        </h2>
        <div className="flex gap-3">
          {editMode ? (
            <>
              <button
                onClick={() => {
                  setFirstName(originalValues.firstName);
                  setLastName(originalValues.lastName);
                  setPhone(originalValues.phone);
                  setAddress(originalValues.address);
                  setEditMode(false);
                }}
                className="px-8 h-10 font-bold text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  (firstName === originalValues.firstName &&
                    lastName === originalValues.lastName &&
                    phone === originalValues.phone &&
                    address === originalValues.address)
                }
                className="px-8 h-10 font-bold text-white bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center gap-2 cursor-pointer"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="ml-2">Saving Changes...</span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              className="px-8 h-10 text-white bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 rounded-md transition-colors flex items-center gap-2 cursor-pointer"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <Card className="bg-background text-foreground border-slate-300 rounded-xl shadow-lg shadow-slate-400">
        <CardContent className="p-6 space-y-8">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              readOnly
              className={"bg-slate-200 dark:bg-slate-700/40 cursor-not-allowed"}
            />
          </div>
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
