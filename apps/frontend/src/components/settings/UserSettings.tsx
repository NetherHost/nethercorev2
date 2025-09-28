"use client";

import React, { useState } from "react";
import Button from "../Button";
import Input from "../ui/Input";
import Select from "../ui/Select";
import StatCard from "../ui/StatCard";

interface User {
  _id: string;
  discord_id: string;
  discord_username: string;
  discord_avatar?: string;
  role: "admin" | "user";
  created_at: Date;
  updated_at: Date;
}

interface UserSettingsProps {
  users?: User[];
  onSave?: (users: User[]) => void;
}

export default function UserSettings({
  users = [],
  onSave,
}: UserSettingsProps) {
  const [userList, setUserList] = useState<User[]>(users);
  const [newUser, setNewUser] = useState({
    discord_id: "",
    discord_username: "",
    discord_avatar: "",
    role: "user" as "admin" | "user",
  });

  const handleSave = () => {
    onSave?.(userList);
  };

  const addUser = () => {
    if (newUser.discord_id && newUser.discord_username) {
      const user: User = {
        _id: `temp_${Date.now()}`,
        discord_id: newUser.discord_id,
        discord_username: newUser.discord_username,
        discord_avatar: newUser.discord_avatar,
        role: newUser.role,
        created_at: new Date(),
        updated_at: new Date(),
      };
      setUserList((prev) => [...prev, user]);
      setNewUser({
        discord_id: "",
        discord_username: "",
        discord_avatar: "",
        role: "user",
      });
    }
  };

  const removeUser = (index: number) => {
    setUserList((prev) => prev.filter((_, i) => i !== index));
  };

  const updateUserRole = (index: number, role: "admin" | "user") => {
    setUserList((prev) =>
      prev.map((user, i) =>
        i === index ? { ...user, role, updated_at: new Date() } : user
      )
    );
  };

  const updateUserUsername = (index: number, username: string) => {
    setUserList((prev) =>
      prev.map((user, i) =>
        i === index
          ? { ...user, discord_username: username, updated_at: new Date() }
          : user
      )
    );
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-600 text-white";
      case "user":
        return "bg-blue-600 text-white";
      default:
        return "bg-neutral-600 text-white";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return "fas fa-crown";
      case "user":
        return "fas fa-user";
      default:
        return "fas fa-question";
    }
  };

  return (
    <div className="bg-black/50 backdrop-blur-md rounded-xl p-6 border border-neutral-800 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">
          <i className="fas fa-user-cog text-red-500"></i>
        </div>
        <h2 className="text-xl font-semibold text-white">User Settings</h2>
      </div>

      <div className="space-y-6">
        <div className="bg-black/50 rounded-lg p-4 border border-neutral-800">
          <h3 className="text-white font-medium mb-4">Add New User</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Discord ID"
              value={newUser.discord_id}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  discord_id: e.target.value,
                }))
              }
              placeholder="Enter Discord ID"
              icon={<i className="fas fa-id-card"></i>}
            />

            <Input
              label="Username"
              value={newUser.discord_username}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  discord_username: e.target.value,
                }))
              }
              placeholder="Enter username"
              icon={<i className="fas fa-user"></i>}
            />

            <Input
              label="Avatar URL"
              description="Optional avatar URL"
              variant="url"
              value={newUser.discord_avatar}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  discord_avatar: e.target.value,
                }))
              }
              placeholder="Enter avatar URL (optional)"
              icon={<i className="fas fa-image"></i>}
            />

            <Select
              label="Role"
              value={newUser.role}
              onChange={(e) =>
                setNewUser((prev) => ({
                  ...prev,
                  role: e.target.value as "admin" | "user",
                }))
              }
              options={[
                { value: "user", label: "User" },
                { value: "admin", label: "Admin" },
              ]}
              icon={<i className="fas fa-crown"></i>}
            />
          </div>

          <div className="mt-4">
            <Button onClick={addUser} variant="primary" size="sm">
              <i className="fas fa-user-plus"></i>
              Add User
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-white font-medium mb-4">
            Users ({userList.length})
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {userList.length === 0 ? (
              <div className="text-center py-8 text-neutral-400">
                <div className="w-12 h-12 bg-gray-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <i className="fas fa-users text-neutral-400"></i>
                </div>
                <p>No users added yet</p>
              </div>
            ) : (
              userList.map((user, index) => (
                <div
                  key={index}
                  className="bg-black/50 rounded-lg p-4 border border-neutral-800"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {user.discord_avatar ? (
                          <img
                            src={user.discord_avatar}
                            alt={user.discord_username}
                            className="w-10 h-10 rounded-full border-2 border-neutral-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center">
                            <i className="fas fa-user text-neutral-400"></i>
                          </div>
                        )}
                        <div
                          className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getRoleColor(
                            user.role
                          )} flex items-center justify-center`}
                        >
                          <i
                            className={`${getRoleIcon(user.role)} text-xs`}
                          ></i>
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-medium">
                          {user.discord_username}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          ID: {user.discord_id}
                        </div>
                        <div className="text-neutral-400 text-sm">
                          Created:{" "}
                          {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) =>
                          updateUserRole(
                            index,
                            e.target.value as "admin" | "user"
                          )
                        }
                        className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => removeUser(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>

                  <Input
                    label="Username"
                    value={user.discord_username}
                    onChange={(e) => updateUserUsername(index, e.target.value)}
                    icon={<i className="fas fa-user"></i>}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Users"
            value={userList.length}
            icon={<i className="fas fa-users"></i>}
            color="blue"
          />
          <StatCard
            title="Admins"
            value={userList.filter((user) => user.role === "admin").length}
            icon={<i className="fas fa-crown"></i>}
            color="red"
          />
          <StatCard
            title="Regular Users"
            value={userList.filter((user) => user.role === "user").length}
            icon={<i className="fas fa-user"></i>}
            color="green"
          />
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} variant="primary">
            <i className="fas fa-save"></i>
            Save User Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
