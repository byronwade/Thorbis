/**
 * Optimistic Form Example
 *
 * Demonstrates optimistic UI updates for forms
 * Use this pattern for all forms with server actions
 */

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  useOptimisticList,
  useOptimisticMutation,
} from "@/hooks/use-optimistic-mutation";

// Example: Customer creation with optimistic UI
export function OptimisticCustomerForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { mutate, isLoading, error } = useOptimisticMutation(
    async (data: { name: string; email: string }) => {
      // Replace with your actual server action
      const response = await fetch("/api/customers", {
        method: "POST",
        body: JSON.stringify(data),
      });
      const result = await response.json();
      return result;
    },
    {
      onSuccess: (data) => {
        console.log("Customer created:", data);
        setName("");
        setEmail("");
      },
      onError: (error) => {
        console.error("Failed to create customer:", error);
      },
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Optimistic update - UI updates immediately
    await mutate(
      { name, email },
      { name, email, id: `temp-${Date.now()}` } // Optimistic data
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Customer (Optimistic)</CardTitle>
        <CardDescription>Form with instant feedback</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <Input
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              required
              value={name}
            />
          </div>
          <div>
            <Input
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              type="email"
              value={email}
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button disabled={isLoading} type="submit">
            {isLoading ? "Creating..." : "Create Customer"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

// Example: Todo list with optimistic updates
export function OptimisticTodoList() {
  const { items, isPending, addItem, updateItem, deleteItem } =
    useOptimisticList<{
      id: string;
      title: string;
      completed: boolean;
    }>([]);

  const [newTodo, setNewTodo] = useState("");

  const handleAdd = () => {
    if (!newTodo.trim()) return;

    const todo = {
      id: `temp-${Date.now()}`,
      title: newTodo,
      completed: false,
    };

    addItem(todo, async () => {
      // Replace with your server action
      await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify(todo),
      });
    });

    setNewTodo("");
  };

  const handleToggle = (id: string, completed: boolean) => {
    updateItem(id, { completed: !completed }, async () => {
      // Replace with your server action
      await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ completed: !completed }),
      });
    });
  };

  const handleDelete = (id: string) => {
    deleteItem(id, async () => {
      // Replace with your server action
      await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Todo List (Optimistic)</CardTitle>
        <CardDescription>
          Instant updates with rollback on error
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="New todo"
            value={newTodo}
          />
          <Button disabled={isPending} onClick={handleAdd}>
            Add
          </Button>
        </div>

        <div className="space-y-2">
          {items.map((item) => (
            <div
              className="flex items-center gap-2 rounded border p-2"
              key={item.id}
            >
              <input
                checked={item.completed}
                className="size-4"
                onChange={() => handleToggle(item.id, item.completed)}
                type="checkbox"
              />
              <span
                className={
                  item.completed ? "text-muted-foreground line-through" : ""
                }
              >
                {item.title}
              </span>
              <Button
                className="ml-auto"
                onClick={() => handleDelete(item.id)}
                size="sm"
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          ))}
        </div>

        {isPending && (
          <p className="text-muted-foreground text-sm">Syncing...</p>
        )}
      </CardContent>
    </Card>
  );
}
