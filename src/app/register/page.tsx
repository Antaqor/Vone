"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { BASE_URL } from "../lib/config";

/** Helper validations **/
const isValidPhoneNumber = (phone: string) => {
    const regex = /^\+?\d{8,15}$/;
    return regex.test(phone);
};

const isValidPassword = (password: string) => {
    return password.length >= 6;
};

// Adjust if you want different min/max sizes:
const MIN_FILE_SIZE = 10 * 1024;        // 10KB
const MAX_FILE_SIZE = 5 * 1024 * 1024;  // 5MB

export default function RegisterMultiStepPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialInvite = searchParams.get("invite") || "";

    // ---------- STEP CONTROL ----------
    const [step, setStep] = useState(1);

    // ---------- STEP 1 FIELDS (NO name) ----------
    const [username, setUsername] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [birthMonth, setBirthMonth] = useState("");
    const [birthDay, setBirthDay] = useState("");
    const [birthYear, setBirthYear] = useState("");
    const [inviteCode, setInviteCode] = useState(initialInvite);

    // ---------- STEP 2 FIELDS ----------
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [location, setLocation] = useState("");
    const [profilePicture, setProfilePicture] = useState<File | null>(null);

    // ---------- GENERAL UI STATES ----------
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ---------- FIELD-SPECIFIC ERRORS ----------
    const [fieldErrors, setFieldErrors] = useState<{
        [key: string]: string;
    }>({
        username: "",
        phoneNumber: "",
        birthMonth: "",
        birthDay: "",
        birthYear: "",
        password: "",
        gender: "",
        location: "",
        profilePicture: "",
        inviteCode: "",
    });

    // Replace with your actual server endpoint

    // ------------------------------------------------------------------
    // STEP 1: Validate Basic Fields and proceed to next step
    // ------------------------------------------------------------------
    const handleNext = () => {
        setError("");
        setSuccess("");
        setFieldErrors({
            username: "",
            phoneNumber: "",
            birthMonth: "",
            birthDay: "",
            birthYear: "",
            password: "",
            gender: "",
            location: "",
            profilePicture: "",
            inviteCode: "",
        });

        const errors: { [key: string]: string } = {};

        if (!username.trim()) {
            errors.username = "Please enter a username.";
        }
        if (!isValidPhoneNumber(phoneNumber)) {
            errors.phoneNumber = "Invalid phone number.";
        }
        if (!birthMonth) {
            errors.birthMonth = "Please select a birth month.";
        }
        if (!birthDay) {
            errors.birthDay = "Please select a birth day.";
        }
        if (!birthYear) {
            errors.birthYear = "Please select a birth year.";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors((prev) => ({ ...prev, ...errors }));
            return;
        }

        // Proceed to Step 2
        setStep(2);
    };

    // ------------------------------------------------------------------
    // STEP 2: Validate Additional Fields & Final Submit
    // ------------------------------------------------------------------
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setFieldErrors({
            username: "",
            phoneNumber: "",
            birthMonth: "",
            birthDay: "",
            birthYear: "",
            password: "",
            gender: "",
            location: "",
            profilePicture: "",
            inviteCode: "",
        });

        const errors: { [key: string]: string } = {};

        if (!isValidPassword(password)) {
            errors.password = "Password must be at least 6 characters.";
        }
        if (!gender.trim()) {
            errors.gender = "Please select your gender.";
        }
        if (!location.trim()) {
            errors.location = "Please enter your location.";
        }
        if (!profilePicture) {
            errors.profilePicture = "Please upload a profile picture.";
        }
        if (!inviteCode.trim()) {
            errors.inviteCode = "Урилгын код шаардлагатай";
        }

        if (Object.keys(errors).length > 0) {
            setFieldErrors((prev) => ({ ...prev, ...errors }));
            return;
        }

        // Construct final form data
        try {
            const formData = new FormData();

            // Step 1 data
            formData.append("username", username);
            formData.append("phoneNumber", phoneNumber);
            formData.append(
                "birthday",
                JSON.stringify({
                    year: birthYear,
                    month: birthMonth,
                    day: birthDay,
                })
            );

            // Step 2 data
            formData.append("password", password);
            formData.append("gender", gender);
            formData.append("location", location);
            if (profilePicture) {
                formData.append("profilePicture", profilePicture);
            }
            if (inviteCode) {
                formData.append("inviteCode", inviteCode);
            }

            const res = await axios.post(`${BASE_URL}/api/auth/register`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.status === 201) {
                setSuccess("Registration successful");
                // Clear all fields
                setStep(1);
                setUsername("");
                setPhoneNumber("");
                setBirthMonth("");
                setBirthDay("");
                setBirthYear("");
                setPassword("");
                setGender("");
                setLocation("");
                setProfilePicture(null);
                // Redirect new users to login page
                router.push("/login");
            }
        } catch (err: any) {
            console.error("Register error:", err);
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    // ------------------------------------------------------------------
    // CLIENT-SIDE FILE CHECK: ensure size (10KB–5MB) + image type
    // ------------------------------------------------------------------
    const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");
        setFieldErrors((prev) => ({ ...prev, profilePicture: "" }));

        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        const file = e.target.files[0];

        // Check size
        if (file.size < MIN_FILE_SIZE || file.size > MAX_FILE_SIZE) {
            setFieldErrors((prev) => ({
                ...prev,
                profilePicture: `Image must be between 10KB and 5MB (current: ${(file.size / 1024).toFixed(
                    1
                )} KB).`,
            }));
            return;
        }

        // Check MIME type
        if (!file.type.startsWith("image/")) {
            setFieldErrors((prev) => ({
                ...prev,
                profilePicture: "Only image files are allowed.",
            }));
            return;
        }

        // If everything is good, store file
        setProfilePicture(file);
    };

    // ---------- Utility: conditional className for inputs/selects ----------
    const getInputClass = (fieldName: string) => {
        return `w-full rounded-md px-3 py-2 bg-inputBg text-white focus:outline-none focus:ring-2 ${
            fieldErrors[fieldName]
                ? "border border-red-500 focus:ring-red-500"
                : "border border-gray-700 focus:ring-brand"
        }`;
    };

    return (
        <div className="w-full max-w-lg space-y-20 text-white p-4 sm:p-10">
            <div
                className="
            w-full
            max-w-md
            space-y-6
            text-white
            p-0
            bg-transparent
            rounded-none
            shadow-none
            backdrop-blur-none
            /* Only show card styles on sm and up */
            sm:bg-backgroundDark/80
            sm:backdrop-blur
            sm:p-8
            sm:rounded-2xl
            sm:shadow-2xl
        "
            >
                {error && <p className="text-red-600">{error}</p>}
                {success && <p className="text-green-600">{success}</p>}

                {step === 1 && (
                    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <h1 className="text-3xl font-bold text-black">Create Account</h1>

                        {/* USERNAME */}
                        <div>
                            <label className="block font-medium text-black mb-1">Username</label>
                            <input
                                type="text"
                                className={getInputClass("username")}
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                            {fieldErrors.username && (
                                <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
                            )}
                        </div>

                        {/* PHONE NUMBER */}
                        <div>
                            <label className="block font-medium text-black mb-1">Phone Number</label>
                            <input
                                type="text"
                                className={getInputClass("phoneNumber")}
                                placeholder="94641031"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            />
                        {fieldErrors.phoneNumber && (
                                <p className="text-red-500 text-sm mt-1">{fieldErrors.phoneNumber}</p>
                            )}
                        </div>

                        {/* INVITE CODE */}
                        <div>
                            <label className="block font-medium text-black mb-1">Урилгын код</label>
                            <input
                                type="text"
                                className={getInputClass("inviteCode")}
                                placeholder="Invite code"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                            />
                            {fieldErrors.inviteCode && (
                                <p className="text-red-500 text-sm mt-1">{fieldErrors.inviteCode}</p>
                            )}
                        </div>

                        {/* DATE OF BIRTH */}
                        <div>
                            <label className="block font-medium text-black mb-1">Date of Birth</label>
                            <p className="text-xs text-gray-500 mb-2">
                                This information won't be public. Please verify your age.
                            </p>
                            <div className="flex space-x-2">
                                <select
                                    className={getInputClass("birthMonth")}
                                    value={birthMonth}
                                    onChange={(e) => setBirthMonth(e.target.value)}
                                >
                                    <option value="">Month</option>
                                    {[
                                        "January",
                                        "February",
                                        "March",
                                        "April",
                                        "May",
                                        "June",
                                        "July",
                                        "August",
                                        "September",
                                        "October",
                                        "November",
                                        "December",
                                    ].map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className={getInputClass("birthDay")}
                                    value={birthDay}
                                    onChange={(e) => setBirthDay(e.target.value)}
                                >
                                    <option value="">Day</option>
                                    {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                                        <option key={d} value={d}>
                                            {d}
                                        </option>
                                    ))}
                                </select>
                                <select
                                    className={getInputClass("birthYear")}
                                    value={birthYear}
                                    onChange={(e) => setBirthYear(e.target.value)}
                                >
                                    <option value="">Year</option>
                                    {Array.from({ length: 70 }, (_, i) => 2025 - i).map((y) => (
                                        <option key={y} value={y}>
                                            {y}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {(fieldErrors.birthMonth ||
                                fieldErrors.birthDay ||
                                fieldErrors.birthYear) && (
                                <p className="text-red-500 text-sm mt-1">
                                    {fieldErrors.birthMonth || fieldErrors.birthDay || fieldErrors.birthYear}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleNext}
                            className="w-full bg-brand text-white font-semibold py-3 rounded-md hover:opacity-90 transition"
                        >
                            Next
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <h1 className="text-3xl font-bold text-black">Additional Information</h1>

                        {/* LOGIN PASSWORD */}
                        <div>
                            <label className="block text-sm font-medium text-brand mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                className={getInputClass("password")}
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {fieldErrors.password && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.password}</p>
                            )}
                        </div>

                        {/* GENDER */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Gender</label>
                            <select
                                className={getInputClass("gender")}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <option value="">Select</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                            {fieldErrors.gender && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.gender}</p>
                            )}
                        </div>

                        {/* LOCATION */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Location
                            </label>
                            <input
                                type="text"
                                className={getInputClass("location")}
                                placeholder="Location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                            {fieldErrors.location && (
                                <p className="text-red-500 text-xs mt-1">{fieldErrors.location}</p>
                            )}
                        </div>

                        {/* PROFILE PICTURE + LOCAL SIZE CHECK */}
                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className={getInputClass("profilePicture")}
                                onChange={handleProfilePictureChange}
                            />
                            {fieldErrors.profilePicture && (
                                <p className="text-red-500 text-xs mt-1">
                                    {fieldErrors.profilePicture}
                                </p>
                            )}
                        </div>

                        {/* BUTTONS */}
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 bg-gray-200 text-black py-3 rounded-md font-semibold hover:bg-gray-300 transition"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                className="flex-1 bg-brand text-white py-3 rounded-md font-semibold hover:opacity-90 transition"
                            >
                                Sign Up
                            </button>
                        </div>
                    </form>
                )}
                <button
                    type="button"
                    onClick={() => router.push("/login")}
                    className="block w-full text-sm font-medium text-brand underline hover:opacity-90"
                >
                    Back
                </button>
            </div>
        </div>
    );
}
