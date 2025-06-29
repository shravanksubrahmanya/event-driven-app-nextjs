"use client";

import { Todo } from "@/generated/prisma";
import { useUser } from "@clerk/nextjs";
import { error } from "console";
import React, { useCallback, useEffect, useState } from "react";
import { useDebounceValue } from "usehooks-ts";

function Dashboard() {
  const { user } = useUser();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [totalPages, setTotalPages] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionEnds, setSubscriptionEnds] = useState();
  /* usestate automatically updates if any changes happen to search term
    we are delaying that process by using usedebounceTerm to 300 ml
    */
  const [debounceSearchTerm] = useDebounceValue(searchTerm, 300);

  const fetchTodos = useCallback(
    async (page: number) => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/todos?page=${page}&search=${debounceSearchTerm}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch todos");
        }
        const data = await response.json();
        setTodos(data.todos);
        setTotalPages(data.totalPages);
        setCurrentPage(data.currentPage);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    },
    [debounceSearchTerm]
  );

  useEffect(() => {
    fetchTodos(1);
    fetchSubscriptionStatus();
  }, []);

  const fetchSubscriptionStatus = async () => {
    const response = await fetch("/api/subscription");
    if (!response.ok) {
      console.error("Filed to fetch subscription status");
    }
    const data = await response.json();
    setIsSubscribed(data.isSubscribed);
  };

  const handleAddTodo = async (title: string) => {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        throw new Error("Failed to add todo");
      }
      await fetchTodos(currentPage);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTodo = async (id: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error("Failed to update todo");
      }

      await fetchTodos(currentPage);
    } catch (error) {
      console.error("Error while updating tido");
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const response = await fetch(`/api/todo/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to update todo");
    }

    await fetchTodos(currentPage);
  };

  return <div></div>;
}

export default Dashboard;
