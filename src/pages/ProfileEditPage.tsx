import { useEffect, useMemo, useState } from "react";
import {
  userService,
  type UpdateProfileRequest,
  type UserProfile,
} from "@/services/userService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useTitle } from "@/hooks";
import { normalizeEnvelope } from "@/utils/apiHelpers";
import type { ApiEnvelope } from "@/types";

type ProfileForm = {
  displayName: string;
  bio: string;
  gender: "male" | "female" | "unspecified";
  dob: string;
  avatarUrl: string;
};

type AccountForm = {
  username: string;
  email: string;
};

const mapProfileToForm = (p: UserProfile): ProfileForm => ({
  displayName: p.displayName || "",
  bio: p.bio || "",
  gender:
    p.gender === true ? "male" : p.gender === false ? "female" : "unspecified",
  dob: p.dob ? p.dob.substring(0, 10) : "",
  avatarUrl: p.avatarUrl || "",
});

const ProfileEditPage = () => {
  useTitle("Edit Profile");

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [pf, setPf] = useState<ProfileForm>({
    displayName: "",
    bio: "",
    gender: "unspecified",
    dob: "",
    avatarUrl: "",
  });
  const [af, setAf] = useState<AccountForm>({ username: "", email: "" });

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await userService.getCurrent();
        const data: UserProfile = normalizeEnvelope<UserProfile>(
          res.data as UserProfile | ApiEnvelope<UserProfile>
        );
        if (!mounted) return;
        setProfile(data);
        setPf(mapProfileToForm(data));
        setAf({
          username: data.username,
          email: data.pendingEmail || data.email,
        });
      } catch {
        toast.error("Failed to load profile");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const canSaveProfile = useMemo(() => {
    if (!profile) return false;
    const current = mapProfileToForm(profile);
    return JSON.stringify(current) !== JSON.stringify(pf);
  }, [profile, pf]);

  const canSaveAccount = useMemo(() => {
    if (!profile) return false;
    return (
      profile.username !== af.username ||
      (profile.pendingEmail || profile.email) !== af.email
    );
  }, [profile, af]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingProfile(true);
    const payload: UpdateProfileRequest = {
      displayName: pf.displayName.trim(),
      bio: pf.bio.trim() || null,
      gender: pf.gender === "unspecified" ? null : pf.gender === "male",
      dob: pf.dob || null,
      avatarUrl: pf.avatarUrl.trim() || null,
    };
    try {
      const res = await userService.updateCurrent(payload);
      const updated: UserProfile = normalizeEnvelope<UserProfile>(
        res.data as UserProfile | ApiEnvelope<UserProfile>
      );
      setProfile(updated);
      setPf(mapProfileToForm(updated));
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAccountSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSavingAccount(true);
    try {
      if (profile.username !== af.username) {
        await userService.updateCurrentUsername({
          username: af.username.trim(),
        });
      }
      const emailToUpdate = af.email.trim();
      const currentEmail = profile.pendingEmail || profile.email;
      if (emailToUpdate && emailToUpdate !== currentEmail) {
        await userService.updateCurrentEmail({ email: emailToUpdate });
      }
      const refreshed = await userService.getCurrent();
      const data: UserProfile = normalizeEnvelope<UserProfile>(
        refreshed.data as UserProfile | ApiEnvelope<UserProfile>
      );
      setProfile(data);
      setAf({
        username: data.username,
        email: data.pendingEmail || data.email,
      });
      toast.success("Account updated");
    } catch {
      toast.error("Failed to update account");
    } finally {
      setSavingAccount(false);
    }
  };

  if (loading) {
    return <div className="w-full py-16 text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="w-full py-16 text-center">Profile not found</div>;
  }

  return (
    <div className="w-full max-w-3xl py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

      <form onSubmit={handleProfileSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 ml-1">Display name</Label>
            <Input
              value={pf.displayName}
              onChange={(e) => setPf({ ...pf, displayName: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 ml-1">Date of birth</Label>
            <Input
              type="date"
              value={pf.dob}
              onChange={(e) => setPf({ ...pf, dob: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 ml-1">Gender</Label>
            <Select
              value={pf.gender}
              onValueChange={(v) =>
                setPf({ ...pf, gender: v as ProfileForm["gender"] })
              }
            >
              <SelectTrigger className="w-full" size="default">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="mb-2 ml-1">Avatar URL</Label>
            <Input
              placeholder="https://..."
              value={pf.avatarUrl}
              onChange={(e) => setPf({ ...pf, avatarUrl: e.target.value })}
            />
          </div>
        </div>
        <div>
          <Label className="mb-2 ml-1">Bio</Label>
          <Textarea
            value={pf.bio}
            onChange={(e) => setPf({ ...pf, bio: e.target.value })}
            placeholder="Tell something about you"
          />
        </div>
        {pf.avatarUrl && (
          <div className="flex items-center gap-4">
            <img
              src={pf.avatarUrl}
              alt="avatar preview"
              className="w-16 h-16 rounded object-cover"
            />
            <span className="text-sm text-muted-foreground">Preview</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button
            variant="outline"
            type="submit"
            disabled={!canSaveProfile || savingProfile}
          >
            {savingProfile ? "Saving..." : "Save profile"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setPf(mapProfileToForm(profile))}
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="my-8">
        <Separator />
      </div>

      <form onSubmit={handleAccountSubmit} className="space-y-4">
        <h2 className="text-xl font-semibold">Account</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label className="mb-2 ml-1">Username</Label>
            <Input
              value={af.username}
              onChange={(e) => setAf({ ...af, username: e.target.value })}
            />
          </div>
          <div>
            <Label className="mb-2 ml-1">Email</Label>
            <Input
              type="email"
              value={af.email}
              onChange={(e) => setAf({ ...af, email: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            type="submit"
            disabled={!canSaveAccount || savingAccount}
          >
            {savingAccount ? "Saving..." : "Save account"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              setAf({
                username: profile.username,
                email: profile.pendingEmail || profile.email,
              })
            }
          >
            Reset
          </Button>
        </div>
      </form>

      <div className="my-8">
        <Separator />
      </div>
    </div>
  );
};

export default ProfileEditPage;
